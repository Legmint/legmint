-- =========================================
-- Legmint Stripe Subscriptions & Entitlements Migration
-- =========================================
-- This migration adds support for:
-- - Stripe subscriptions (Pro/Scale plans)
-- - Document entitlements (one-time purchases)
-- - Enhanced orders tracking

-- =========================================
-- 1. SUBSCRIPTIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    price_id VARCHAR(255) NOT NULL,
    plan_key VARCHAR(50) NOT NULL CHECK (plan_key IN ('starter', 'pro', 'scale')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'trialing')),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP,
    trial_end TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_key ON subscriptions(plan_key);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 2. DOCUMENT_ENTITLEMENTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS document_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    template_code VARCHAR(255) NOT NULL,
    order_id UUID REFERENCES orders(id),
    single_use BOOLEAN DEFAULT true,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON document_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_template_code ON document_entitlements(template_code);
CREATE INDEX IF NOT EXISTS idx_entitlements_order_id ON document_entitlements(order_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_template ON document_entitlements(user_id, template_code);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at ON document_entitlements(expires_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_document_entitlements_updated_at ON document_entitlements;
CREATE TRIGGER update_document_entitlements_updated_at
    BEFORE UPDATE ON document_entitlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 3. ENHANCE ORDERS TABLE (if needed)
-- =========================================
-- Add template_code column to orders if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='orders' AND column_name='template_code'
    ) THEN
        ALTER TABLE orders ADD COLUMN template_code VARCHAR(255);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='orders' AND column_name='subscription_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN subscription_id UUID REFERENCES subscriptions(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_orders_template_code ON orders(template_code);
CREATE INDEX IF NOT EXISTS idx_orders_subscription_id ON orders(subscription_id);

-- =========================================
-- 4. ADD STRIPE CUSTOMER TO USERS (if needed)
-- =========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='stripe_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR(255) UNIQUE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- =========================================
-- 5. HELPER VIEWS (optional but useful)
-- =========================================

-- View for active subscriptions
CREATE OR REPLACE VIEW active_subscriptions AS
SELECT
    s.*,
    u.email as user_email
FROM subscriptions s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.status IN ('active', 'trialing');

-- View for available entitlements
CREATE OR REPLACE VIEW available_entitlements AS
SELECT
    e.*,
    u.email as user_email
FROM document_entitlements e
LEFT JOIN users u ON e.user_id = u.id
WHERE e.used = false
  AND (e.expires_at IS NULL OR e.expires_at > CURRENT_TIMESTAMP);

-- =========================================
-- MIGRATION COMPLETE
-- =========================================
-- Next steps:
-- 1. Run: psql $DATABASE_URL -f migrations/002_stripe_subscriptions_and_entitlements.sql
-- 2. Verify tables: \dt
-- 3. Test queries: SELECT * FROM subscriptions; SELECT * FROM document_entitlements;
