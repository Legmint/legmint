import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DataSource } from 'typeorm';

/**
 * Payments Controller
 *
 * Handles all payment-related endpoints:
 * - Template one-time purchases
 * - Subscription checkouts
 * - Billing portal
 * - Referral payments (Stripe Connect)
 *
 * Routes: /v1/payments/* (v1 prefix added by NestJS versioning with defaultVersion: '1')
 */
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * POST /payments/checkout/template
   * Create a one-time checkout session for a template
   */
  @Post('checkout/template')
  async createTemplateCheckout(
    @Body()
    body: {
      templateCode: string;
      amountCents: number;
      currency?: string;
    },
    @Request() req: any,
  ) {
    const { templateCode, amountCents, currency = 'eur' } = body;

    // Get user from request (assuming Clerk middleware adds this)
    const userId = req.auth?.userId || req.user?.id;
    const userEmail = req.auth?.email || req.user?.email;

    if (!userId || !userEmail) {
      throw new BadRequestException('User not authenticated');
    }

    if (!templateCode || !amountCents) {
      throw new BadRequestException('templateCode and amountCents are required');
    }

    this.logger.log(`Template checkout requested by user ${userId}`);

    const session = await this.paymentsService.createTemplateCheckout({
      userId,
      userEmail,
      templateCode,
      amountCents,
      currency,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * POST /payments/checkout/subscription
   * Create a subscription checkout session
   */
  @Post('checkout/subscription')
  async createSubscriptionCheckout(
    @Body() body: { priceId: string },
    @Request() req: any,
  ) {
    const { priceId } = body;

    const userId = req.auth?.userId || req.user?.id;
    const userEmail = req.auth?.email || req.user?.email;

    if (!userId || !userEmail) {
      throw new BadRequestException('User not authenticated');
    }

    if (!priceId) {
      throw new BadRequestException('priceId is required');
    }

    this.logger.log(`Subscription checkout requested by user ${userId}`);

    const session = await this.paymentsService.createSubscriptionCheckout({
      userId,
      userEmail,
      priceId,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * POST /payments/portal
   * Create a billing portal session for subscription management
   */
  @Post('portal')
  async createBillingPortal(@Request() req: any) {
    const userId = req.auth?.userId || req.user?.id;

    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    // Get user's Stripe customer ID from database
    const user = await this.dataSource.query(
      'SELECT stripe_customer_id FROM users WHERE id = $1',
      [userId],
    );

    if (!user || !user[0]?.stripe_customer_id) {
      throw new NotFoundException(
        'No billing account found. Please subscribe first.',
      );
    }

    const customerId = user[0].stripe_customer_id;

    this.logger.log(`Billing portal requested by user ${userId}`);

    const session = await this.paymentsService.createBillingPortalSession({
      customerId,
    });

    return {
      url: session.url,
    };
  }

  /**
   * POST /payments/checkout/referral
   * Create a checkout for lawyer referral (€25 fixed fee)
   */
  @Post('checkout/referral')
  async createReferralCheckout(
    @Body()
    body: {
      lawyerId: string;
      amountCents: number;
      currency?: string;
      referralId: string;
    },
    @Request() req: any,
  ) {
    const { lawyerId, amountCents, currency = 'eur', referralId } = body;

    const userId = req.auth?.userId || req.user?.id;
    const userEmail = req.auth?.email || req.user?.email;

    if (!userId || !userEmail) {
      throw new BadRequestException('User not authenticated');
    }

    if (!lawyerId || !amountCents || !referralId) {
      throw new BadRequestException(
        'lawyerId, amountCents, and referralId are required',
      );
    }

    // Get lawyer's Stripe Connect account ID
    const lawyer = await this.dataSource.query(
      'SELECT stripe_account_id FROM partners WHERE id = $1',
      [lawyerId],
    );

    if (!lawyer || !lawyer[0]?.stripe_account_id) {
      throw new NotFoundException(
        'Lawyer not found or not connected to Stripe',
      );
    }

    this.logger.log(
      `Referral checkout requested by user ${userId} for lawyer ${lawyerId}`,
    );

    const session = await this.paymentsService.createReferralCheckout({
      userId,
      userEmail,
      lawyerId,
      lawyerStripeAccountId: lawyer[0].stripe_account_id,
      amountCents,
      currency,
      referralId,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * POST /payments/checkout/referral-addon
   * Create a checkout for referral add-on services (10% fee)
   */
  @Post('checkout/referral-addon')
  async createReferralAddonCheckout(
    @Body()
    body: {
      lawyerId: string;
      extraAmountCents: number;
      currency?: string;
      referralId: string;
    },
    @Request() req: any,
  ) {
    const { lawyerId, extraAmountCents, currency = 'eur', referralId } = body;

    const userId = req.auth?.userId || req.user?.id;
    const userEmail = req.auth?.email || req.user?.email;

    if (!userId || !userEmail) {
      throw new BadRequestException('User not authenticated');
    }

    if (!lawyerId || !extraAmountCents || !referralId) {
      throw new BadRequestException(
        'lawyerId, extraAmountCents, and referralId are required',
      );
    }

    // Get lawyer's Stripe Connect account ID
    const lawyer = await this.dataSource.query(
      'SELECT stripe_account_id FROM partners WHERE id = $1',
      [lawyerId],
    );

    if (!lawyer || !lawyer[0]?.stripe_account_id) {
      throw new NotFoundException(
        'Lawyer not found or not connected to Stripe',
      );
    }

    this.logger.log(
      `Referral add-on checkout requested by user ${userId} for lawyer ${lawyerId}`,
    );

    const session = await this.paymentsService.createReferralAddonCheckout({
      userId,
      userEmail,
      lawyerId,
      lawyerStripeAccountId: lawyer[0].stripe_account_id,
      extraAmountCents,
      currency,
      referralId,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  /**
   * POST /payments/session/:sessionId
   * Retrieve a checkout session
   */
  @Post('session/:sessionId')
  async retrieveSession(@Request() req: any) {
    const sessionId = req.params.sessionId;

    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }

    const session = await this.paymentsService.retrieveSession(sessionId);

    return {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    };
  }
}
