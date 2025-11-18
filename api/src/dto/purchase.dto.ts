import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from '../entities/user.entity';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'Subscription plan',
    enum: Plan,
    example: 'pro',
  })
  @IsEnum(Plan)
  plan: Plan;

  @ApiProperty({
    description: 'Billing cycle',
    enum: ['monthly', 'yearly'],
    example: 'monthly',
  })
  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @ApiProperty({
    description: 'Success redirect URL',
    required: false,
    example: 'https://legalmind.tech/dashboard?purchase=success',
  })
  @IsOptional()
  @IsUrl()
  successUrl?: string;

  @ApiProperty({
    description: 'Cancel redirect URL',
    required: false,
    example: 'https://legalmind.tech/packs',
  })
  @IsOptional()
  @IsUrl()
  cancelUrl?: string;
}
