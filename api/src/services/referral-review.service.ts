import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Referral, ReferralStatus } from '../entities/referral.entity';
import { Partner } from '../entities/partner.entity';
import { CreateReferralReviewDto } from '../dto/referral-review.dto';

/**
 * ReferralReviewService
 *
 * Manages the lawyer document review referral workflow:
 * 1. User creates referral request
 * 2. System matches available lawyers
 * 3. User selects lawyer and pays
 * 4. Lawyer reviews document
 * 5. System delivers reviewed document
 */
@Injectable()
export class ReferralReviewService {
  private readonly logger = new Logger(ReferralReviewService.name);

  constructor(
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  /**
   * Create a new referral request (before payment)
   */
  async createReferralRequest(dto: CreateReferralReviewDto): Promise<Referral> {
    try {
      // Find available lawyers for jurisdiction
      const availableLawyers = await this.getAvailableLawyers(dto.jurisdiction);

      if (availableLawyers.length === 0) {
        throw new BadRequestException(
          'No verified lawyers available for this jurisdiction',
        );
      }

      // For now, assign to first available lawyer
      // TODO: Implement matching algorithm based on specialization, rating, availability
      const assignedLawyer = availableLawyers[0];

      const referral = this.referralRepository.create({
        userId: dto.userId,
        partnerId: assignedLawyer.id,
        templateCode: dto.templateCode,
        jurisdiction: dto.jurisdiction,
        s3UserDocKey: dto.s3UserDocKey,
        status: ReferralStatus.REQUESTED,
        discountToken: '', // Legacy field, not used for review flow
        discountPercentage: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        amountGrossCents: assignedLawyer.priceFixedCents || 20000,
        amountPlatformFixedCents: 2500, // €25
      });

      await this.referralRepository.save(referral);

      this.logger.log(
        `Created referral ${referral.id} for user ${dto.userId} -> lawyer ${assignedLawyer.id}`,
      );

      return referral;
    } catch (error) {
      this.logger.error(`Failed to create referral request: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get available lawyers for jurisdiction
   */
  async getAvailableLawyers(jurisdiction: string): Promise<Partner[]> {
    return await this.partnerRepository.find({
      where: {
        jurisdiction,
        status: 'active',
        isActive: true,
        stripeStatus: 'charges_enabled',
      },
      order: {
        rating: 'DESC',
      },
    });
  }

  /**
   * Get lawyers filtered by jurisdiction and specialization
   */
  async getLawyersByFilters(
    jurisdiction: string,
    specialization?: string,
  ): Promise<Partner[]> {
    const queryBuilder = this.partnerRepository
      .createQueryBuilder('partner')
      .where('partner.jurisdiction = :jurisdiction', { jurisdiction })
      .andWhere('partner.status = :status', { status: 'active' })
      .andWhere('partner.isActive = true')
      .andWhere('partner.stripeStatus = :stripeStatus', {
        stripeStatus: 'charges_enabled',
      });

    if (specialization) {
      queryBuilder.andWhere(':specialization = ANY(partner.specializations)', {
        specialization,
      });
    }

    queryBuilder.orderBy('partner.rating', 'DESC');

    return await queryBuilder.getMany();
  }

  /**
   * Lawyer accepts referral
   */
  async acceptReferral(referralId: string, lawyerId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    if (referral.partnerId !== lawyerId) {
      throw new BadRequestException('This referral is not assigned to you');
    }

    if (referral.status !== ReferralStatus.PAID) {
      throw new BadRequestException('Referral must be paid before accepting');
    }

    referral.status = ReferralStatus.ASSIGNED;
    referral.assignedAt = new Date();

    await this.referralRepository.save(referral);

    this.logger.log(`Lawyer ${lawyerId} accepted referral ${referralId}`);

    return referral;
  }

  /**
   * Lawyer marks referral as in review
   */
  async startReview(referralId: string, lawyerId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    if (referral.partnerId !== lawyerId) {
      throw new BadRequestException('This referral is not assigned to you');
    }

    if (referral.status !== ReferralStatus.ASSIGNED) {
      throw new BadRequestException('Referral must be assigned to start review');
    }

    referral.status = ReferralStatus.IN_REVIEW;

    await this.referralRepository.save(referral);

    this.logger.log(`Lawyer ${lawyerId} started review of referral ${referralId}`);

    return referral;
  }

  /**
   * Lawyer completes referral with reviewed document
   */
  async completeReferral(
    referralId: string,
    lawyerId: string,
    s3LawyerReviewKey: string,
    notes?: string,
  ): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    if (referral.partnerId !== lawyerId) {
      throw new BadRequestException('This referral is not assigned to you');
    }

    if (![ReferralStatus.ASSIGNED, ReferralStatus.IN_REVIEW].includes(referral.status)) {
      throw new BadRequestException('Referral must be assigned or in review to complete');
    }

    referral.status = ReferralStatus.COMPLETED;
    referral.s3LawyerReviewKey = s3LawyerReviewKey;
    referral.completedAt = new Date();

    if (notes) {
      referral.metadata = {
        ...referral.metadata,
        reviewNotes: notes,
      };
    }

    await this.referralRepository.save(referral);

    this.logger.log(`Lawyer ${lawyerId} completed referral ${referralId}`);

    return referral;
  }

  /**
   * Get referral by ID
   */
  async getReferral(referralId: string): Promise<Referral> {
    const referral = await this.referralRepository.findOne({
      where: { id: referralId },
      relations: ['partner', 'user'],
    });

    if (!referral) {
      throw new NotFoundException('Referral not found');
    }

    return referral;
  }

  /**
   * Get referrals for a specific user
   */
  async getUserReferrals(userId: string): Promise<Referral[]> {
    return await this.referralRepository.find({
      where: { userId },
      relations: ['partner'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get referrals for a specific lawyer
   */
  async getLawyerReferrals(
    lawyerId: string,
    status?: ReferralStatus,
  ): Promise<Referral[]> {
    const where: any = { partnerId: lawyerId };
    if (status) {
      where.status = status;
    }

    return await this.referralRepository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}
