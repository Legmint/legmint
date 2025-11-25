#!/usr/bin/env ts-node

/**
 * Template Library Seeder
 *
 * Seeds the database with:
 * - 70+ template metadata from cms/templates/catalog.yaml
 * - JSON Schema forms from cms/forms/ (JSON files)
 * - Jurisdiction overlays from cms/overlays/ (JSON files)
 *
 * Usage: npm run seed:templates
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { Pool } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface TemplateMetadata {
  code: string;
  title: string;
  description: string;
  jurisdictions: string[];
  languages: string[];
  render_engine: string;
  price_cents: number;
  priority?: string;
  category?: string;
}

interface FormSchema {
  schema: any;
  uiSchema?: any;
  defaults?: any;
}

interface Overlay {
  templateCode: string;
  jurisdiction: string;
  language: string;
  overlay: any;
}

const CMS_ROOT = path.join(__dirname, '../../cms');
const CATALOG_PATH = path.join(CMS_ROOT, 'templates/catalog.yaml');
const FORMS_DIR = path.join(CMS_ROOT, 'forms');
const OVERLAYS_DIR = path.join(CMS_ROOT, 'overlays');

async function seedTemplates() {
  console.log('🌱 Starting template library seeder...\n');

  try {
    // 1. Read catalog
    console.log('📖 Reading template catalog...');
    const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');
    const catalog = yaml.load(catalogContent) as Record<string, TemplateMetadata[]>;

    let templateCount = 0;
    const allTemplates: TemplateMetadata[] = [];

    // Flatten catalog by category
    for (const [category, templates] of Object.entries(catalog)) {
      for (const template of templates) {
        allTemplates.push({
          ...template,
          category: category,
        });
        templateCount++;
      }
    }

    console.log(`   Found ${templateCount} templates across ${Object.keys(catalog).length} categories\n`);

    // 2. Insert templates
    console.log('💾 Inserting templates into database...');
    let insertedCount = 0;

    for (const template of allTemplates) {
      await pool.query(
        `INSERT INTO templates (code, title, category, jurisdictions, languages, description, render_engine, price_cents, is_active, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (code) DO UPDATE
         SET title = EXCLUDED.title,
             category = EXCLUDED.category,
             jurisdictions = EXCLUDED.jurisdictions,
             languages = EXCLUDED.languages,
             description = EXCLUDED.description,
             render_engine = EXCLUDED.render_engine,
             price_cents = EXCLUDED.price_cents,
             updated_at = CURRENT_TIMESTAMP`,
        [
          template.code,
          template.title,
          template.category,
          template.jurisdictions,
          template.languages,
          template.description,
          template.render_engine,
          template.price_cents,
          true,
          {
            priority: template.priority,
          },
        ]
      );
      insertedCount++;
    }

    console.log(`   ✅ Inserted/updated ${insertedCount} templates\n`);

    // 3. Insert form schemas
    console.log('📝 Inserting form schemas...');
    let formCount = 0;

    if (fs.existsSync(FORMS_DIR)) {
      const formFiles = fs.readdirSync(FORMS_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'));

      for (const formFile of formFiles) {
        const templateCode = formFile.replace('.json', '');
        const formPath = path.join(FORMS_DIR, formFile);

        try {
          const formContent = fs.readFileSync(formPath, 'utf8');
          const formSchema: FormSchema = JSON.parse(formContent);

          await pool.query(
            `INSERT INTO form_schemas (template_code, schema, ui_schema, defaults, version, is_active)
             VALUES ($1, $2, $3, $4, 1, true)
             ON CONFLICT (template_code, version) DO UPDATE
             SET schema = EXCLUDED.schema,
                 ui_schema = EXCLUDED.ui_schema,
                 defaults = EXCLUDED.defaults,
                 updated_at = CURRENT_TIMESTAMP`,
            [
              templateCode,
              JSON.stringify(formSchema.schema),
              JSON.stringify(formSchema.uiSchema || {}),
              JSON.stringify(formSchema.defaults || {}),
            ]
          );
          formCount++;
        } catch (error) {
          console.warn(`   ⚠️  Failed to load form for ${templateCode}: ${error.message}`);
        }
      }
    }

    console.log(`   ✅ Inserted/updated ${formCount} form schemas\n`);

    // 4. Insert overlays
    console.log('🌍 Inserting jurisdiction overlays...');
    let overlayCount = 0;

    if (fs.existsSync(OVERLAYS_DIR)) {
      const jurisdictions = fs.readdirSync(OVERLAYS_DIR).filter(f =>
        fs.statSync(path.join(OVERLAYS_DIR, f)).isDirectory()
      );

      for (const jurisdiction of jurisdictions) {
        const jurisdictionDir = path.join(OVERLAYS_DIR, jurisdiction);
        const overlayFiles = fs.readdirSync(jurisdictionDir).filter(f => f.endsWith('.json'));

        for (const overlayFile of overlayFiles) {
          const overlayPath = path.join(jurisdictionDir, overlayFile);

          try {
            const overlayContent = fs.readFileSync(overlayPath, 'utf8');
            const overlayData: Overlay = JSON.parse(overlayContent);

            await pool.query(
              `INSERT INTO template_overlays (template_code, jurisdiction, language, overlay, version, is_active)
               VALUES ($1, $2, $3, $4, 1, true)
               ON CONFLICT (template_code, jurisdiction, language, version) DO UPDATE
               SET overlay = EXCLUDED.overlay,
                   updated_at = CURRENT_TIMESTAMP`,
              [
                overlayData.templateCode,
                overlayData.jurisdiction,
                overlayData.language,
                JSON.stringify(overlayData.overlay),
              ]
            );
            overlayCount++;
          } catch (error) {
            console.warn(`   ⚠️  Failed to load overlay ${jurisdiction}/${overlayFile}: ${error.message}`);
          }
        }
      }
    }

    console.log(`   ✅ Inserted/updated ${overlayCount} jurisdiction overlays\n`);

    // 5. Summary
    console.log('📊 Seeding Summary:');
    console.log(`   - Templates: ${insertedCount}`);
    console.log(`   - Form schemas: ${formCount}`);
    console.log(`   - Jurisdiction overlays: ${overlayCount}`);
    console.log('\n✨ Template seeding complete!\n');

    // 6. Verification query
    const stats = await pool.query(`
      SELECT
        category,
        COUNT(*) as count,
        ARRAY_AGG(DISTINCT unnest(jurisdictions)) as jurisdictions
      FROM templates
      WHERE is_active = true
      GROUP BY category
      ORDER BY count DESC
    `);

    console.log('📈 Template breakdown by category:');
    for (const row of stats.rows) {
      console.log(`   ${row.category}: ${row.count} templates (${row.jurisdictions.join(', ')})`);
    }

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeder
seedTemplates();
