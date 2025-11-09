-- =========================================
-- Legmint Lawyer Referral System Migration
-- =========================================
-- This migration adds comprehensive support for:
-- - Lawyer onboarding and verification
-- - Document review referrals
-- - Stripe Connect payment processing
-- - €25 fixed + 10% variable fee model
-- - Admin oversight and reporting

-- =========================================
-- 1. USERS TABLE (enhance existing)
-- =========================================
-- Add Stripe customer ID if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='stripe_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- =========================================
-- 2. PARTNERS TABLE (enhance for lawyers)
-- =========================================
ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS price_fixed_cents INTEGER,
    ADD COLUMN IF NOT EXISTS price_hourly_cents INTEGER,
    ADD COLUMN IF NOT EXISTS stripe_status VARCHAR(50) DEFAULT 'disconnected',
    ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
    ADD COLUMN IF NOT EXISTS user_id VARCHAR(255);

-- Add check constraint for status
DO $$
BEGIN
    ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_status_check;
    ALTER TABLE partners ADD CONSTRAINT partners_status_check
        CHECK (status IN ('pending', 'verified', 'active', 'suspended', 'rejected'));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_stripe_status ON partners(stripe_status);
CREATE INDEX IF NOT EXISTS idx_partners_jurisdiction ON partners(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);

-- =========================================
-- 3. LAWYER_APPLICATIONS TABLE (enhance)
-- =========================================
ALTER TABLE lawyer_applications
    ADD COLUMN IF NOT EXISTS bar_number VARCHAR(255),
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- =========================================
-- 4. REFERRALS TABLE (enhance for document review)
-- =========================================
-- Drop old enum and recreate with new values
DO $$
BEGIN
    ALTER TABLE referrals DROP CONSTRAINT IF EXISTS referrals_status_check;
END $$;

ALTER TABLE referrals
    ADD COLUMN IF NOT EXISTS amount_gross_cents INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS amount_platform_fixed_cents INTEGER DEFAULT 2500,
    ADD COLUMN IF NOT EXISTS amount_platform_percent_cents INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'eur',
    ADD COLUMN IF NOT EXISTS stripe_checkout_session_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS s3_user_doc_key VARCHAR(500),
    ADD COLUMN IF NOT EXISTS s3_lawyer_review_key VARCHAR(500),
    ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP;

-- Update status to use new values
ALTER TABLE referrals ADD CONSTRAINT referrals_status_check
    CHECK (status IN ('created', 'clicked', 'booked', 'expired', 'requested', 'paid', 'assigned', 'in_review', 'completed', 'refunded', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_stripe_session ON referrals(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_referrals_stripe_payment ON referrals(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON referrals(created_at DESC);

-- =========================================
-- 5. ORDERS TABLE (new - tracks all billing)
-- =========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    lawyer_id UUID REFERENCES partners(id),
    referral_id UUID REFERENCES referrals(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('subscription', 'template', 'referral', 'add_on')),
    amount_gross_cents INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'eur',
    platform_fee_fixed_cents INTEGER DEFAULT 0,
    platform_fee_percent_cents INTEGER DEFAULT 0,
    amount_platform_cents INTEGER DEFAULT 0,
    amount_lawyer_cents INTEGER DEFAULT 0,
    stripe_invoice_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_lawyer_id ON orders(lawyer_id);
CREATE INDEX idx_orders_referral_id ON orders(referral_id);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_stripe_payment ON orders(stripe_payment_intent_id);

-- =========================================
-- 6. PAYOUT_REPORTS TABLE (new - monthly summaries)
-- =========================================
CREATE TABLE IF NOT EXISTS payout_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES partners(id),
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_referrals INTEGER DEFAULT 0,
    total_earnings_cents INTEGER DEFAULT 0,
    total_platform_fees_cents INTEGER DEFAULT 0,
    referral_breakdown JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lawyer_id, month)
);

CREATE INDEX idx_payout_reports_lawyer_month ON payout_reports(lawyer_id, month DESC);

-- =========================================
-- 7. AUDIT_LOGS TABLE (ensure exists)
-- =========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =========================================
-- 8. HELPER FUNCTIONS
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referrals_updated_at ON referrals;
CREATE TRIGGER update_referrals_updated_at
    BEFORE UPDATE ON referrals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 9. SEED DATA (optional test lawyers)
-- =========================================

-- Insert test lawyers (only if table is empty)
INSERT INTO partners (
    name, full_name, email, jurisdiction, specializations, languages,
    bio, website, phone, rating, review_count,
    price_fixed_cents, price_hourly_cents,
    status, is_active
)
SELECT
    'Sarah Mitchell', 'Sarah Mitchell', 'sarah.mitchell@lawfirm.uk', 'UK',
    ARRAY['fundraising', 'corporate', 'saas'], ARRAY['English'],
    'Experienced UK startup lawyer specializing in venture capital and SaaS agreements. 10+ years advising tech companies.',
    'https://mitchelllegal.co.uk', '+44 20 7123 4567',
    4.9, 127,
    20000, 25000,
    'pending', false
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE email = 'sarah.mitchell@lawfirm.uk');

INSERT INTO partners (
    name, full_name, email, jurisdiction, specializations, languages,
    bio, website, phone, rating, review_count,
    price_fixed_cents, price_hourly_cents,
    status, is_active
)
SELECT
    'Thomas Weber', 'Dr. Thomas Weber', 'thomas.weber@kanzlei.de', 'DE',
    ARRAY['corporate', 'data-protection', 'employment'], ARRAY['German', 'English'],
    'German commercial lawyer with expertise in GmbH, GDPR compliance, and employment law.',
    'https://weber-kanzlei.de', '+49 30 1234 5678',
    4.7, 85,
    22000, 28000,
    'pending', false
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE email = 'thomas.weber@kanzlei.de');

-- =========================================
-- MIGRATION COMPLETE
-- =========================================
-- Next steps:
-- 1. Run: psql $DATABASE_URL -f migrations/001_lawyer_referral_system.sql
-- 2. Verify tables: \dt
-- 3. Check indexes: \di
-- 4. Test with seed data: SELECT * FROM partners;
