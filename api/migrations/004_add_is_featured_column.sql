-- =========================================
-- Migration: Add is_featured column to templates
-- =========================================
-- This migration adds the is_featured column if it doesn't exist
-- Safe to run multiple times (uses IF NOT EXISTS pattern)

-- Add is_featured column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'templates' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE templates ADD COLUMN is_featured BOOLEAN DEFAULT false;
        RAISE NOTICE 'Added is_featured column to templates table';
    ELSE
        RAISE NOTICE 'is_featured column already exists';
    END IF;
END $$;

-- Create index for featured templates queries
CREATE INDEX IF NOT EXISTS idx_templates_is_featured ON templates(is_featured) WHERE is_featured = true;
