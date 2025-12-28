import {
  IsString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsOptional,
  IsNumber,
  IsIn,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnterpriseApplicationDto {
  @ApiProperty({ enum: ['enterprise', 'enterprise-ultra'] })
  @IsIn(['enterprise', 'enterprise-ultra'])
  planType: 'enterprise' | 'enterprise-ultra';

  // Company Information
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  companyName: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty()
  @IsString()
  industry: string;

  @ApiProperty({ enum: ['1-10', '11-50', '51-200', '201-500', '500+'] })
  @IsIn(['1-10', '11-50', '51-200', '201-500', '500+'])
  companySize: string;

  // Primary Contact
  @ApiProperty()
  @IsString()
  @MinLength(2)
  contactName: string;

  @ApiProperty()
  @IsString()
  contactTitle: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  // Use Case
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  useCases: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estimatedMonthlyDocuments?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  jurisdictions: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  useCaseDescription?: string;

  // Fast Track (Optional)
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referralSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasLegalCounsel?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPubliclyListed?: boolean;

  // Enterprise Ultra Specific
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountManagerTimezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  whiteLabelRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whiteLabelDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  integrationRequirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  expectedUserCount?: number;

  // Declarations (all required)
  @ApiProperty()
  @IsBoolean()
  authorizedSignatory: boolean;

  @ApiProperty()
  @IsBoolean()
  notSanctioned: boolean;

  @ApiProperty()
  @IsBoolean()
  understandsAiDisclaimer: boolean;

  @ApiProperty()
  @IsBoolean()
  agreesToTerms: boolean;
}

export class ReviewEnterpriseApplicationDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'clarification_needed'] })
  @IsIn(['approved', 'rejected', 'clarification_needed'])
  status: 'approved' | 'rejected' | 'clarification_needed';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @ApiPropertyOptional({ description: 'Required when status is clarification_needed' })
  @IsOptional()
  @IsString()
  clarificationRequest?: string;
}

export class EnterpriseApplicationQueryDto {
  @ApiPropertyOptional({ enum: ['pending', 'under_review', 'clarification_needed', 'approved', 'rejected'] })
  @IsOptional()
  @IsIn(['pending', 'under_review', 'clarification_needed', 'approved', 'rejected'])
  status?: string;

  @ApiPropertyOptional({ enum: ['enterprise', 'enterprise-ultra'] })
  @IsOptional()
  @IsIn(['enterprise', 'enterprise-ultra'])
  planType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  offset?: number;
}

export class SignContractDto {
  @ApiProperty()
  @IsString()
  applicationId: string;

  @ApiProperty()
  @IsBoolean()
  acceptedTerms: boolean;

  @ApiProperty()
  @IsString()
  signatureName: string;
}
