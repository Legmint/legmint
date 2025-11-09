import {
  IsString,
  IsObject,
  IsEnum,
  IsArray,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JurisdictionCode } from '../entities/user.entity';

export enum OutputFormatEnum {
  PDF = 'pdf',
  DOCX = 'docx',
}

export class GenerationRequestDto {
  @ApiProperty({
    description: 'Template code identifier',
    example: 'SAFE_PM_V1',
  })
  @IsString()
  templateCode: string;

  @ApiProperty({
    description: 'Jurisdiction code',
    enum: JurisdictionCode,
    example: 'UK',
  })
  @IsEnum(JurisdictionCode)
  jurisdiction: JurisdictionCode;

  @ApiProperty({
    description: 'User answers matching questionnaire schema',
    example: {
      company_name: 'Acme Innovations Ltd',
      investor_name: 'Jane Investor',
      purchase_amount: 100000,
      valuation_cap: 5000000,
      date: '2025-10-22',
    },
  })
  @IsObject()
  answers: Record<string, any>;

  @ApiProperty({
    description: 'Optional metadata for audit',
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class DocumentGenerationRequestDto extends GenerationRequestDto {
  @ApiProperty({
    description: 'Output formats',
    enum: OutputFormatEnum,
    isArray: true,
    example: ['pdf', 'docx'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(OutputFormatEnum, { each: true })
  formats: OutputFormatEnum[];
}

export class QuestionnaireValidationDto {
  @ApiProperty({
    description: 'Template code identifier',
    example: 'SAFE_PM_V1',
  })
  @IsString()
  templateCode: string;

  @ApiProperty({
    description: 'Jurisdiction code',
    enum: JurisdictionCode,
    example: 'UK',
  })
  @IsEnum(JurisdictionCode)
  jurisdiction: JurisdictionCode;

  @ApiProperty({
    description: 'User answers to validate',
  })
  @IsObject()
  answers: Record<string, any>;
}
