require('dotenv').config();
const { Pool } = require('pg');
const fs   = require('fs');
const path = require('path');

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Try multiple possible paths for schema.sql (local vs Render rootDir)
  const candidates = [
    path.join(__dirname, '../../database/schema.sql'),  // local: backend/scripts/ -> root
    path.join(__dirname, '../database/schema.sql'),     // if rootDir is repo root
    path.join(process.cwd(), 'database/schema.sql'),    // cwd-relative
    path.join(process.cwd(), '../database/schema.sql'), // one level up from cwd
  ];

  let sql = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) { sql = fs.readFileSync(p, 'utf8'); console.log('Using schema:', p); break; }
  }

  if (!sql) {
    // Inline minimal schema as fallback so the server still starts
    console.warn('⚠️  schema.sql not found — running inline schema');
    sql = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'owner' CHECK (role IN ('admin','owner')),
        phone VARCHAR(20),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS shops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        city VARCHAR(100), state VARCHAR(100),
        shop_type VARCHAR(50) DEFAULT 'kirana',
        tier VARCHAR(20) DEFAULT 'basic',
        status VARCHAR(20) DEFAULT 'active',
        onboarding_date DATE NOT NULL DEFAULT CURRENT_DATE,
        monthly_fee_inr NUMERIC(10,2) DEFAULT 10000,
        gstin VARCHAR(20),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS shop_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        month SMALLINT NOT NULL, year SMALLINT NOT NULL,
        revenue_inr NUMERIC(14,2) DEFAULT 0,
        expenses_inr NUMERIC(14,2) DEFAULT 0,
        customers_count INTEGER DEFAULT 0,
        orders_count INTEGER DEFAULT 0,
        inventory_value NUMERIC(14,2) DEFAULT 0,
        ai_savings_inr NUMERIC(14,2) DEFAULT 0,
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(shop_id, month, year)
      );
      CREATE TABLE IF NOT EXISTS ipo_checklist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        item VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        notes TEXT, due_date DATE,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS ai_recommendations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        impact_inr NUMERIC(12,2),
        priority VARCHAR(10) DEFAULT 'medium',
        dismissed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
  }

  try {
    await pool.query(sql);
    console.log('✅ Database migration complete');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
