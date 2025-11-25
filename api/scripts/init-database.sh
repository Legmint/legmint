#!/bin/bash
# Database initialization script for Render
# This runs migrations and seeds the database

set -e

echo "🚀 Starting database initialization..."

echo "📊 Running migrations..."
for f in migrations/*.sql; do
  echo "  Running $f..."
  node -e "
    const { Pool } = require('pg');
    const fs = require('fs');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const sql = fs.readFileSync('$f', 'utf8');
    pool.query(sql)
      .then(() => {
        console.log('  ✅ $f completed');
        pool.end();
      })
      .catch(err => {
        console.error('  ❌ $f failed:', err.message);
        pool.end();
        process.exit(1);
      });
  "
done

echo ""
echo "🌱 Seeding templates..."
npm run seed:templates

echo ""
echo "✨ Database initialization complete!"
