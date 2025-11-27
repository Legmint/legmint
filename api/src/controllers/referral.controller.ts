/**
 * Referral Controller
 *
 * Handles attorney referral system:
 * - Matching partners to templates and jurisdictions
 * - Generating discount tokens
 * - Tracking CTA clicks and conversions
 * - Processing partner booking webhooks
 *
 * ⚖️ LEGAL COMPLIANCE REQUIREMENTS:
 *
 * This controller implements a lawyer referral service that receives commissions
 * from legal professionals. The following compliance requirements MUST be met:
 *
 * 1. DISCLOSURE REQUIREMENTS (Multi-Jurisdiction):
 *    - UK: SRA Transparency Rules require clear disclosure of referral arrangements
 *    - US: ABA Model Rule 7.2(b)(4) requires disclosure of compensation for referrals
 *    - EU: Unfair Commercial Practices Directive requires material information disclosure
 *    - All jurisdictions: Users must be informed BEFORE engaging with referred professionals
 *
 * 2. FEE-SPLITTING RESTRICTIONS:
 *    - US: Most states prohibit fee-splitting between lawyers and non-lawyers (ABA Model Rule 5.4)
 *    - UK: Referral fees are permitted but must comply with SRA Standards and Regulations
 *    - Ensure referred lawyers are aware of and comply with their jurisdiction's rules
 *
 * 3. MANDATORY DISCLOSURES TO USERS:
 *    ✓ That LegalMind receives a financial benefit from referrals
 *    ✓ The approximate percentage or range of referral fees
 *    ✓ That referral fees do not increase user costs
 *    ✓ How matching/ranking is determined
 *    ✓ That users are free to seek legal services elsewhere
 *
 * 4. PARTNER LAWYER REQUIREMENTS:
 *    - Must verify bar admission and good standing
 *    - Must ensure partners comply with their jurisdiction's referral fee rules
 *    - Must have written agreements with all partners documenting the arrangement
 *    - Partners must independently disclose the referral arrangement to their clients
 *
 * 5. PROHIBITED PRACTICES:
 *    ✗ Do NOT allow referral fees to influence matching (already compliant - see line 280)
 *    ✗ Do NOT make guarantees about legal outcomes
 *    ✗ Do NOT create impression that LegalMind provides legal services
 *    ✗ Do NOT refer to unlicensed or suspended practitioners
 *
 * 6. REGULATORY REGISTRATION:
 *    - Some jurisdictions require registration as a lawyer referral service
 *    - Consult with legal counsel about registration requirements in operating jurisdictions
 *
 * IMPLEMENTATION STATUS:
 * ✓ Disclosure added to Terms & Conditions (Section 9)
 * ✓ Disclosure banner on lawyers page
 * ⚠️ TODO: Add written partner agreements requirement
 * ⚠️ TODO: Implement bar verification API integration
 * ⚠️ TODO: Add jurisdiction-specific referral fee rules validation
 * ⚠️ TODO: Obtain legal opinion on regulatory registration requirements
 */

import { Controller, Post, Get, Body, Param, Req, Headers, UnauthorizedException, Version } from '@nestjs/common';
import { AuthenticatedRequest } from '../middleware/paywall.middleware';
import { createHash, randomBytes } from 'crypto';

export class ReferralRequestDto {
  template_code: string;
  jurisdiction: string;
  audit_id?: string;
}

export class CtaClickedDto {
  partner_id: string;
}

export class BookingWebhookDto {
  partner_id: string;
  discount_token: string;
  booking_confirmed: boolean;
  booking_value?: number;
}

interface Partner {
  partner_id: string;
  name: string;
  jurisdiction: string;
  specializations: string[];
  bio: string;
  photo_url: string;
  booking_url: string;
  discount_percentage: number;
  rating: number;
  status: 'active' | 'inactive';
}

