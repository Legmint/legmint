import {
  Controller,
  Post,
  Headers,
  RawBodyRequest,
  Req,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { DataSource } from 'typeorm';
import Stripe from 'stripe';
import { Request } from 'express';

/**
 * Stripe Webhook Controller
 *
 * Handles all Stripe webhook events:
 * - checkout.session.completed
 * - invoice.paid
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - account.updated (Stripe Connect)
 */
@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Post('stripe')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    const webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      this.logger.error('STRIPE_WEBHOOK_SECRET not configured');
      throw new BadRequestException('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      const stripe = this.paymentsService.getStripeInstance();
      // Use rawBody from the request
      const rawBody = request.rawBody || request.body;
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;

        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription,
          );
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;

        case 'account.updated':
          await this.handleAccountUpdated(event.data.object as Stripe.Account);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle checkout.session.completed
   * Creates orders and entitlements
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const type = metadata.type;

    this.logger.log(
      `Checkout completed: ${session.id}, type: ${type}, user: ${userId}`,
    );

    // Update user's Stripe customer ID if not set
    if (session.customer && userId) {
      await this.dataSource.query(
        `UPDATE users SET stripe_customer_id = $1 WHERE id = $2 AND stripe_customer_id IS NULL`,
        [session.customer, userId],
      );
    }

    switch (type) {
      case 'template':
        await this.handleTemplateCheckout(session);
        break;

      case 'subscription':
        await this.handleSubscriptionCheckout(session);
        break;

      case 'referral':
      case 'addon':
        await this.handleReferralCheckout(session);
        break;

      default:
        this.logger.warn(`Unknown checkout type: ${type}`);
    }
  }

  /**
   * Handle template one-time purchase
   */
  private async handleTemplateCheckout(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const templateCode = metadata.templateCode;

    if (!userId || !templateCode) {
      this.logger.error('Missing userId or templateCode in session metadata');
      return;
    }

    const amountTotal = session.amount_total || 0;
    const currency = session.currency || 'eur';

    // Create order record
    const orderResult = await this.dataSource.query(
      `INSERT INTO orders (user_id, type, amount_gross_cents, currency, template_code, stripe_payment_intent_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        userId,
        'template',
        amountTotal,
        currency,
        templateCode,
        session.payment_intent,
        JSON.stringify(metadata),
      ],
    );

    const orderId = orderResult[0].id;

    // Create document entitlement (30 minutes expiry)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.dataSource.query(
      `INSERT INTO document_entitlements (user_id, template_code, order_id, single_use, expires_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, templateCode, orderId, true, expiresAt],
    );

    this.logger.log(
      `Created template entitlement for user ${userId}, template ${templateCode}`,
    );
  }

  /**
   * Handle subscription checkout
   */
  private async handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;

    if (!subscriptionId || !userId) {
      this.logger.error('Missing subscription ID or userId');
      return;
    }

    // Retrieve full subscription details
    const subscription =
      await this.paymentsService.retrieveSubscription(subscriptionId);

    await this.upsertSubscription(subscription, userId);

    this.logger.log(`Subscription created for user ${userId}`);
  }

  /**
   * Handle referral checkout (fixed €25 or 10% addon)
   */
  private async handleReferralCheckout(session: Stripe.Checkout.Session) {
    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const lawyerId = metadata.lawyerId;
    const referralId = metadata.referralId;
    const type = metadata.type; // 'referral' or 'addon'

    if (!userId || !lawyerId || !referralId) {
      this.logger.error('Missing required metadata for referral checkout');
      return;
    }

    const amountTotal = session.amount_total || 0;
    const currency = session.currency || 'eur';
    const paymentIntentId = session.payment_intent as string;

    // Get platform fee from payment intent
    const stripe = this.paymentsService.getStripeInstance();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const platformFeeCents = paymentIntent.application_fee_amount || 0;
    const lawyerAmountCents = amountTotal - platformFeeCents;

    // Determine fee breakdown
    let platformFeeFixedCents = 0;
    let platformFeePercentCents = 0;

    if (type === 'referral') {
      platformFeeFixedCents = platformFeeCents;
    } else if (type === 'addon') {
      platformFeePercentCents = platformFeeCents;
    }

    // Create order record
    await this.dataSource.query(
      `INSERT INTO orders (user_id, lawyer_id, referral_id, type, amount_gross_cents, currency,
        platform_fee_fixed_cents, platform_fee_percent_cents, amount_platform_cents, amount_lawyer_cents,
        stripe_payment_intent_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        userId,
        lawyerId,
        referralId,
        type === 'addon' ? 'add_on' : 'referral',
        amountTotal,
        currency,
        platformFeeFixedCents,
        platformFeePercentCents,
        platformFeeCents,
        lawyerAmountCents,
        paymentIntentId,
        JSON.stringify(metadata),
      ],
    );

    // Update referral status to 'paid'
    await this.dataSource.query(
      `UPDATE referrals SET status = 'paid', stripe_payment_intent_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [paymentIntentId, referralId],
    );

    this.logger.log(
      `Created ${type} order for user ${userId}, lawyer ${lawyerId}`,
    );
  }

  /**
   * Handle invoice.paid
   */
  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

    if (!subscriptionId) {
      return;
    }

    // Get userId from customer
    const user = await this.dataSource.query(
      'SELECT id FROM users WHERE stripe_customer_id = $1',
      [customerId],
    );

    if (!user || user.length === 0) {
      this.logger.warn(`User not found for customer ${customerId}`);
      return;
    }

    const userId = user[0].id;

    // Retrieve subscription and update
    const subscription =
      await this.paymentsService.retrieveSubscription(subscriptionId);
    await this.upsertSubscription(subscription, userId);

    // Create order record for the invoice
    const paymentIntentId = typeof invoice.payment_intent === 'string' ? invoice.payment_intent : invoice.payment_intent?.id;
    await this.dataSource.query(
      `INSERT INTO orders (user_id, type, amount_gross_cents, currency, stripe_invoice_id, stripe_payment_intent_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (stripe_invoice_id) DO NOTHING`,
      [
        userId,
        'subscription',
        invoice.amount_paid,
        invoice.currency,
        invoice.id,
        paymentIntentId,
        JSON.stringify({ subscriptionId }),
      ],
    );

    this.logger.log(`Invoice paid for user ${userId}`);
  }

  /**
   * Handle customer.subscription.updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    // Get userId from customer
    const user = await this.dataSource.query(
      'SELECT id FROM users WHERE stripe_customer_id = $1',
      [customerId],
    );

    if (!user || user.length === 0) {
      this.logger.warn(`User not found for customer ${customerId}`);
      return;
    }

    const userId = user[0].id;
    await this.upsertSubscription(subscription, userId);

    this.logger.log(`Subscription updated for user ${userId}`);
  }

  /**
   * Handle customer.subscription.deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.dataSource.query(
      `UPDATE subscriptions SET status = 'canceled', canceled_at = CURRENT_TIMESTAMP
       WHERE stripe_subscription_id = $1`,
      [subscription.id],
    );

    this.logger.log(`Subscription deleted: ${subscription.id}`);
  }

  /**
   * Handle account.updated (Stripe Connect)
   */
  private async handleAccountUpdated(account: Stripe.Account) {
    const accountId = account.id;

    // Update lawyer's stripe_status
    const status = account.charges_enabled ? 'active' : 'pending';

    await this.dataSource.query(
      `UPDATE partners SET stripe_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE stripe_account_id = $2`,
      [status, accountId],
    );

    this.logger.log(`Stripe Connect account updated: ${accountId}`);
  }

  /**
   * Upsert subscription to database
   */
  private async upsertSubscription(
    subscription: Stripe.Subscription,
    userId: string,
  ) {
    const priceId = subscription.items.data[0]?.price.id;
    const planKey = this.getPlanKeyFromPriceId(priceId);
    const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

    await this.dataSource.query(
      `INSERT INTO subscriptions (
        user_id, stripe_subscription_id, stripe_customer_id, price_id, plan_key, status,
        current_period_start, current_period_end, cancel_at_period_end, canceled_at, trial_end, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (stripe_subscription_id)
      DO UPDATE SET
        status = EXCLUDED.status,
        current_period_start = EXCLUDED.current_period_start,
        current_period_end = EXCLUDED.current_period_end,
        cancel_at_period_end = EXCLUDED.cancel_at_period_end,
        canceled_at = EXCLUDED.canceled_at,
        trial_end = EXCLUDED.trial_end,
        updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        subscription.id,
        customerId,
        priceId,
        planKey,
        subscription.status,
        new Date((subscription.current_period_start as number) * 1000),
        new Date((subscription.current_period_end as number) * 1000),
        subscription.cancel_at_period_end,
        subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
        subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        JSON.stringify(subscription.metadata),
      ],
    );
  }

  /**
   * Map Stripe price ID to plan key
   */
  private getPlanKeyFromPriceId(priceId: string): string {
    // In production, you'd read this from the stripe.prices.json file
    // or maintain a mapping in the database
    // For now, we'll use a simple default
    return 'pro'; // Default to 'pro', update based on your actual price IDs
  }
}
