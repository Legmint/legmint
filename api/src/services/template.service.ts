import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  /**
   * Find template by code
   */
  async findByCode(templateCode: string): Promise<Template> {
    const template = await this.templateRepository.findOne({
      where: { templateCode, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(`Template ${templateCode} not found`);
    }

    return template;
  }

  /**
   * Find all templates by pack
   */
  async findByPack(pack: string): Promise<Template[]> {
    const templates = await this.templateRepository.find({
      where: { pack, isActive: true },
      order: { usageCount: 'DESC' },
    });

    return templates;
  }

  /**
   * Get all active templates
   */
  async findAll(): Promise<Template[]> {
    const templates = await this.templateRepository.find({
      where: { isActive: true },
      order: { usageCount: 'DESC', name: 'ASC' },
    });

    return templates;
  }

  /**
   * Increment usage count
   */
  async incrementUsageCount(templateCode: string): Promise<void> {
    try {
      await this.templateRepository.increment(
        { templateCode },
        'usageCount',
        1,
      );

      this.logger.log(`Incremented usage count for template ${templateCode}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to increment usage count for template ${templateCode}: ${error.message}`,
      );
    }
  }

  /**
   * Get template with jurisdiction overlay applied (if any)
   */
  async getTemplateWithOverlay(
    templateCode: string,
    jurisdiction: string,
  ): Promise<any> {
    const template = await this.findByCode(templateCode);

    if (template.overlays && template.overlays[jurisdiction]) {
      return this.applyOverlay(template, template.overlays[jurisdiction]);
    }

    return template;
  }

  /**
   * Apply jurisdiction overlay to base template
   */
  private applyOverlay(baseTemplate: any, overlay: any): any {
    const merged = { ...baseTemplate };

    // Merge clauses
    if (overlay.overrides?.clauses) {
      merged.clauses = this.mergeClauses(
        baseTemplate.clauses,
        overlay.overrides.clauses,
      );
    }

    // Merge phrases
    if (overlay.overrides?.phrases) {
      merged.phrases = {
        ...baseTemplate.phrases,
        ...overlay.overrides.phrases,
      };
    }

    return merged;
  }

  /**
   * Merge clauses with overlay
   */
  private mergeClauses(baseClauses: any[] = [], overlayClauses: any[] = []): any[] {
    const merged = [...baseClauses];

    for (const overlayClause of overlayClauses) {
      const index = merged.findIndex((c) => c.id === overlayClause.id);

      if (index !== -1) {
        // Replace existing clause
        merged[index] = { ...merged[index], ...overlayClause };
      } else {
        // Add new clause
        merged.push(overlayClause);
      }
    }

    return merged;
  }
}