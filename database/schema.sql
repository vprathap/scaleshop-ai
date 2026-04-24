-- ScaleShop AI — PostgreSQL Schema
-- Run: psql -d scaleshop -f schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'owner' CHECK (role IN ('admin','owner')),
    phone         VARCHAR(20),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SHOPS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shops (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    owner_name      VARCHAR(255) NOT NULL,
    city            VARCHAR(100),
    state           VARCHAR(100),
    shop_type       VARCHAR(50) DEFAULT 'kirana' CHECK (shop_type IN ('kirana','pharmacy','electronics','apparel','food','other')),
    tier            VARCHAR(20) DEFAULT 'basic' CHECK (tier IN ('basic','growth','ipo_ready')),
    status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','onboarding','inactive','churned')),
    onboarding_date DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_fee_inr NUMERIC(10,2) DEFAULT 10000,
    gstin           VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SHOP MONTHLY METRICS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shop_metrics (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id          UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    month            SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
    year             SMALLINT NOT NULL,
    revenue_inr      NUMERIC(14,2) DEFAULT 0,
    expenses_inr     NUMERIC(14,2) DEFAULT 0,
    customers_count  INTEGER DEFAULT 0,
    orders_count     INTEGER DEFAULT 0,
    inventory_value  NUMERIC(14,2) DEFAULT 0,
    ai_savings_inr   NUMERIC(14,2) DEFAULT 0,
    recorded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(shop_id, month, year)
);

-- ─────────────────────────────────────────────
-- IPO CHECKLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ipo_checklist (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category    VARCHAR(50) NOT NULL CHECK (category IN ('financial','legal','compliance','operations','governance')),
    item        VARCHAR(255) NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed','na')),
    notes       TEXT,
    due_date    DATE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- AI RECOMMENDATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id      UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    type         VARCHAR(50) NOT NULL CHECK (type IN ('revenue','cost','compliance','inventory','customer','ipo')),
    title        VARCHAR(255) NOT NULL,
    description  TEXT NOT NULL,
    impact_inr   NUMERIC(12,2),
    priority     VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
    dismissed    BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_shops_user_id       ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_shop_id     ON shop_metrics(shop_id);
CREATE INDEX IF NOT EXISTS idx_metrics_year_month  ON shop_metrics(year, month);
CREATE INDEX IF NOT EXISTS idx_ipo_shop_id         ON ipo_checklist(shop_id);
CREATE INDEX IF NOT EXISTS idx_recs_shop_id        ON ai_recommendations(shop_id);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at  BEFORE UPDATE ON users  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_shops_updated_at  BEFORE UPDATE ON shops  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ipo_updated_at    BEFORE UPDATE ON ipo_checklist FOR EACH ROW EXECUTE FUNCTION update_updated_at();
