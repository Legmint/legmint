import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditLogStatus } from '../entities/audit-log.entity';
import * as crypto from 'crypto';

export interface CreateAuditLogDto {
  userId: string;
  templateCode: string;
  templateVersion: string;
  jurisdiction: string;
  answers: Record<string, any>;
  outputFormats: string[];
  status: AuditLogStatus;
  renderTimeMs?: number;
  errorMessage?: string;
  outputUrls?: Record<string, string>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create a new audit log entry
   */
  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    try {
      const inputsHash = this.hashInputs(dto.answers);
      const inputsSummary = this.createInputsSummary(dto.answers);

      const auditLog = this.auditLogRepository.create({
        userId: dto.userId,
        templateCode: dto.templateCode,
        templateVersion: dto.templateVersion,
        jurisdiction: dto.jurisdiction,
        inputsHash,
        inputsSummary,
        outputFormats: dto.outputFormats,
        status: dto.status,
        renderTimeMs: dto.renderTimeMs,
        errorMessage: dto.errorMessage,
        outputUrls: dto.outputUrls,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      });

      const saved = await this.auditLogRepository.save(auditLog);

      this.logger.log(
        `Created audit log ${saved.id} for user ${dto.userId}, template ${dto.templateCode}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find audit logs by user ID
   */
  async findByUserId(
    userId: string,
    limit: number = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Find audit logs by template code
   */
  async findByTemplateCode(
    templateCode: string,
    limit: number = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { templateCode },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Find audit log by ID
   */
  async findById(id: string): Promise<AuditLog | null> {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  /**
   * Hash user inputs for privacy and deduplication
   */
  private hashInputs(inputs: Record<string, any>): string {
    const normalized = JSON.stringify(inputs, Object.keys(inputs).sort());
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Create a summary of inputs (without sensitive data)
   */
  private createInputsSummary(inputs: Record<string, any>): Record<string, any> {
    // Create a safe summary without actual values
    const summary: Record<string, any> = {};
    for (const key of Object.keys(inputs)) {
      const value = inputs[key];
      summary[key] = {
        type: typeof value,
        provided: value !== null && value !== undefined,
      };
    }
    return summary;
  }
}
