import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from '../services/stripe.service';
import { CreateCheckoutSessionDto } from '../dto';

@ApiTags('Purchase')
@Controller('purchase')
@Version('1')
export class PurchaseController {
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Stripe Checkout session' })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created',
  })
  async createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
    // TODO: Get userId from JWT token once auth is implemented
    const userId = 'temp-user-id'; // Placeholder

    const defaultSuccessUrl =
      dto.successUrl || 'http://localhost:3001/dashboard?purchase=success';
    const defaultCancelUrl = dto.cancelUrl || 'http://localhost:3001/packs';

    const result = await this.stripeService.createCheckoutSession(
      userId,
      dto.plan,
      dto.billingCycle,
      defaultSuccessUrl,
      defaultCancelUrl,
    );

    return {
      checkout_url: result.checkoutUrl,
      session_id: result.sessionId,
    };
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get current subscription status' })
  @ApiResponse({
    status: 200,
    description: 'Subscription details',
  })
  async getSubscription() {
    // TODO: Get userId from JWT and fetch subscription from database
    // For now, return mock data
    return {
      plan: 'pro',
      status: 'active',
      jurisdictions_allowed: ['GLOBAL-EN', 'UK', 'US-DE'],
      subscription_start: '2025-01-01T00:00:00Z',
      subscription_end: null,
      stripe_subscription_id: 'sub_xxxxx',
    };
  }

  @Delete('subscription')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled',
  })
  async cancelSubscription() {
    // TODO: Get subscription ID from user's active subscription
    const subscriptionId = 'sub_xxxxx'; // Placeholder

    await this.stripeService.cancelSubscription(subscriptionId);

    return {
      status: 'cancelled',
      cancel_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }
}
