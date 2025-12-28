import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EnterpriseApplication } from '../entities/enterprise-application.entity';
import {
  CreateEnterpriseApplicationDto,
  ReviewEnterpriseApplicationDto,
  EnterpriseApplicationQueryDto,
  SignContractDto,
} from '../dto/enterprise-application.dto';

@Injectable()
export class EnterpriseService {
  private stripe: Stripe;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Submit a new enterprise application
   */
  async createApplication(
    dto: CreateEnterpriseApplicationDto,
    userId?: string,
  ): Promise<EnterpriseApplication> {
    // Validate declarations
    if (!dto.authorizedSignatory || !dto.notSanctioned || !dto.understandsAiDisclaimer || !dto.agreesToTerms) {
      throw new BadRequestException('All declarations must be accepted');
    }

    const result = await this.dataSource.query(
      `INSERT INTO enterprise_applications (
        plan_type, company_name, country, registration_number, website, industry, company_size,
        contact_name, contact_title, contact_email, contact_phone,
        use_cases, estimated_monthly_documents, jurisdictions, use_case_description,
        linkedin_url, referral_source, has_legal_counsel, is_publicly_listed,
        account_manager_timezone, white_label_required, white_label_description,
        integration_requirements, expected_user_count,
        authorized_signatory, not_sanctioned, understands_ai_disclaimer, agrees_to_terms,
        user_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, 'pending')
      RETURNING *`,
      [
        dto.planType,
        dto.companyName,
        dto.country,
        dto.registrationNumber || null,
        dto.website || null,
        dto.industry,
        dto.companySize,
        dto.contactName,
        dto.contactTitle,
        dto.contactEmail,
        dto.contactPhone || null,
        dto.useCases,
        dto.estimatedMonthlyDocuments || null,
        dto.jurisdictions,
        dto.useCaseDescription || null,
        dto.linkedinUrl || null,
        dto.referralSource || null,
        dto.hasLegalCounsel || false,
        dto.isPubliclyListed || false,
        dto.accountManagerTimezone || null,
        dto.whiteLabelRequired || false,
        dto.whiteLabelDescription || null,
        dto.integrationRequirements || null,
        dto.expectedUserCount || null,
        dto.authorizedSignatory,
        dto.notSanctioned,
        dto.understandsAiDisclaimer,
        dto.agreesToTerms,
        userId || null,
      ],
    );

    return result[0];
  }

  /**
   * Get all applications with optional filters
   */
  async getApplications(query: EnterpriseApplicationQueryDto): Promise<{
    applications: EnterpriseApplication[];
    total: number;
    stats: { pending: number; approved: number; rejected: number; clarification: number };
  }> {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (query.status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(query.status);
    }

    if (query.planType) {
      whereClause += ` AND plan_type = $${paramIndex++}`;
      params.push(query.planType);
    }

    const limit = query.limit || 50;
    const offset = query.offset || 0;

    const applications = await this.dataSource.query(
      `SELECT * FROM enterprise_applications ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, limit, offset],
    );

    const countResult = await this.dataSource.query(
      `SELECT COUNT(*) FROM enterprise_applications ${whereClause}`,
      params,
    );

    const statsResult = await this.dataSource.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE status = 'clarification_needed') as clarification
      FROM enterprise_applications
    `);

    return {
      applications,
      total: parseInt(countResult[0].count),
      stats: {
        pending: parseInt(statsResult[0].pending),
        approved: parseInt(statsResult[0].approved),
        rejected: parseInt(statsResult[0].rejected),
        clarification: parseInt(statsResult[0].clarification),
      },
    };
  }

  /**
   * Get a single application by ID
   */
  async getApplicationById(id: string): Promise<EnterpriseApplication> {
    const result = await this.dataSource.query(
      'SELECT * FROM enterprise_applications WHERE id = $1',
      [id],
    );

    if (!result.length) {
      throw new NotFoundException('Application not found');
    }

    return result[0];
  }

  /**
   * Review and update application status
   */
  async reviewApplication(
    id: string,
    dto: ReviewEnterpriseApplicationDto,
    reviewerEmail: string,
  ): Promise<EnterpriseApplication> {
    const application = await this.getApplicationById(id);

    if (dto.status === 'clarification_needed' && !dto.clarificationRequest) {
      throw new BadRequestException('Clarification request message is required');
    }

    const result = await this.dataSource.query(
      `UPDATE enterprise_applications
       SET status = $1, reviewer_notes = $2, clarification_request = $3, reviewed_by = $4, reviewed_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [dto.status, dto.reviewerNotes || null, dto.clarificationRequest || null, reviewerEmail, id],
    );

    const updatedApplication = result[0];

    // If approved, create Stripe customer and invoice
    if (dto.status === 'approved') {
      await this.createStripeCustomerAndInvoice(updatedApplication);
    }

    return updatedApplication;
  }

  /**
   * Create Stripe customer and send invoice
   */
  async createStripeCustomerAndInvoice(application: EnterpriseApplication): Promise<void> {
    // Create or retrieve Stripe customer
    let customer: Stripe.Customer;

    if (application.stripeCustomerId) {
      customer = await this.stripe.customers.retrieve(application.stripeCustomerId) as Stripe.Customer;
    } else {
      customer = await this.stripe.customers.create({
        email: application.contactEmail,
        name: application.companyName,
        metadata: {
          application_id: application.id,
          plan_type: application.planType,
          contact_name: application.contactName,
        },
      });

      // Update application with Stripe customer ID
      await this.dataSource.query(
        'UPDATE enterprise_applications SET stripe_customer_id = $1 WHERE id = $2',
        [customer.id, application.id],
      );
    }

    // Determine price based on plan type
    const priceAmount = application.planType === 'enterprise-ultra' ? 650000 : 350000; // cents
    const planName = application.planType === 'enterprise-ultra' ? 'Enterprise Ultra' : 'Enterprise';

    // Create invoice
    const invoice = await this.stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 14,
      metadata: {
        application_id: application.id,
        plan_type: application.planType,
      },
    });

    // Add line item
    await this.stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: priceAmount,
      currency: 'eur',
      description: `Legmint ${planName} - First Month`,
    });

    // Finalize and send invoice
    await this.stripe.invoices.finalizeInvoice(invoice.id);
    await this.stripe.invoices.sendInvoice(invoice.id);

    // Update application with invoice ID
    await this.dataSource.query(
      'UPDATE enterprise_applications SET stripe_invoice_id = $1 WHERE id = $2',
      [invoice.id, application.id],
    );
  }

  /**
   * Sign enterprise contract
   */
  async signContract(dto: SignContractDto, ipAddress: string): Promise<EnterpriseApplication> {
    const application = await this.getApplicationById(dto.applicationId);

    if (application.status !== 'approved') {
      throw new BadRequestException('Application must be approved before signing contract');
    }

    if (application.contractSignedAt) {
      throw new BadRequestException('Contract has already been signed');
    }

    if (!dto.acceptedTerms) {
      throw new BadRequestException('You must accept the terms to sign the contract');
    }

    const result = await this.dataSource.query(
      `UPDATE enterprise_applications
       SET contract_signed_at = NOW(), contract_ip_address = $1
       WHERE id = $2
       RETURNING *`,
      [ipAddress, dto.applicationId],
    );

    return result[0];
  }

  /**
   * Get application by email (for applicant to check status)
   */
  async getApplicationByEmail(email: string): Promise<EnterpriseApplication[]> {
    const result = await this.dataSource.query(
      'SELECT * FROM enterprise_applications WHERE contact_email = $1 ORDER BY created_at DESC',
      [email],
    );
    return result;
  }
}
