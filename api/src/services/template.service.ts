import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { RedisService } from './redis.service';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
    private redisService: RedisService,
  ) {}

  /**
   * Find template by code
   */
  async findByCode(templateCode: string): Promise<Template> {
    // Try cache first
    const cacheKey = `template:${templateCode}`;
    const cached = await this.redisService.get<Template>(cacheKey);

    if (cached) {
      this.logger.debug(`Template ${templateCode} found in cache`);
      return cached;
    }

    // Fetch from database
    const template = await this.templateRepository.findOne({
      where: { templateCode, isActive: true },
    });

    if (!template) {
      throw new NotFoundException(`Template ${templateCode} not found`);
    }

    // Cache for next time
    await this.redisService.set(cacheKey, template, this.CACHE_TTL);

    return template;
  }

  /**
   * Find all templates by pack
   */
  async findByPack(pack: string): Promise<Template[]> {
    const cacheKey = `templates:pack:${pack}`;
    const cached = await this.redisService.get<Template[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const templates = await this.templateRepository.find({
      where: { pack, isActive: true },
      order: { usageCount: 'DESC' },
    });

    await this.redisService.set(cacheKey, templates, this.CACHE_TTL);

    return templates;
  }

  /**
   * Get all active templates
   */
  async findAll(): Promise<Template[]> {
    const cacheKey = 'templates:all';
    const cached = await this.redisService.get<Template[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const templates = await this.templateRepository.find({
      where: { isActive: true },
      order: { usageCount: 'DESC', name: 'ASC' },
    });

    await this.redisService.set(cacheKey, templates, this.CACHE_TTL);

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

      // Invalidate cache
      const cacheKey = `template:${templateCode}`;
      await this.redisService.del(cacheKey);

      this.logger.log(`Incremented usage count for template ${templateCode}`);
    } catch (error) {
      this.logger.error(
        `Failed to increment usage count: ${error.message}`,
      );
    }
  }

  /**
   * Get template with jurisdiction overlay
   */
  async getTemplateWithOverlay(
    templateCode: string,
    jurisdiction: string,
  ): Promise<any> {
    const template = await this.findByCode(templateCode);

    // Apply jurisdiction overlay if it exists
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
  private mergeClauses(baseClauses: any[], overlayClauses: any[]): any[] {
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