@Controller('referral')
@Version('1')
export class ReferralController {
  private readonly partners: Partner[] = [
    {
      partner_id: 'partner_uk_lex_co',
      name: 'Lex & Co Solicitors',
      jurisdiction: 'UK',
      specializations: ['fundraising', 'corporate', 'saas'],
      bio: 'Leading UK startup law firm with 15+ years experience in venture capital, M&A, and SaaS agreements. Trusted by 200+ startups.',
      photo_url: 'https://cdn.legalmind.tech/partners/lex-co.jpg',
      booking_url: 'https://lexco.com/book',
      discount_percentage: 20,
      rating: 4.8,
      status: 'active'
    },
    {
      partner_id: 'partner_usde_startup_law',
      name: 'Delaware Startup Counsel',
      jurisdiction: 'US-DE',
      specializations: ['fundraising', 'corporate', 'ip'],
      bio: 'Specialized in Delaware C-corp formations, SAFE/convertible note financings, and Series A/B rounds. Silicon Valley experience.',
      photo_url: 'https://cdn.legalmind.tech/partners/startup-counsel.jpg',
      booking_url: 'https://delawarestartuplawyers.com/consult',
      discount_percentage: 15,
      rating: 4.9,
      status: 'active'
    },
    {
      partner_id: 'partner_de_rechtsanwaelte',
      name: 'Müller & Partner Rechtsanwälte',
      jurisdiction: 'DE',
      specializations: ['corporate', 'saas', 'data-protection'],
      bio: 'German commercial law specialists with expertise in GmbH formations, investment agreements, and GDPR compliance.',
      photo_url: 'https://cdn.legalmind.tech/partners/mueller-partner.jpg',
      booking_url: 'https://mueller-partner.de/termin',
      discount_percentage: 20,
      rating: 4.7,
      status: 'active'
    }
  ];

