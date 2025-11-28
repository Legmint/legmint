-- =========================================
-- Legmint Template Library System Migration
-- =========================================
-- This migration adds comprehensive support for:
-- - 70+ legal document templates
-- - JSON Schema form definitions
-- - Jurisdiction-specific overlays (UK/DE/CZ/US)
-- - Document generation and storage
-- - Preview (free) and Generate (paywalled) flows

-- =========================================
-- 1. TEMPLATES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('startup', 'b2b', 'b2c', 'p2p', 'other')),
    jurisdictions TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{"en"}',
    description TEXT,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    render_engine VARCHAR(50) DEFAULT 'html' CHECK (render_engine IN ('html', 'docx')),
    price_cents INTEGER DEFAULT 2900,
    currency VARCHAR(10) DEFAULT 'eur',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_code ON templates(code);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_jurisdictions ON templates USING GIN(jurisdictions);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- 2. FORM_SCHEMAS TABLE
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
-- 3. TEMPLATE_OVERLAYS TABLE
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
-- 4. DOCUMENTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    template_code VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    answers JSONB NOT NULL,
    s3_key VARCHAR(1000) NOT NULL,
    file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('pdf', 'docx')),
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
-- 5. TEMPLATE_VERSIONS TABLE (for audit)
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
-- 6. HELPER VIEWS
-- =========================================

-- Active templates with form schemas
CREATE OR REPLACE VIEW active_templates AS
SELECT
    t.*,
    fs.schema as form_schema,
    fs.ui_schema,
    fs.defaults as form_defaults,
    COUNT(d.id) as generation_count
FROM templates t
LEFT JOIN form_schemas fs ON t.code = fs.template_code AND fs.is_active = true
LEFT JOIN documents d ON t.code = d.template_code
WHERE t.is_active = true
GROUP BY t.id, fs.id;

-- User document history
CREATE OR REPLACE VIEW user_document_history AS
SELECT
    d.*,
    t.title as template_title,
    t.category,
    u.email as user_email
FROM documents d
LEFT JOIN templates t ON d.template_code = t.code
LEFT JOIN users u ON d.user_id = u.id
ORDER BY d.created_at DESC;

-- Template generation stats
CREATE OR REPLACE VIEW template_stats AS
SELECT
    t.code,
    t.title,
    t.category,
    COUNT(DISTINCT d.user_id) as unique_users,
    COUNT(d.id) as total_generations,
    MAX(d.created_at) as last_generated_at
FROM templates t
LEFT JOIN documents d ON t.code = d.template_code
GROUP BY t.code, t.title, t.category
ORDER BY total_generations DESC;

-- =========================================
-- 7. SAMPLE DATA FOR TESTING
-- =========================================

-- Insert a sample template (for testing)
INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents)
VALUES (
    'founders-agreement',
    'Founders Agreement',
    'startup',
    ARRAY['UK', 'DE', 'CZ', 'US-DE', 'US-CA'],
    ARRAY['en'],
    'Comprehensive founders agreement covering equity split, vesting, roles, IP assignment, and exit provisions.',
    'html',
    2900
) ON CONFLICT (code) DO NOTHING;

-- =========================================
-- MIGRATION COMPLETE
-- =========================================
-- Next steps:
-- 1. Run: npm run migrate (or psql $DATABASE_URL -f migrations/003_template_library_system.sql)
-- 2. Verify tables: \dt
-- 3. Seed templates: npm run seed:templates
-- 4. Test queries: SELECT * FROM active_templates;
