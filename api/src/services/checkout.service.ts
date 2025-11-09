import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Referral, ReferralStatus } from '../entities/referral.entity';
import { Partner } from '../entities/partner.entity';
import { Order, OrderType } from '../entities/order.entity';
import { EmailService } from '../email/email.service';

/**
 * CheckoutService
 *
 * Implements Legmint's €25 fixed + 10% variable fee model for lawyer referrals:
 *
 * INITIAL REFERRAL:
 * - User pays lawyer's fixed price (e.g., €200)
 * - Platform collects €25 fixed fee via application_fee_amount
 * - Remaining amount (€175) transferred to lawyer's Stripe Connect account
 *
 * ADD-ON WORK:
 * - User pays additional amount for extra lawyer work
 * - Platform collects 10% via application_fee_amount
 * - Remaining 90% transferred to lawyer
 */
@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  private readonly stripe: Stripe;
  private readonly platformFeeFixedCents: number;
  private readonly platformFeePercent: number;

  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });

    this.platformFeeFixedCents = parseInt(
      this.configService.get('PLATFORM_FEE_FIXED_CENTS', '2500'),
    );
    this.platformFeePercent = parseInt(
      this.configService.get('PLATFORM_FEE_PERCENT', '10'),
    );
  }

  /**
   * Create Stripe Checkout Session for initial referral
   * Fee model: €25 fixed
   */
  async createReferralCheckout(
    referralId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const referral = await this.referralRepository.findOne({
        where: { id: referralId },
        relations: ['partner', 'user'],
      });

      if (!referral) {
        throw new NotFoundException('Referral not found');
      }

      if (referral.status !== ReferralStatus.REQUESTED) {
        throw new BadRequestException('Referral is not in requested state');
      }

      const lawyer = referral.partner;

      if (!lawyer.stripeAccountId) {
        throw new BadRequestException('Lawyer has not connected Stripe account');
      }

      if (lawyer.stripeStatus !== 'charges_enabled') {
        throw new BadRequestException('Lawyer Stripe account is not ready for payments');
      }

      // Use lawyer's fixed price or default €200
      const lawyerPriceCents = lawyer.priceFixedCents || 20000;
      const fixedFeeCents = this.platformFeeFixedCents; // €25

      if (lawyerPriceCents < fixedFeeCents) {
        throw new BadRequestException('Lawyer price is too low for platform fee');
      }

      // Create Checkout Session with Connect transfer
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Legal Document Review',
                description: `Professional review by ${lawyer.fullName || lawyer.name}`,
                metadata: {
                  referralId: referral.id,
                  lawyerId: lawyer.id,
                  templateCode: referral.templateCode,
                  jurisdiction: referral.jurisdiction,
                },
              },
              unit_amount: lawyerPriceCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: fixedFeeCents, // €25 platform fee
          transfer_data: {
            destination: lawyer.stripeAccountId, // Transfer to lawyer
          },
          metadata: {
            referralId: referral.id,
            lawyerId: lawyer.id,
            userId: referral.userId,
            feeType: 'fixed',
          },
        },
        metadata: {
          referralId: referral.id,
          lawyerId: lawyer.id,
          userId: referral.userId,
          type: 'referral_initial',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: referral.user?.email,
      });

      // Update referral with session ID
      referral.stripeCheckoutSessionId = session.id;
      referral.amountGrossCents = lawyerPriceCents;
      referral.amountPlatformFixedCents = fixedFeeCents;
      await this.referralRepository.save(referral);

      this.logger.log(
        `Created checkout session ${session.id} for referral ${referralId}: €${lawyerPriceCents / 100} (€${fixedFeeCents / 100} platform fee)`,
      );

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      this.logger.error(`Failed to create referral checkout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create Stripe Checkout Session for add-on work
   * Fee model: 10% of amount
   */
  async createAddonCheckout(
    referralId: string,
    amountCents: number,
    description: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const referral = await this.referralRepository.findOne({
        where: { id: referralId },
        relations: ['partner', 'user'],
      });

      if (!referral) {
        throw new NotFoundException('Referral not found');
      }

      // Can only add charges to completed or in-progress referrals
      if (![ReferralStatus.ASSIGNED, ReferralStatus.IN_REVIEW, ReferralStatus.COMPLETED].includes(referral.status)) {
        throw new BadRequestException('Referral must be assigned or completed for add-on billing');
      }

      const lawyer = referral.partner;

      if (!lawyer.stripeAccountId) {
        throw new BadRequestException('Lawyer has not connected Stripe account');
      }

      // Calculate 10% platform fee
      const percentFeeCents = Math.round(amountCents * (this.platformFeePercent / 100));

      // Create Checkout Session
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Additional Legal Work',
                description: description,
                metadata: {
                  referralId: referral.id,
                  lawyerId: lawyer.id,
                },
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: percentFeeCents, // 10% platform fee
          transfer_data: {
            destination: lawyer.stripeAccountId,
          },
          metadata: {
            referralId: referral.id,
            lawyerId: lawyer.id,
            userId: referral.userId,
            feeType: 'percent',
            feePercent: this.platformFeePercent,
          },
        },
        metadata: {
          referralId: referral.id,
          lawyerId: lawyer.id,
          userId: referral.userId,
          type: 'referral_addon',
          description: description,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: referral.user?.email,
      });

      this.logger.log(
        `Created addon checkout session ${session.id} for referral ${referralId}: €${amountCents / 100} (${this.platformFeePercent}% = €${percentFeeCents / 100} platform fee)`,
      );

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      this.logger.error(`Failed to create addon checkout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle successful checkout session (called from webhook)
   */
  async handleCheckoutSuccess(session: Stripe.Checkout.Session): Promise<void> {
    try {
      const referralId = session.metadata?.referralId;
      const type = session.metadata?.type;

      if (!referralId) {
        this.logger.warn('Checkout session missing referralId in metadata');
        return;
      }

      const referral = await this.referralRepository.findOne({
        where: { id: referralId },
        relations: ['partner'],
      });

      if (!referral) {
        this.logger.error(`Referral ${referralId} not found for checkout session ${session.id}`);
        return;
      }

      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        session.payment_intent as string,
      );

      if (type === 'referral_initial') {
        // Update referral status to PAID
        referral.status = ReferralStatus.PAID;
        referral.stripePaymentIntentId = paymentIntent.id;
        await this.referralRepository.save(referral);

        // Create order record
        await this.createOrderRecord({
          userId: referral.userId,
          lawyerId: referral.partnerId,
          referralId: referral.id,
          type: OrderType.REFERRAL,
          amountGrossCents: referral.amountGrossCents,
          platformFeeFixedCents: referral.amountPlatformFixedCents,
          platformFeePercentCents: 0,
          amountPlatformCents: referral.amountPlatformFixedCents,
          amountLawyerCents: referral.amountGrossCents - referral.amountPlatformFixedCents,
          stripePaymentIntentId: paymentIntent.id,
        });

        // Send email notification when lawyer is assigned
        await this.notifyReferralPaid(referral);

        this.logger.log(`Referral ${referralId} marked as PAID`);
      } else if (type === 'referral_addon') {
        // Create add-on order record
        const amountCents = session.amount_total || 0;
        const percentFee = Math.round(amountCents * (this.platformFeePercent / 100));

        await this.createOrderRecord({
          userId: referral.userId,
          lawyerId: referral.partnerId,
          referralId: referral.id,
          type: OrderType.ADD_ON,
          amountGrossCents: amountCents,
          platformFeeFixedCents: 0,
          platformFeePercentCents: percentFee,
          amountPlatformCents: percentFee,
          amountLawyerCents: amountCents - percentFee,
          stripePaymentIntentId: paymentIntent.id,
          metadata: {
            description: session.metadata?.description,
          },
        });

        this.logger.log(`Add-on payment recorded for referral ${referralId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to handle checkout success: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create order record for tracking
   */
  private async createOrderRecord(data: {
    userId: string;
    lawyerId: string;
    referralId: string;
    type: OrderType;
    amountGrossCents: number;
    platformFeeFixedCents: number;
    platformFeePercentCents: number;
    amountPlatformCents: number;
    amountLawyerCents: number;
    stripePaymentIntentId: string;
    metadata?: Record<string, any>;
  }): Promise<Order> {
    const order = this.orderRepository.create({
      userId: data.userId,
      lawyerId: data.lawyerId,
      referralId: data.referralId,
      type: data.type,
      amountGrossCents: data.amountGrossCents,
      platformFeeFixedCents: data.platformFeeFixedCents,
      platformFeePercentCents: data.platformFeePercentCents,
      amountPlatformCents: data.amountPlatformCents,
      amountLawyerCents: data.amountLawyerCents,
      stripePaymentIntentId: data.stripePaymentIntentId,
      metadata: data.metadata,
    });

    return await this.orderRepository.save(order);
  }

  /**
   * Send email notifications when referral is paid and lawyer is assigned
   */
  private async notifyReferralPaid(referral: Referral): Promise<void> {
    try {
      // Load relations if not already loaded
      if (!referral.user || !referral.partner) {
        const fullReferral = await this.referralRepository.findOne({
          where: { id: referral.id },
          relations: ['user', 'partner'],
        });
        if (fullReferral) {
          referral = fullReferral;
        }
      }

      const frontendUrl = this.configService.get('FRONTEND_URL', 'https://legmint.com');
      const caseUrl = `${frontendUrl}/dashboard/referrals/${referral.id}`;

      // Send email to user
      if (referral.user?.email) {
        const userTemplate = this.emailService.referralAssignedTemplate({
          firstName: referral.user.name,
          lawyerName: referral.partner?.fullName || referral.partner?.name || 'your lawyer',
          caseUrl,
        });

        await this.emailService.sendEmail({
          to: referral.user.email,
          subject: userTemplate.subject,
          html: userTemplate.html,
        });

        this.logger.log(`Referral assignment email sent to user ${referral.user.email}`);
      }

      // TODO: Send email to lawyer when lawyer email notification template is added
      // if (referral.partner?.email) {
      //   await this.emailService.sendEmail({...});
      // }
    } catch (error) {
      this.logger.error(`Failed to send referral notification emails: ${error.message}`);
      // Don't throw - email failure shouldn't break payment processing
    }
  }
}