  /**
   * POST /referral
   *
   * Get matched attorney partners for template and jurisdiction.
   * Generates unique discount token for tracking.
   */
  @Post()
  async createReferral(
    @Body() dto: ReferralRequestDto,
    @Req() req: AuthenticatedRequest
  ) {
    const { template_code, jurisdiction, audit_id } = dto;

    try {
      // Match partners to jurisdiction and template specialization
      const matchedPartners = await this.matchPartners(template_code, jurisdiction);

      if (matchedPartners.length === 0) {
        return {
          referral_id: null,
          partners: [],
          message: 'No attorney partners currently available for this jurisdiction'
        };
      }

      // Generate referral ID
      const referralId = `ref_${randomBytes(12).toString('hex')}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Generate discount tokens for each partner
      const partnersWithTokens = matchedPartners.map(partner => {
        const token = this.generateDiscountToken(referralId, partner.partner_id, jurisdiction);
        const bookingUrlWithToken = `${partner.booking_url}?ref=${token}`;

        return {
          partner_id: partner.partner_id,
          name: partner.name,
          jurisdiction: partner.jurisdiction,
          specializations: partner.specializations,
          bio: partner.bio,
          photo_url: partner.photo_url,
          discount_token: token,
          discount_percentage: partner.discount_percentage,
          booking_url: bookingUrlWithToken,
          rating: partner.rating
        };
      });

      // Store referral in database
      await this.storeReferral({
        referral_id: referralId,
        user_id: req.user.user_id,
        template_code,
        jurisdiction,
        audit_id,
        partners: partnersWithTokens.map(p => ({
          partner_id: p.partner_id,
          discount_token: p.discount_token
        })),
        expires_at: expiresAt,
        cta_clicked: false,
        booking_completed: false
      });

      return {
        referral_id: referralId,
        partners: partnersWithTokens,
        expires_at: expiresAt.toISOString()
      };
    } catch (error) {
      console.error('Referral creation failed:', error);
      throw error;
    }
  }

  /**
   * POST /referral/:referral_id/cta-clicked
   *
   * Track when user clicks "Get Attorney Review" CTA
   */
  @Post(':referral_id/cta-clicked')
  async trackCtaClick(
    @Param('referral_id') referralId: string,
    @Body() dto: CtaClickedDto,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      // Update referral record
      await this.updateReferral(referralId, {
        cta_clicked: true,
        cta_clicked_at: new Date(),
        cta_partner_id: dto.partner_id
      });

      // Track analytics event
      await this.trackEvent('referral_cta_clicked', {
        referral_id: referralId,
        user_id: req.user.user_id,
        partner_id: dto.partner_id,
        timestamp: new Date()
      });

      return { status: 'ok' };
    } catch (error) {
      console.error('Failed to track CTA click:', error);
      throw error;
    }
  }

  /**
   * POST /referral/:referral_id/booking-webhook
   *
   * Webhook called by partner systems when booking is confirmed.
   * Requires API key authentication.
   */
  @Post(':referral_id/booking-webhook')
  async handleBookingWebhook(
    @Param('referral_id') referralId: string,
    @Body() dto: BookingWebhookDto,
    @Headers('x-api-key') apiKey: string
  ) {
    // Verify API key (partner-specific)
    if (!this.verifyPartnerApiKey(dto.partner_id, apiKey)) {
      throw new UnauthorizedException('Invalid API key');
    }

    try {
      // Verify discount token
      const referral = await this.getReferral(referralId);
      if (!referral) {
        throw new Error('Referral not found');
      }

      const partnerInReferral = referral.partners.find(
        p => p.partner_id === dto.partner_id && p.discount_token === dto.discount_token
      );

      if (!partnerInReferral) {
        throw new Error('Invalid partner or discount token');
      }

      // Update referral with booking confirmation
      await this.updateReferral(referralId, {
        booking_completed: dto.booking_confirmed,
        booking_completed_at: new Date(),
        booking_value: dto.booking_value
      });

      // Calculate commission (if booking confirmed)
      if (dto.booking_confirmed && dto.booking_value) {
        const partner = this.partners.find(p => p.partner_id === dto.partner_id);
        if (partner) {
          const commissionPercentage = 0.1; // 10% default, could be partner-specific
          const commissionAmount = dto.booking_value * commissionPercentage;

          await this.recordCommission({
            referral_id: referralId,
            partner_id: dto.partner_id,
            booking_value: dto.booking_value,
            commission_amount: commissionAmount,
            commission_percentage: commissionPercentage
          });
        }
      }

      // Track analytics
      await this.trackEvent('referral_booking_confirmed', {
        referral_id: referralId,
        partner_id: dto.partner_id,
        booking_value: dto.booking_value,
        timestamp: new Date()
      });

      return { status: 'ok', commission_recorded: dto.booking_confirmed };
    } catch (error) {
      console.error('Booking webhook processing failed:', error);
      throw error;
    }
  }

  /**
   * Match partners to template and jurisdiction
   */
  private async matchPartners(templateCode: string, jurisdiction: string): Promise<Partner[]> {
    // Determine template category (fundraising, saas, etc.)
    const templateCategory = this.getTemplateCategory(templateCode);

    // Filter partners by:
    // 1. Jurisdiction match
    // 2. Specialization match
    // 3. Active status
    const matched = this.partners
      .filter(p => p.jurisdiction === jurisdiction && p.status === 'active')
      .filter(p => p.specializations.includes(templateCategory))
      .sort((a, b) => b.rating - a.rating) // Sort by rating descending
      .slice(0, 3); // Return top 3

    return matched;
  }

  /**
   * Get template category from template code
   */
  private getTemplateCategory(templateCode: string): string {
    if (templateCode.includes('SAFE') || templateCode.includes('FOUNDERS') || templateCode.includes('SHAREHOLDERS')) {
      return 'fundraising';
    }
    if (templateCode.includes('SAAS') || templateCode.includes('DPA') || templateCode.includes('PRIVACY')) {
      return 'saas';
    }
    return 'general';
  }

  /**
   * Generate unique discount token
   */
  private generateDiscountToken(referralId: string, partnerId: string, jurisdiction: string): string {
    const random = randomBytes(4).toString('hex').toUpperCase();
    return `LM-${jurisdiction}-${random}`;
  }

  /**
   * Verify partner API key (mock - would check database in production)
   */
  private verifyPartnerApiKey(partnerId: string, apiKey: string): boolean {
    // In production, verify against database
    const validKeys = {
      'partner_uk_lex_co': 'sk_test_lex_co_key',
      'partner_usde_startup_law': 'sk_test_startup_law_key',
      'partner_de_rechtsanwaelte': 'sk_test_mueller_key'
    };
    return validKeys[partnerId] === apiKey;
  }

  /**
   * Mock database operations - replace with actual DB calls
   */
  private async storeReferral(referral: any) {
    console.log('Storing referral:', referral);
    // Database insert
  }

  private async getReferral(referralId: string) {
    console.log('Fetching referral:', referralId);
    // Database query
    return {
      referral_id: referralId,
      partners: []
    };
  }

  private async updateReferral(referralId: string, updates: any) {
    console.log('Updating referral:', referralId, updates);
    // Database update
  }

  private async recordCommission(commission: any) {
    console.log('Recording commission:', commission);
    // Database insert
  }

  private async trackEvent(eventName: string, data: any) {
    console.log('Analytics event:', eventName, data);
    // Analytics tracking (e.g., Mixpanel, Segment)
  }
}
