-- Migration: Enterprise Application System
-- Creates tables for enterprise subscription vetting workflow

-- Enterprise Applications Table
CREATE TABLE IF NOT EXISTS enterprise_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Application Type
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('enterprise', 'enterprise-ultra')),

    -- Company Information
    company_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100),
    website VARCHAR(500),
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL,

    -- Primary Contact
    contact_name VARCHAR(255) NOT NULL,
    contact_title VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),

    -- Use Case
    use_cases TEXT[] NOT NULL DEFAULT '{}',
    estimated_monthly_documents VARCHAR(50),
    jurisdictions TEXT[] NOT NULL DEFAULT '{}',
    use_case_description TEXT,

    -- Fast Track (Optional)
    linkedin_url VARCHAR(500),
    referral_source VARCHAR(255),
    has_legal_counsel BOOLEAN DEFAULT FALSE,
    is_publicly_listed BOOLEAN DEFAULT FALSE,

    -- Enterprise Ultra Specific
    account_manager_timezone VARCHAR(100),
    white_label_required BOOLEAN DEFAULT FALSE,
    white_label_description TEXT,
    integration_requirements TEXT,
    expected_user_count INTEGER,

    -- Declarations
    authorized_signatory BOOLEAN NOT NULL DEFAULT FALSE,
    not_sanctioned BOOLEAN NOT NULL DEFAULT FALSE,
    understands_ai_disclaimer BOOLEAN NOT NULL DEFAULT FALSE,
    agrees_to_terms BOOLEAN NOT NULL DEFAULT FALSE,

    -- Status & Workflow
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'clarification_needed', 'approved', 'rejected')),
    reviewer_notes TEXT,
    clarification_request TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,

    -- Stripe & Contract
    stripe_customer_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    contract_signed_at TIMESTAMP,
    contract_ip_address VARCHAR(50),

    -- User Reference (if signed in)
    user_id VARCHAR(255),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_enterprise_applications_status ON enterprise_applications(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_applications_plan_type ON enterprise_applications(plan_type);
CREATE INDEX IF NOT EXISTS idx_enterprise_applications_email ON enterprise_applications(contact_email);
CREATE INDEX IF NOT EXISTS idx_enterprise_applications_created_at ON enterprise_applications(created_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_enterprise_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enterprise_applications_updated_at ON enterprise_applications;
CREATE TRIGGER trigger_enterprise_applications_updated_at
    BEFORE UPDATE ON enterprise_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_enterprise_applications_updated_at();

-- Comments for documentation
COMMENT ON TABLE enterprise_applications IS 'Enterprise and Enterprise Ultra subscription applications with vetting workflow';
COMMENT ON COLUMN enterprise_applications.status IS 'pending -> under_review -> approved/rejected/clarification_needed';
