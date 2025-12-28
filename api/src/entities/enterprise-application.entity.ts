import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type EnterpriseApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'clarification_needed'
  | 'approved'
  | 'rejected';

export type EnterprisePlanType = 'enterprise' | 'enterprise-ultra';

@Entity('enterprise_applications')
export class EnterpriseApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Application Type
  @Column({ name: 'plan_type' })
  @Index()
  planType: EnterprisePlanType;

  // Company Information
  @Column({ name: 'company_name' })
  companyName: string;

  @Column()
  country: string;

  @Column({ name: 'registration_number', nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  website: string;

  @Column()
  industry: string;

  @Column({ name: 'company_size' })
  companySize: string;

  // Primary Contact
  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ name: 'contact_title' })
  contactTitle: string;

  @Column({ name: 'contact_email' })
  @Index()
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  // Use Case
  @Column('text', { array: true, name: 'use_cases', default: '{}' })
  useCases: string[];

  @Column({ name: 'estimated_monthly_documents', nullable: true })
  estimatedMonthlyDocuments: string;

  @Column('text', { array: true, default: '{}' })
  jurisdictions: string[];

  @Column({ name: 'use_case_description', type: 'text', nullable: true })
  useCaseDescription: string;

  // Fast Track (Optional)
  @Column({ name: 'linkedin_url', nullable: true })
  linkedinUrl: string;

  @Column({ name: 'referral_source', nullable: true })
  referralSource: string;

  @Column({ name: 'has_legal_counsel', default: false })
  hasLegalCounsel: boolean;

  @Column({ name: 'is_publicly_listed', default: false })
  isPubliclyListed: boolean;

  // Enterprise Ultra Specific
  @Column({ name: 'account_manager_timezone', nullable: true })
  accountManagerTimezone: string;

  @Column({ name: 'white_label_required', default: false })
  whiteLabelRequired: boolean;

  @Column({ name: 'white_label_description', type: 'text', nullable: true })
  whiteLabelDescription: string;

  @Column({ name: 'integration_requirements', type: 'text', nullable: true })
  integrationRequirements: string;

  @Column({ name: 'expected_user_count', nullable: true })
  expectedUserCount: number;

  // Declarations
  @Column({ name: 'authorized_signatory', default: false })
  authorizedSignatory: boolean;

  @Column({ name: 'not_sanctioned', default: false })
  notSanctioned: boolean;

  @Column({ name: 'understands_ai_disclaimer', default: false })
  understandsAiDisclaimer: boolean;

  @Column({ name: 'agrees_to_terms', default: false })
  agreesToTerms: boolean;

  // Status & Workflow
  @Column({ default: 'pending' })
  @Index()
  status: EnterpriseApplicationStatus;

  @Column({ name: 'reviewer_notes', type: 'text', nullable: true })
  reviewerNotes: string;

  @Column({ name: 'clarification_request', type: 'text', nullable: true })
  clarificationRequest: string;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @Column({ name: 'reviewed_at', nullable: true })
  reviewedAt: Date;

  // Stripe & Contract
  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @Column({ name: 'stripe_invoice_id', nullable: true })
  stripeInvoiceId: string;

  @Column({ name: 'contract_signed_at', nullable: true })
  contractSignedAt: Date;

  @Column({ name: 'contract_ip_address', nullable: true })
  contractIpAddress: string;

  // User Reference
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
