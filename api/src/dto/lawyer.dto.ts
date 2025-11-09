import {
  IsString,
  IsEmail,
  IsArray,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JurisdictionCode } from '../entities/user.entity';

export class CreateLawyerApplicationDto {
  @ApiProperty({
    description: 'Full legal name',
    example: 'Jane Smith',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Professional email address',
    example: 'jane.smith@lawfirm.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Primary jurisdiction of practice',
    enum: JurisdictionCode,
    example: 'UK',
  })
  @IsEnum(JurisdictionCode)
  jurisdiction: JurisdictionCode;

  @ApiProperty({
    description: 'Bar license number',
    example: 'SRA123456',
  })
  @IsString()
  licenseNumber: string;

  @ApiProperty({
    description: 'Areas of legal specialization',
    example: ['Corporate Law', 'Contract Law', 'Fundraising'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @ApiProperty({
    description: 'Languages spoken',
    example: ['English', 'French'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({
    description: 'Professional bio (max 500 characters)',
    example: 'Experienced corporate lawyer with 10+ years in startup law...',
  })
  @IsString()
  @MaxLength(500)
  bio: string;

  @ApiProperty({
    description: 'Professional website',
    example: 'https://janesmith.law',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Professional phone number',
    example: '+44 20 1234 5678',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Terms for Lawyers acceptance',
    example: true,
  })
  @IsBoolean()
  termsAccepted: boolean;
}

export class UploadDocumentDto {
  @ApiProperty({
    description: 'Type of document being uploaded',
    enum: ['license', 'insurance', 'identification'],
  })
  @IsEnum(['license', 'insurance', 'identification'])
  documentType: string;

  @ApiProperty({
    description: 'Application ID',
    example: 'uuid-application-id',
  })
  @IsString()
  applicationId: string;
}

export class ConnectStripeDto {
  @ApiProperty({
    description: 'Partner ID to connect Stripe account',
    example: 'uuid-partner-id',
  })
  @IsString()
  partnerId: string;

  @ApiProperty({
    description: 'Return URL after Stripe onboarding',
    example: 'https://legmint.com/lawyers/connect/success',
  })
  @IsUrl()
  returnUrl: string;

  @ApiProperty({
    description: 'Refresh URL if onboarding needs to be restarted',
    example: 'https://legmint.com/lawyers/connect/refresh',
  })
  @IsUrl()
  refreshUrl: string;
}

export class VerifyLawyerDto {
  @ApiProperty({
    description: 'Application ID to verify',
    example: 'uuid-application-id',
  })
  @IsString()
  applicationId: string;

  @ApiProperty({
    description: 'Approval decision',
    enum: ['approved', 'rejected'],
  })
  @IsEnum(['approved', 'rejected'])
  decision: string;

  @ApiProperty({
    description: 'Admin notes or rejection reason',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLawyerProfileDto {
  @ApiProperty({
    description: 'Professional bio',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'Professional website',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Professional phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Languages spoken',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiProperty({
    description: 'Areas of legal specialization',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];
}

export class LawyerDashboardQueryDto {
  @ApiProperty({
    description: 'Filter by referral status',
    required: false,
    enum: ['created', 'clicked', 'booked', 'expired'],
  })
  @IsOptional()
  @IsEnum(['created', 'clicked', 'booked', 'expired'])
  status?: string;

  @ApiProperty({
    description: 'Limit number of results',
    required: false,
    example: 20,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Offset for pagination',
    required: false,
    example: 0,
  })
  @IsOptional()
  offset?: number;
}
