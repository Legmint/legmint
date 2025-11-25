import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Partner } from '../entities/partner.entity';
import { LawyerApplication } from '../entities/lawyer-application.entity';
import { Referral } from '../entities/referral.entity';
import {
  CreateLawyerApplicationDto,
  UpdateLawyerProfileDto,
  VerifyLawyerDto,
} from '../dto/lawyer.dto';

@Injectable()
export class LawyerService {
  private readonly logger = new Logger(LawyerService.name);
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(LawyerApplication)
    private applicationRepository: Repository<LawyerApplication>,
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    private configService: ConfigService,
  ) {
    const secretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a new lawyer application
   */
  async createApplication(dto: CreateLawyerApplicationDto) {
    try {
      // Check if email already exists
      const existingPartner = await this.partnerRepository.findOne({
        where: { email: dto.email },
      });

      if (existingPartner) {
        throw new BadRequestException('A partner with this email already exists');
      }

      // Create partner record
      const partner = this.partnerRepository.create({
        fullName: dto.fullName,
        name: dto.fullName, // Use fullName for display name
        email: dto.email,
        jurisdiction: dto.jurisdiction,
        specializations: dto.specializations,
        languages: dto.languages,
        bio: dto.bio,
        website: dto.website,
        phone: dto.phone,
        status: 'pending',
        isActive: false,
        licenseNumber: dto.licenseNumber,
      });

      const savedPartner = await this.partnerRepository.save(partner);

      // Create application record
      const application = this.applicationRepository.create({
        partnerId: savedPartner.id,
        licenseNumber: dto.licenseNumber,
        termsAccepted: dto.termsAccepted,
        termsAcceptedAt: dto.termsAccepted ? new Date() : null,
        status: 'pending',
      });

      const savedApplication = await this.applicationRepository.save(application);

      this.logger.log(`Created lawyer application ${savedApplication.id} for ${dto.email}`);

      return {
        partnerId: savedPartner.id,
        applicationId: savedApplication.id,
        email: savedPartner.email,
        status: 'pending',
      };
    } catch (error) {
      this.logger.error(`Failed to create lawyer application: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update document URLs for an application
   */
  async updateApplicationDocuments(
    applicationId: string,
    documentType: 'license' | 'insurance' | 'identification',
    fileUrl: string,
  ) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    switch (documentType) {
      case 'license':
        application.proofOfLicenseUrl = fileUrl;
        break;
      case 'insurance':
        application.insuranceProofUrl = fileUrl;
        break;
      case 'identification':
        application.identificationUrl = fileUrl;
        break;
    }

    await this.applicationRepository.save(application);

    this.logger.log(`Updated ${documentType} document for application ${applicationId}`);

    return application;
  }

  /**
   * Get application by ID
   */
  async getApplication(applicationId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['partner'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  /**
   * Get all pending applications (for admin review)
   */
  async getPendingApplications() {
    return await this.applicationRepository.find({
      where: { status: 'pending' },
      relations: ['partner'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Verify a lawyer application (approve/reject)
   */
  async verifyApplication(dto: VerifyLawyerDto, adminUserId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id: dto.applicationId },
      relations: ['partner'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'pending') {
      throw new BadRequestException('Application has already been processed');
    }

    if (dto.decision === 'approved') {
      application.status = 'approved';
      application.verifiedBy = adminUserId;
      application.verifiedAt = new Date();

      // Update partner status
      application.partner.status = 'verified';

      await this.partnerRepository.save(application.partner);

      this.logger.log(`Approved lawyer application ${dto.applicationId}`);

      // TODO: Send approval email to lawyer
    } else {
      application.status = 'rejected';
      application.rejectionReason = dto.notes;

      // Update partner status
      application.partner.status = 'rejected';

      await this.partnerRepository.save(application.partner);

      this.logger.log(`Rejected lawyer application ${dto.applicationId}`);

      // TODO: Send rejection email to lawyer
    }

    await this.applicationRepository.save(application);

    return application;
  }

  /**
   * Create Stripe Connect account link for lawyer
   */
  async createStripeConnectLink(partnerId: string, returnUrl: string, refreshUrl: string) {
    try {
      const partner = await this.partnerRepository.findOne({
        where: { id: partnerId },
      });

      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      let accountId = partner.stripeAccountId;

      // Create Stripe account if not exists
      if (!accountId) {
        const account = await this.stripe.accounts.create({
          type: 'standard',
          email: partner.email,
          country: this.getCountryCode(partner.jurisdiction),
          business_type: 'individual',
          metadata: {
            partnerId: partner.id,
            jurisdiction: partner.jurisdiction,
          },
        });

        accountId = account.id;
        partner.stripeAccountId = accountId;
        await this.partnerRepository.save(partner);

        this.logger.log(`Created Stripe account ${accountId} for partner ${partnerId}`);
      }

      // Create account link for onboarding
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return {
        url: accountLink.url,
        stripeAccountId: accountId,
      };
    } catch (error) {
      this.logger.error(`Failed to create Stripe Connect link: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify Stripe Connect account is fully onboarded
   */
  async verifyStripeAccount(partnerId: string) {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    if (!partner || !partner.stripeAccountId) {
      throw new NotFoundException('Partner or Stripe account not found');
    }

    const account = await this.stripe.accounts.retrieve(partner.stripeAccountId);

    const isComplete = account.charges_enabled && account.payouts_enabled;

    if (isComplete && partner.status === 'verified') {
      partner.status = 'active';
      partner.isActive = true;
      await this.partnerRepository.save(partner);

      this.logger.log(`Activated partner ${partnerId} - Stripe onboarding complete`);
    }

    return {
      isComplete,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      status: partner.status,
    };
  }

  /**
   * Get lawyer profile by partner ID
   */
  async getLawyerProfile(partnerId: string) {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
      relations: ['referrals'],
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    return partner;
  }

  /**
   * Update lawyer profile
   */
  async updateLawyerProfile(partnerId: string, dto: UpdateLawyerProfileDto) {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    if (dto.bio) partner.bio = dto.bio;
    if (dto.website) partner.website = dto.website;
    if (dto.phone) partner.phone = dto.phone;
    if (dto.languages) partner.languages = dto.languages;
    if (dto.specializations) partner.specializations = dto.specializations;

    await this.partnerRepository.save(partner);

    this.logger.log(`Updated profile for partner ${partnerId}`);

    return partner;
  }

  /**
   * Get lawyer referrals and their status
   */
  async getLawyerReferrals(partnerId: string, status?: string, limit = 20, offset = 0) {
    const queryBuilder = this.referralRepository
      .createQueryBuilder('referral')
      .where('referral.partnerId = :partnerId', { partnerId })
      .leftJoinAndSelect('referral.user', 'user')
      .orderBy('referral.createdAt', 'DESC')
      .take(limit)
      .skip(offset);

    if (status) {
      queryBuilder.andWhere('referral.status = :status', { status });
    }

    const [referrals, total] = await queryBuilder.getManyAndCount();

    return {
      referrals,
      total,
      limit,
      offset,
    };
  }

  /**
   * Get lawyer payout summary
   */
  async getLawyerPayoutSummary(partnerId: string) {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
    });

    if (!partner || !partner.stripeAccountId) {
      throw new NotFoundException('Partner or Stripe account not found');
    }

    // Get Stripe balance
    const balance = await this.stripe.balance.retrieve({
      stripeAccount: partner.stripeAccountId,
    });

    // Get recent payouts
    const payouts = await this.stripe.payouts.list(
      {
        limit: 10,
      },
      {
        stripeAccount: partner.stripeAccountId,
      },
    );

    // Calculate total commission from referrals
    const referralStats = await this.referralRepository
      .createQueryBuilder('referral')
      .select('SUM(referral.commissionAmount)', 'totalCommission')
      .addSelect('COUNT(*)', 'totalReferrals')
      .addSelect('COUNT(CASE WHEN referral.status = :booked THEN 1 END)', 'bookedReferrals')
      .where('referral.partnerId = :partnerId', { partnerId })
      .setParameter('booked', 'booked')
      .getRawOne();

    return {
      balance: {
        available: balance.available,
        pending: balance.pending,
      },
      recentPayouts: payouts.data,
      referralStats: {
        totalCommission: referralStats.totalCommission || 0,
        totalReferrals: referralStats.totalReferrals || 0,
        bookedReferrals: referralStats.bookedReferrals || 0,
      },
    };
  }

  /**
   * Map jurisdiction to ISO country code for Stripe
   */
  private getCountryCode(jurisdiction: string): string {
    const mapping: Record<string, string> = {
      'UK': 'GB',
      'US-DE': 'US',
      'US-CA': 'US',
      'US-NY': 'US',
      'DE': 'DE',
      'FR': 'FR',
      'CZ': 'CZ',
      'GLOBAL-EN': 'US', // Default to US for global
    };

    return mapping[jurisdiction] || 'US';
  }
}
