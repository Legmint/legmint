import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerationService } from '../services/generation.service';
import {
  GenerationRequestDto,
  DocumentGenerationRequestDto,
  QuestionnaireValidationDto,
} from '../dto';
import { Request } from 'express';

@ApiTags('Generation')
@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate HTML preview of rendered document' })
  @ApiResponse({
    status: 200,
    description: 'Preview generated successfully',
  })
  async generatePreview(
    @Body() dto: GenerationRequestDto,
    @Req() req: Request,
  ) {
    // TODO: Get userId from JWT token once auth is implemented
    const userId = 'temp-user-id'; // Placeholder

    const result = await this.generationService.generatePreview(
      userId,
      dto.templateCode,
      dto.jurisdiction,
      dto.answers,
      req.ip,
      req.headers['user-agent'],
    );

    return {
      preview_url: result.previewUrl,
      expires_at: result.expiresAt,
      template_code: dto.templateCode,
    };
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate final documents (PDF/DOCX)' })
  @ApiResponse({
    status: 200,
    description: 'Documents generated successfully',
  })
  async generateDocuments(
    @Body() dto: DocumentGenerationRequestDto,
    @Req() req: Request,
  ) {
    // TODO: Get userId from JWT token once auth is implemented
    const userId = 'temp-user-id'; // Placeholder

    const result = await this.generationService.generateDocuments(
      userId,
      dto.templateCode,
      dto.jurisdiction,
      dto.answers,
      dto.formats,
      req.ip,
      req.headers['user-agent'],
    );

    return result;
  }

  @Post('questionnaire/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate questionnaire answers' })
  @ApiResponse({
    status: 200,
    description: 'Validation completed',
  })
  async validateQuestionnaire(@Body() dto: QuestionnaireValidationDto) {
    // This is a simple validation endpoint
    // In production, this would validate against the template's JSON Schema
    return {
      valid: true,
      errors: [],
    };
  }
}
