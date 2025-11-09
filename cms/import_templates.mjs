#!/usr/bin/env node

/**
 * LegalMind Template Import Script
 *
 * Imports templates, overlays, and questionnaires from the packs/ directory
 * into the CMS content structure.
 *
 * Usage: node cms/import_templates.mjs [--pack=fundraising|saas] [--dry-run]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const PACKS_DIR = path.join(ROOT_DIR, 'packs');
const CMS_CONTENT_DIR = path.join(ROOT_DIR, 'cms', 'content');

// Ensure CMS content directories exist
const CONTENT_DIRS = ['templates', 'overlays', 'questionnaires'];

class TemplateImporter {
  constructor(options = {}) {
    this.dryRun = options.dryRun || false;
    this.packFilter = options.pack || null;
    this.stats = {
      templates: 0,
      overlays: 0,
      questionnaires: 0,
      errors: []
    };
  }

  async init() {
    console.log('🚀 LegalMind Template Importer\n');

    if (this.dryRun) {
      console.log('⚠️  DRY RUN MODE - No files will be written\n');
    }

    // Ensure content directories exist
    for (const dir of CONTENT_DIRS) {
      const fullPath = path.join(CMS_CONTENT_DIR, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
      } catch (err) {
        console.error(`❌ Failed to create directory ${fullPath}:`, err.message);
        process.exit(1);
      }
    }
  }

  async importAll() {
    const packs = this.packFilter
      ? [this.packFilter]
      : ['fundraising', 'saas'];

    for (const pack of packs) {
      console.log(`\n📦 Processing pack: ${pack}`);
      await this.importPack(pack);
    }

    this.printSummary();
  }

  async importPack(packName) {
    const packDir = path.join(PACKS_DIR, packName);

    try {
      await fs.access(packDir);
    } catch {
      console.error(`  ❌ Pack directory not found: ${packDir}`);
      return;
    }

    // Import templates
    console.log(`  🔍 Scanning templates...`);
    await this.importTemplates(packName);

    // Import overlays
    console.log(`  🌍 Scanning overlays...`);
    await this.importOverlays(packName);

    // Import questionnaires
    console.log(`  📋 Scanning questionnaires...`);
    await this.importQuestionnaires(packName);
  }

  async importTemplates(packName) {
    const templatesDir = path.join(PACKS_DIR, packName, 'templates');

    try {
      const files = await fs.readdir(templatesDir);
      const baseTemplates = files.filter(f => f.endsWith('.base.json'));

      for (const file of baseTemplates) {
        const templatePath = path.join(templatesDir, file);
        await this.processTemplate(templatePath, packName);
      }
    } catch (err) {
      console.error(`    ⚠️  Failed to read templates directory: ${err.message}`);
    }
  }

  async processTemplate(templatePath, packName) {
    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      const template = JSON.parse(content);

      // Validate required fields
      if (!template.template_code || !template.name) {
        throw new Error('Missing required fields: template_code or name');
      }

      // Convert to CMS format
      const cmsTemplate = {
        id: this.templateCodeToId(template.template_code),
        pack: packName,
        title: template.name,
        description: template.description || '',
        access_level: template.access_level || 'starter',
        pricing_tier: [template.access_level || 'starter'],
        jurisdictions: template.supported_jurisdictions || ['UK', 'US-DE', 'DE', 'FR', 'CZ'],
        complexity_score: 5,
        estimated_time_minutes: 15,
        is_active: template.status === 'active' || template.status === undefined,
        content_markdown: this.convertClausesToMarkdown(template.clauses),
        variable_schema: JSON.stringify(template.variables_schema, null, 2),
        clause_rules: template.clause_rules ? JSON.stringify(template.clause_rules, null, 2) : null,
        sort_order: 0,
        last_reviewed_at: template.metadata?.created || new Date().toISOString(),
        reviewed_by: template.metadata?.author || 'LegalMind',
        // Metadata
        _version: template.version,
        _template_code: template.template_code,
        _phrases: template.phrases
      };

      const outputPath = path.join(
        CMS_CONTENT_DIR,
        'templates',
        `${cmsTemplate.pack}-${cmsTemplate.id}.json`
      );

      if (!this.dryRun) {
        await fs.writeFile(outputPath, JSON.stringify(cmsTemplate, null, 2));
        console.log(`    ✅ Imported template: ${template.name} (${template.template_code})`);
      } else {
        console.log(`    [DRY RUN] Would import: ${template.name} (${template.template_code})`);
      }

      this.stats.templates++;
    } catch (err) {
      console.error(`    ❌ Error processing ${path.basename(templatePath)}: ${err.message}`);
      this.stats.errors.push({ file: templatePath, error: err.message });
    }
  }

  async importOverlays(packName) {
    const overlaysDir = path.join(PACKS_DIR, packName, 'overlays');

    try {
      const files = await fs.readdir(overlaysDir);
      const overlayFiles = files.filter(f => f.endsWith('.overlay.json'));

      for (const file of overlayFiles) {
        const overlayPath = path.join(overlaysDir, file);
        await this.processOverlay(overlayPath, packName);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`    ⚠️  Failed to read overlays directory: ${err.message}`);
      }
    }
  }

  async processOverlay(overlayPath, packName) {
    try {
      const content = await fs.readFile(overlayPath, 'utf-8');
      const overlay = JSON.parse(content);

      if (!overlay.template_code || !overlay.jurisdiction) {
        throw new Error('Missing required fields: template_code or jurisdiction');
      }

      const cmsOverlay = {
        template_id: this.templateCodeToId(overlay.template_code),
        jurisdiction_code: overlay.jurisdiction,
        overlay_rules: JSON.stringify(overlay.overrides, null, 2),
        legal_notes: overlay.metadata?.compliance_notes || '',
        last_updated_by: overlay.metadata?.reviewed_by || 'LegalMind',
        last_updated_at: overlay.metadata?.effective_date || new Date().toISOString(),
        // Metadata
        _version: overlay.version,
        _statutory_references: overlay.metadata?.statutory_references || []
      };

      const outputPath = path.join(
        CMS_CONTENT_DIR,
        'overlays',
        `${cmsOverlay.template_id}-${cmsOverlay.jurisdiction_code}.json`
      );

      if (!this.dryRun) {
        await fs.writeFile(outputPath, JSON.stringify(cmsOverlay, null, 2));
        console.log(`    ✅ Imported overlay: ${overlay.template_code} / ${overlay.jurisdiction}`);
      } else {
        console.log(`    [DRY RUN] Would import overlay: ${overlay.template_code} / ${overlay.jurisdiction}`);
      }

      this.stats.overlays++;
    } catch (err) {
      console.error(`    ❌ Error processing ${path.basename(overlayPath)}: ${err.message}`);
      this.stats.errors.push({ file: overlayPath, error: err.message });
    }
  }

  async importQuestionnaires(packName) {
    const questionnairesDir = path.join(PACKS_DIR, packName, 'questionnaires');

    try {
      const files = await fs.readdir(questionnairesDir);
      const questionnaireFiles = files.filter(f => f.endsWith('.questionnaire.json'));

      for (const file of questionnaireFiles) {
        const questionnairePath = path.join(questionnairesDir, file);
        await this.processQuestionnaire(questionnairePath, packName);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`    ⚠️  Failed to read questionnaires directory: ${err.message}`);
      }
    }
  }

  async processQuestionnaire(questionnairePath, packName) {
    try {
      const content = await fs.readFile(questionnairePath, 'utf-8');
      const questionnaire = JSON.parse(content);

      // Extract template code from filename or schema
      const filename = path.basename(questionnairePath, '.questionnaire.json');
      const templateCode = filename;

      // Convert JSON Schema to CMS question format
      const questions = this.convertSchemaToQuestions(questionnaire);

      const cmsQuestionnaire = {
        template_id: this.templateCodeToId(templateCode),
        questions: questions
      };

      const outputPath = path.join(
        CMS_CONTENT_DIR,
        'questionnaires',
        `${cmsQuestionnaire.template_id}-questionnaire.json`
      );

      if (!this.dryRun) {
        await fs.writeFile(outputPath, JSON.stringify(cmsQuestionnaire, null, 2));
        console.log(`    ✅ Imported questionnaire: ${templateCode}`);
      } else {
        console.log(`    [DRY RUN] Would import questionnaire: ${templateCode}`);
      }

      this.stats.questionnaires++;
    } catch (err) {
      console.error(`    ❌ Error processing ${path.basename(questionnairePath)}: ${err.message}`);
      this.stats.errors.push({ file: questionnairePath, error: err.message });
    }
  }

  // Helper: Convert template_code to CMS-friendly ID
  templateCodeToId(templateCode) {
    return templateCode.toLowerCase().replace(/_/g, '-');
  }

  // Helper: Convert clauses array to markdown
  convertClausesToMarkdown(clauses) {
    if (!clauses || !Array.isArray(clauses)) return '';

    return clauses
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(clause => {
        let md = '';
        if (clause.title) {
          md += `## ${clause.title}\n\n`;
        }
        if (clause.subtitle) {
          md += `### ${clause.subtitle}\n\n`;
        }
        if (clause.body_md) {
          md += clause.body_md;
        }

        // Add conditional logic comment if present
        if (clause.condition) {
          md = `{{#if ${JSON.stringify(clause.condition)}}}\n${md}\n{{/if}}`;
        }

        return md;
      })
      .join('\n\n---\n\n');
  }

  // Helper: Convert JSON Schema to CMS questions format
  convertSchemaToQuestions(schema) {
    const questions = [];
    const properties = schema.properties || {};
    const required = schema.required || [];
    let order = 0;

    for (const [key, prop] of Object.entries(properties)) {
      const question = {
        id: key,
        type: this.mapJsonSchemaType(prop),
        label: prop.title || this.humanize(key),
        help_text: prop.description || '',
        required: required.includes(key),
        validation: this.extractValidation(prop),
        conditional_logic: null,
        options: prop.enum || prop.examples?.[0] || null,
        default_value: prop.default !== undefined ? String(prop.default) : null,
        group_code: null,
        display_order: order++
      };

      questions.push(question);
    }

    return questions;
  }

  mapJsonSchemaType(prop) {
    if (prop.enum) return 'select';
    if (prop.type === 'array') return 'array';
    if (prop.type === 'boolean') return 'boolean';
    if (prop.type === 'number' || prop.type === 'integer') return 'number';
    if (prop.format === 'date') return 'date';
    return 'text';
  }

  extractValidation(prop) {
    const validation = {};
    if (prop.minimum !== undefined) validation.min = prop.minimum;
    if (prop.maximum !== undefined) validation.max = prop.maximum;
    if (prop.minLength !== undefined) validation.minLength = prop.minLength;
    if (prop.maxLength !== undefined) validation.maxLength = prop.maxLength;
    if (prop.pattern) validation.pattern = prop.pattern;

    return Object.keys(validation).length > 0 ? validation : null;
  }

  humanize(str) {
    return str
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, s => s.toUpperCase());
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 Import Summary');
    console.log('='.repeat(50));
    console.log(`✅ Templates imported:      ${this.stats.templates}`);
    console.log(`✅ Overlays imported:       ${this.stats.overlays}`);
    console.log(`✅ Questionnaires imported: ${this.stats.questionnaires}`);

    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errors: ${this.stats.errors.length}`);
      this.stats.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${path.basename(err.file)}: ${err.error}`);
      });
    } else {
      console.log(`\n🎉 All files imported successfully!`);
    }
    console.log('='.repeat(50) + '\n');
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    pack: args.find(arg => arg.startsWith('--pack='))?.split('=')[1]
  };

  const importer = new TemplateImporter(options);
  await importer.init();
  await importer.importAll();

  // Exit with error code if there were errors
  if (importer.stats.errors.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
