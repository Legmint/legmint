import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JurisdictionCode } from '../entities/user.entity';

export class CreateReferralDto {
  @ApiProperty({
    description: 'Template code',
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
    description: 'Audit log ID to link referral',
    required: false,
    example: 'aud_abc123xyz',
  })
  @IsOptional()
  @IsString()
  auditId?: string;
}

export class TrackReferralClickDto {
  @ApiProperty({
    description: 'Partner ID that was clicked',
    example: 'uuid-partner-id',
  })
  @IsString()
  partnerId: string;
}
