#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs all SQL migration files in the migrations/ directory
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files\n`);

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    console.log(`📄 Running ${file}...`);

    try {
      const sql = fs.readFileSync(filePath, 'utf8');
      await pool.query(sql);
      console.log(`   ✅ ${file} completed\n`);
    } catch (error) {
      console.error(`   ❌ ${file} failed:`, error.message);

      // Check if it's just a "table already exists" error
      if (error.code === '42P07' || error.message.includes('already exists')) {
        console.log(`   ℹ️  Skipping (already applied)\n`);
        continue;
      }

      await pool.end();
      process.exit(1);
    }
  }

  console.log('✨ All migrations completed successfully!\n');
  await pool.end();
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  pool.end();
  process.exit(1);
});
