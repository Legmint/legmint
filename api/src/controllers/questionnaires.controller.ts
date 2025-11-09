import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TemplateService } from '../services/template.service';

@ApiTags('Questionnaires')
@Controller('v1/questionnaire')
export class QuestionnairesController {
  constructor(private readonly templateService: TemplateService) {}

  @Get(':pack/:template_code')
  @ApiOperation({ summary: 'Get questionnaire for template' })
  @ApiQuery({ name: 'jurisdiction', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Questionnaire schema',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - subscription required',
  })
  @ApiResponse({
    status: 404,
    description: 'Template not found',
  })
  async getQuestionnaire(
    @Param('pack') pack: string,
    @Param('template_code') templateCode: string,
    @Query('jurisdiction') jurisdiction?: string,
  ) {
    try {
      // TODO: Check user subscription and access level
      // For now, return questionnaire without auth

      const template = await this.templateService.findByCode(templateCode);

      // Return JSON Schema questionnaire
      return {
        template_code: template.templateCode,
        version: template.version,
        schema: template.variablesSchema,
        ui_schema: {}, // UI rendering hints (optional)
      };
    } catch (error) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: `Template ${templateCode} not found`,
        },
      };
    }
  }
}
