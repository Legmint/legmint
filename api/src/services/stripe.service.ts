import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Plan } from '../entities/user.entity';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a Stripe Checkout Session
   */
  async createCheckoutSession(
    userId: string,
    plan: Plan,
    billingCycle: 'monthly' | 'yearly',
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, any>,
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    try {
      // Get price ID based on plan and billing cycle
      const priceId = this.getPriceId(plan, billingCycle);

      const session = await this.stripe.checkout.sessions.create({
        customer_email: undefined, // Can be filled from user data
        client_reference_id: userId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          plan,
          billingCycle,
          ...metadata,
        },
      });

      this.logger.log(
        `Created checkout session ${session.id} for user ${userId}, plan ${plan}, billing ${billingCycle}`,
      );

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      this.logger.error(`Failed to create checkout session: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      this.logger.log(`Cancelled subscription ${subscriptionId}`);

      return subscription;
    } catch (error) {
      this.logger.error(`Failed to cancel subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      this.logger.error(`Failed to get subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
  ): Stripe.Event {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error(`Webhook signature verification failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create Stripe Connect checkout session with payment split for lawyer referrals
   * @param userId - User requesting legal services
   * @param lawyerStripeAccountId - Lawyer's Stripe Connect account ID
   * @param serviceName - Description of the service
   * @param amount - Total amount in cents (e.g., 20000 = €200)
   * @param platformFeePercentage - Platform fee percentage (default 15%)
   * @param successUrl - URL to redirect after successful payment
   * @param cancelUrl - URL to redirect if payment cancelled
   */
  async createLawyerReferralCheckout(
    userId: string,
    lawyerStripeAccountId: string,
    serviceName: string,
    amount: number,
    platformFeePercentage: number = 15,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, any>,
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    try {
      // Calculate platform fee (e.g., 15% of total)
      const platformFeeAmount = Math.round((amount * platformFeePercentage) / 100);

      // Create checkout session with Connect payment split
      const session = await this.stripe.checkout.sessions.create({
        client_reference_id: userId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: serviceName,
                description: `Legal service provided by independent attorney`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: platformFeeAmount,
          transfer_data: {
            destination: lawyerStripeAccountId,
          },
          metadata: {
            userId,
            platformFeeAmount,
            platformFeePercentage,
            ...metadata,
          },
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          lawyerStripeAccountId,
          platformFeeAmount,
          platformFeePercentage,
          ...metadata,
        },
      });

      this.logger.log(
        `Created Connect checkout session ${session.id} - Amount: ${amount}, Platform fee: ${platformFeeAmount} (${platformFeePercentage}%), Lawyer account: ${lawyerStripeAccountId}`,
      );

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      this.logger.error(`Failed to create lawyer referral checkout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a PaymentIntent with Stripe Connect split (for custom payment flows)
   */
  async createLawyerPaymentIntent(
    amount: number,
    lawyerStripeAccountId: string,
    platformFeePercentage: number = 15,
    metadata?: Record<string, any>,
  ): Promise<Stripe.PaymentIntent> {
    try {
      const platformFeeAmount = Math.round((amount * platformFeePercentage) / 100);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        application_fee_amount: platformFeeAmount,
        transfer_data: {
          destination: lawyerStripeAccountId,
        },
        metadata,
      });

      this.logger.log(
        `Created PaymentIntent ${paymentIntent.id} with split to ${lawyerStripeAccountId}`,
      );

      return paymentIntent;
    } catch (error) {
      this.logger.error(`Failed to create payment intent: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Connect account details
   */
  async getConnectAccount(accountId: string): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.retrieve(accountId);
    } catch (error) {
      this.logger.error(`Failed to retrieve Connect account: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get balance for a Connect account
   */
  async getConnectAccountBalance(accountId: string): Promise<Stripe.Balance> {
    try {
      return await this.stripe.balance.retrieve({
        stripeAccount: accountId,
      });
    } catch (error) {
      this.logger.error(`Failed to retrieve Connect account balance: ${error.message}`);
      throw error;
    }
  }

  /**
   * List payouts for a Connect account
   */
  async getConnectAccountPayouts(
    accountId: string,
    limit: number = 10,
  ): Promise<Stripe.Payout[]> {
    try {
      const payouts = await this.stripe.payouts.list(
        { limit },
        { stripeAccount: accountId },
      );
      return payouts.data;
    } catch (error) {
      this.logger.error(`Failed to retrieve Connect account payouts: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export payout transactions for reconciliation
   * Gets all transfers and payouts for a date range
   */
  async exportPayoutTransactions(
    startDate: Date,
    endDate: Date,
  ): Promise<Array<{
    id: string;
    type: 'transfer' | 'payout';
    amount: number;
    currency: string;
    destination: string;
    created: Date;
    status: string;
    metadata?: Record<string, any>;
  }>> {
    try {
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      // Get balance transactions (includes transfers and fees)
      const balanceTransactions = await this.stripe.balanceTransactions.list({
        created: {
          gte: startTimestamp,
          lte: endTimestamp,
        },
        type: 'transfer',
        limit: 100,
      });

      const transactions = balanceTransactions.data.map((txn) => ({
        id: txn.id,
        type: 'transfer' as const,
        amount: txn.amount,
        currency: txn.currency,
        destination: txn.source as string,
        created: new Date(txn.created * 1000),
        status: txn.status,
        metadata: (txn as any).metadata,
      }));

      this.logger.log(
        `Exported ${transactions.length} payout transactions from ${startDate} to ${endDate}`,
      );

      return transactions;
    } catch (error) {
      this.logger.error(`Failed to export payout transactions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get price ID based on plan and billing cycle
   */
  private getPriceId(plan: Plan, billingCycle: 'monthly' | 'yearly' = 'monthly'): string {
    // Free plan has no Stripe price
    if (plan === Plan.FREE) {
      throw new Error('Free plan does not require a Stripe price ID');
    }

    // Pro plan: choose price based on billing cycle
    if (plan === Plan.PRO) {
      const envKey = billingCycle === 'monthly'
        ? 'STRIPE_PRICE_PRO_MONTHLY'
        : 'STRIPE_PRICE_PRO_YEARLY';

      const priceId = this.configService.get(envKey);

      if (!priceId) {
        throw new Error(`No Stripe price ID configured for ${envKey}`);
      }

      return priceId;
    }

    throw new Error(`Unsupported plan: ${plan}`);
  }
}
