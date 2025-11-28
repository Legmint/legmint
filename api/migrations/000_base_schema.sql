-- =========================================
-- Legmint Base Schema Migration
-- =========================================
-- This migration creates all base tables needed by the application.
-- Must run before any other migrations.

-- =========================================
-- 0. EXTENSIONS AND TYPES
-- =========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create plan enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_enum') THEN
        CREATE TYPE plan_enum AS ENUM ('free', 'pro', 'enterprise');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- 1. USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    clerk_user_id VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    jurisdictions_allowed TEXT[] DEFAULT ARRAY['GLOBAL-EN'],
    generation_count INTEGER DEFAULT 0,
    stripe_customer_id VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 2. SUBSCRIPTIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 3. PARTNERS TABLE (for lawyers)
-- =========================================
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    firm VARCHAR(500),
    jurisdiction VARCHAR(100) NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    bar_association VARCHAR(255),
    bar_number VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    stripe_account_id VARCHAR(255),
    stripe_status VARCHAR(50) DEFAULT 'disconnected',
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    price_fixed_cents INTEGER,
    price_hourly_cents INTEGER,
    verified_at TIMESTAMP,
    verified_by VARCHAR(255),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_jurisdiction ON partners(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_partners_stripe_status ON partners(stripe_status);
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 4. REFERRALS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    partner_id UUID REFERENCES partners(id),
    template_code VARCHAR(255),
    jurisdiction VARCHAR(100),
    status VARCHAR(50) DEFAULT 'created',
    amount_gross_cents INTEGER DEFAULT 0,
    amount_platform_fixed_cents INTEGER DEFAULT 2500,
    amount_platform_percent_cents INTEGER DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'eur',
    token VARCHAR(255) UNIQUE,
    stripe_checkout_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    s3_user_doc_key VARCHAR(500),
    s3_lawyer_review_key VARCHAR(500),
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_user_id ON referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_partner_id ON referrals(partner_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_token ON referrals(token);
CREATE INDEX IF NOT EXISTS idx_referrals_stripe_session ON referrals(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_referrals_stripe_payment ON referrals(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

DROP TRIGGER IF EXISTS update_referrals_updated_at ON referrals;
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 5. LAWYER_APPLICATIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS lawyer_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    firm VARCHAR(500),
    jurisdiction VARCHAR(100) NOT NULL,
    specializations TEXT[] DEFAULT '{}',
    bar_association VARCHAR(255),
    bar_number VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(100),
    experience_years INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    rejection_reason TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    documents JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lawyer_applications_email ON lawyer_applications(email);
CREATE INDEX IF NOT EXISTS idx_lawyer_applications_status ON lawyer_applications(status);
CREATE INDEX IF NOT EXISTS idx_lawyer_applications_jurisdiction ON lawyer_applications(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_lawyer_applications_user_id ON lawyer_applications(user_id);

DROP TRIGGER IF EXISTS update_lawyer_applications_updated_at ON lawyer_applications;
CREATE TRIGGER update_lawyer_applications_updated_at
    BEFORE UPDATE ON lawyer_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 6. AUDIT_LOGS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =========================================
-- 7. TEMPLATES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    jurisdictions TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{"en"}',
    description TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    render_engine VARCHAR(50) DEFAULT 'html',
    price_cents INTEGER DEFAULT 2900,
    currency VARCHAR(10) DEFAULT 'eur',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_code ON templates(code);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_is_featured ON templates(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_templates_jurisdictions ON templates USING GIN(jurisdictions);

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 8. FORM_SCHEMAS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS form_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(255) NOT NULL REFERENCES templates(code) ON DELETE CASCADE,
    schema JSONB NOT NULL,
    ui_schema JSONB,
    defaults JSONB,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_code, version)
);

CREATE INDEX IF NOT EXISTS idx_form_schemas_template_code ON form_schemas(template_code);
CREATE INDEX IF NOT EXISTS idx_form_schemas_active ON form_schemas(template_code, is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS update_form_schemas_updated_at ON form_schemas;
CREATE TRIGGER update_form_schemas_updated_at
    BEFORE UPDATE ON form_schemas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 9. TEMPLATE_OVERLAYS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS template_overlays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(255) NOT NULL REFERENCES templates(code) ON DELETE CASCADE,
    jurisdiction VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    overlay JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_code, jurisdiction, language, version)
);

CREATE INDEX IF NOT EXISTS idx_overlays_template_code ON template_overlays(template_code);
CREATE INDEX IF NOT EXISTS idx_overlays_jurisdiction ON template_overlays(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_overlays_active ON template_overlays(template_code, jurisdiction, is_active) WHERE is_active = true;

DROP TRIGGER IF EXISTS update_template_overlays_updated_at ON template_overlays;
CREATE TRIGGER update_template_overlays_updated_at
    BEFORE UPDATE ON template_overlays
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 10. DOCUMENTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    template_code VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    answers JSONB NOT NULL,
    s3_key VARCHAR(1000) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    file_size_bytes INTEGER,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_template_code ON documents(template_code);
CREATE INDEX IF NOT EXISTS idx_documents_jurisdiction ON documents(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_user_template ON documents(user_id, template_code);

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 11. TEMPLATE_VERSIONS TABLE (for audit)
-- =========================================
CREATE TABLE IF NOT EXISTS template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(255) NOT NULL,
    version INTEGER NOT NULL,
    changed_by VARCHAR(255),
    change_description TEXT,
    template_snapshot JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_code, version)
);

CREATE INDEX IF NOT EXISTS idx_template_versions_code ON template_versions(template_code);

-- =========================================
-- MIGRATION COMPLETE
-- =========================================
