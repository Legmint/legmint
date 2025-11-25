import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
    });
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(
    userId: string,
    email: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer> {
    // In a real implementation, you'd check the database first
    // For now, we'll search Stripe or create a new customer
    const existingCustomers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return this.stripe.customers.create({
      email,
      metadata: {
        userId,
        ...metadata,
      },
    });
  }

  /**
   * Create a one-time payment checkout session for templates
   */
  async createTemplateCheckout(params: {
    userId: string;
    userEmail: string;
    templateCode: string;
    amountCents: number;
    currency?: string;
  }): Promise<Stripe.Checkout.Session> {
    const { userId, userEmail, templateCode, amountCents, currency = 'eur' } =
      params;

    const customer = await this.getOrCreateCustomer(userId, userEmail);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    this.logger.log(
      `Creating template checkout for user ${userId}, template ${templateCode}`,
    );

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product_data: {
              name: `Legal Template: ${templateCode}`,
              description: 'One-time access to generate this legal document',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        templateCode,
        type: 'template',
      },
      success_url: `${frontendUrl}/dashboard/documents?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/templates/${templateCode}`,
    });

    return session;
  }

  /**
   * Create a subscription checkout session
   */
  async createSubscriptionCheckout(params: {
    userId: string;
    userEmail: string;
    priceId: string;
  }): Promise<Stripe.Checkout.Session> {
    const { userId, userEmail, priceId } = params;

    const customer = await this.getOrCreateCustomer(userId, userEmail);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    // Verify the price exists
    const price = await this.stripe.prices.retrieve(priceId);
    if (!price.active) {
      throw new BadRequestException('Price is not active');
    }

    this.logger.log(`Creating subscription checkout for user ${userId}`);

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        type: 'subscription',
      },
      success_url: `${frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pricing`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return session;
  }

  /**
   * Create a billing portal session for subscription management
   */
  async createBillingPortalSession(params: {
    customerId: string;
  }): Promise<Stripe.BillingPortal.Session> {
    const { customerId } = params;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    this.logger.log(
      `Creating billing portal session for customer ${customerId}`,
    );

    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${frontendUrl}/dashboard/billing`,
    });

    return session;
  }

  /**
   * Create a referral checkout with Stripe Connect
   * €25 fixed fee goes to platform
   */
  async createReferralCheckout(params: {
    userId: string;
    userEmail: string;
    lawyerId: string;
    lawyerStripeAccountId: string;
    amountCents: number;
    currency?: string;
    referralId: string;
  }): Promise<Stripe.Checkout.Session> {
    const {
      userId,
      userEmail,
      lawyerId,
      lawyerStripeAccountId,
      amountCents,
      currency = 'eur',
      referralId,
    } = params;

    const customer = await this.getOrCreateCustomer(userId, userEmail);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const platformFeeFixedCents = Number(
      this.configService.get<string>('PLATFORM_FEE_FIXED_CENTS', '2500'),
    );

    this.logger.log(
      `Creating referral checkout for user ${userId}, lawyer ${lawyerId}`,
    );

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product_data: {
              name: 'Lawyer Referral - Document Review',
              description: 'Professional legal document review service',
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeFixedCents,
        transfer_data: {
          destination: lawyerStripeAccountId,
        },
        metadata: {
          userId,
          lawyerId,
          referralId,
          type: 'referral',
        },
      },
      metadata: {
        userId,
        lawyerId,
        referralId,
        type: 'referral',
      },
      success_url: `${frontendUrl}/dashboard/referrals?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/lawyers/${lawyerId}`,
    });

    return session;
  }

  /**
   * Create a referral add-on checkout with 10% platform fee
   */
  async createReferralAddonCheckout(params: {
    userId: string;
    userEmail: string;
    lawyerId: string;
    lawyerStripeAccountId: string;
    extraAmountCents: number;
    currency?: string;
    referralId: string;
  }): Promise<Stripe.Checkout.Session> {
    const {
      userId,
      userEmail,
      lawyerId,
      lawyerStripeAccountId,
      extraAmountCents,
      currency = 'eur',
      referralId,
    } = params;

    const customer = await this.getOrCreateCustomer(userId, userEmail);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const platformFeePercent = Number(
      this.configService.get<string>('PLATFORM_FEE_PERCENT', '10'),
    );

    // Calculate 10% platform fee
    const platformFeeCents = Math.round(
      extraAmountCents * (platformFeePercent / 100),
    );

    this.logger.log(
      `Creating referral add-on checkout for user ${userId}, lawyer ${lawyerId}`,
    );

    const session = await this.stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: extraAmountCents,
            product_data: {
              name: 'Lawyer Referral - Additional Services',
              description: 'Additional legal services',
            },
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: lawyerStripeAccountId,
        },
        metadata: {
          userId,
          lawyerId,
          referralId,
          type: 'addon',
        },
      },
      metadata: {
        userId,
        lawyerId,
        referralId,
        type: 'addon',
      },
      success_url: `${frontendUrl}/dashboard/referrals?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/lawyers/${lawyerId}`,
    });

    return session;
  }

  /**
   * Retrieve a checkout session by ID
   */
  async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  /**
   * Retrieve a subscription by ID
   */
  async retrieveSubscription(
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  /**
   * Get the Stripe instance (for webhook verification)
   */
  getStripeInstance(): Stripe {
    return this.stripe;
  }
}
