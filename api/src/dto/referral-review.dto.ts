import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JurisdictionCode } from '../entities/user.entity';

export class CreateReferralReviewDto {
  @ApiProperty({
    description: 'Template code of the generated document',
    example: 'SAFE_US-DE',
  })
  @IsString()
  templateCode: string;

  @ApiProperty({
    description: 'Jurisdiction for lawyer matching',
    enum: JurisdictionCode,
    example: 'US-DE',
  })
  @IsEnum(JurisdictionCode)
  jurisdiction: JurisdictionCode;

  @ApiProperty({
    description: 'S3 key of user document to review',
    example: 'users/user-123/docs/SAFE_US-DE/1234567890.pdf',
  })
  @IsString()
  s3UserDocKey: string;

  @ApiProperty({
    description: 'User ID (from Clerk)',
    example: 'user_2abcdef123456',
  })
  @IsString()
  userId: string;
}

export class CreateReferralCheckoutDto {
  @ApiProperty({
    description: 'Referral ID',
    example: 'uuid-referral-id',
  })
  @IsString()
  referralId: string;

  @ApiProperty({
    description: 'Success redirect URL',
    example: 'https://legmint.com/referrals/success',
  })
  @IsString()
  successUrl: string;

  @ApiProperty({
    description: 'Cancel redirect URL',
    example: 'https://legmint.com/referrals/cancel',
  })
  @IsString()
  cancelUrl: string;
}

export class AcceptReferralDto {
  @ApiProperty({
    description: 'Referral ID to accept',
    example: 'uuid-referral-id',
  })
  @IsString()
  referralId: string;

  @ApiProperty({
    description: 'Lawyer/Partner ID',
    example: 'uuid-partner-id',
  })
  @IsString()
  lawyerId: string;
}

export class CompleteReferralDto {
  @ApiProperty({
    description: 'Referral ID to complete',
    example: 'uuid-referral-id',
  })
  @IsString()
  referralId: string;

  @ApiProperty({
    description: 'S3 key of lawyer reviewed document',
    example: 'lawyers/lawyer-123/reviews/ref-456.pdf',
  })
  @IsString()
  s3LawyerReviewKey: string;

  @ApiProperty({
    description: 'Optional review notes for client',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateAddonCheckoutDto {
  @ApiProperty({
    description: 'Referral ID for additional work',
    example: 'uuid-referral-id',
  })
  @IsString()
  referralId: string;

  @ApiProperty({
    description: 'Additional amount in cents',
    example: 15000,
  })
  @IsInt()
  @Min(1000)
  amountCents: number;

  @ApiProperty({
    description: 'Description of additional work',
    example: 'Negotiation support and amendments',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Success redirect URL',
    example: 'https://legmint.com/referrals/addon/success',
  })
  @IsString()
  successUrl: string;

  @ApiProperty({
    description: 'Cancel redirect URL',
    example: 'https://legmint.com/referrals/addon/cancel',
  })
  @IsString()
  cancelUrl: string;
}

export class GetAvailableLawyersDto {
  @ApiProperty({
    description: 'Jurisdiction to filter lawyers',
    enum: JurisdictionCode,
    example: 'UK',
  })
  @IsEnum(JurisdictionCode)
  jurisdiction: JurisdictionCode;

  @ApiProperty({
    description: 'Template specialization filter',
    required: false,
    example: 'fundraising',
  })
  @IsOptional()
  @IsString()
  specialization?: string;
}
