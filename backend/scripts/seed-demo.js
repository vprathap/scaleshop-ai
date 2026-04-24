/**
 * seed-demo.js
 * Seeds shops, shop_metrics, ipo_checklist, and ai_recommendations
 * for all existing owner accounts in the database.
 *
 * Usage (from backend/ folder):
 *   DATABASE_URL="postgres://..." node scripts/seed-demo.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') || process.env.DATABASE_URL?.includes('postgres.render')
    ? { rejectUnauthorized: false }
    : false,
});

const q = (text, params) => pool.query(text, params);

// ── Demo shop definitions (one per owner) ──────────────────────────────────
const SHOP_TEMPLATES = [
  {
    name: 'Ravi Kirana Store',
    owner_name: 'Ravi Kumar',
    city: 'Hyderabad', state: 'Telangana',
    shop_type: 'kirana',
    tier: 'growth',
    status: 'active',
    monthly_fee_inr: 25000,
    gstin: '36AABCU9603R1ZP',
  },
  {
    name: 'MediFirst Pharmacy',
    owner_name: 'Priya Menon',
    city: 'Chennai', state: 'Tamil Nadu',
    shop_type: 'pharmacy',
    tier: 'ipo_ready',
    status: 'active',
    monthly_fee_inr: 50000,
    gstin: '33AABCU9603R1ZM',
  },
];

// ── 12 months of metrics for a shop ───────────────────────────────────────
function buildMetrics(shopId, baseRevenue, baseExpenses) {
  const rows = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth() + 1;
    const year  = d.getFullYear();
    const growth = 1 + (11 - i) * 0.012;                         // +1.2% each month
    const rev    = Math.round(baseRevenue  * growth * (0.93 + Math.random() * 0.14));
    const exp    = Math.round(baseExpenses * growth * (0.95 + Math.random() * 0.10));
    const cust   = Math.round(800  + (11 - i) * 40  + Math.random() * 60);
    const orders = Math.round(1200 + (11 - i) * 55  + Math.random() * 80);
    const inv    = Math.round(rev  * 0.35);
    const savings= Math.round(rev  * 0.04);
    rows.push({ shopId, month, year, rev, exp, cust, orders, inv, savings });
  }
  return rows;
}

// ── IPO checklist items ────────────────────────────────────────────────────
function ipoItems(shopId) {
  return [
    // Financial
    { shopId, category: 'financial',   item: 'Audited financials (3 years)',              status: 'completed', notes: 'CA Ramesh & Co, FY22-24',      due_date: null },
    { shopId, category: 'financial',   item: 'GST compliance — all returns filed',        status: 'completed', notes: 'Auto-filed via ScaleShop AI',   due_date: null },
    { shopId, category: 'financial',   item: 'Bank statements reconciled',                status: 'completed', notes: null,                           due_date: null },
    { shopId, category: 'financial',   item: 'Revenue recognition policy documented',    status: 'in_progress', notes: 'Draft with CFO',              due_date: '2025-08-31' },
    { shopId, category: 'financial',   item: 'EBITDA normalisation worksheet',            status: 'pending',  notes: null,                           due_date: '2025-09-15' },
    // Legal
    { shopId, category: 'legal',       item: 'Business incorporation certificate',        status: 'completed', notes: null,                           due_date: null },
    { shopId, category: 'legal',       item: 'FSSAI / trade licences in place',          status: 'completed', notes: null,                           due_date: null },
    { shopId, category: 'legal',       item: 'IP trademarks filed',                      status: 'in_progress', notes: 'Application #3392841',       due_date: '2025-07-31' },
    { shopId, category: 'legal',       item: 'Vendor contract review',                   status: 'pending',  notes: null,                           due_date: '2025-08-15' },
    // Compliance
    { shopId, category: 'compliance',  item: 'Secretarial audit complete',               status: 'pending',  notes: null,                           due_date: '2025-10-01' },
    { shopId, category: 'compliance',  item: 'SEBI LODR compliance matrix',              status: 'pending',  notes: null,                           due_date: '2025-11-01' },
    { shopId, category: 'compliance',  item: 'Related-party transactions disclosed',     status: 'in_progress', notes: null,                        due_date: '2025-08-01' },
    // Operations
    { shopId, category: 'operations',  item: 'ERP / POS system integrated',              status: 'completed', notes: 'ScaleShop AI connected',       due_date: null },
    { shopId, category: 'operations',  item: 'Inventory turnover ≥ 8x',                  status: 'completed', notes: 'Current: 9.2x',                due_date: null },
    { shopId, category: 'operations',  item: 'Unit economics documented',                status: 'in_progress', notes: 'Draft in progress',          due_date: '2025-07-15' },
    { shopId, category: 'operations',  item: 'Expansion roadmap (5-year plan)',          status: 'pending',  notes: null,                           due_date: '2025-09-30' },
    // Governance
    { shopId, category: 'governance',  item: 'Board of directors constituted',           status: 'completed', notes: '3 directors, 1 independent',   due_date: null },
    { shopId, category: 'governance',  item: 'Independent audit committee formed',       status: 'in_progress', notes: 'Seeking 2nd ind. director',  due_date: '2025-08-31' },
    { shopId, category: 'governance',  item: 'Whistleblower policy published',           status: 'pending',  notes: null,                           due_date: '2025-09-01' },
    { shopId, category: 'governance',  item: 'Board minutes — last 3 years',             status: 'completed', notes: null,                           due_date: null },
  ];
}

// ── AI recommendations ─────────────────────────────────────────────────────
function aiRecs(shopId) {
  return [
    { shopId, type: 'revenue',    title: 'Run a Sunday Flash Sale',                  description: 'Your Sunday foot traffic is 38% higher than weekday average. A 2-hour flash sale on FMCG staples could add ₹45K this month.',                               impact_inr: 45000,  priority: 'high'   },
    { shopId, type: 'cost',       title: 'Renegotiate flour & oil supplier contracts', description: 'Commodity prices have dropped 8% this quarter but your invoice rates are unchanged. Schedule a renegotiation to save ~₹18K/month.',                         impact_inr: 18000,  priority: 'high'   },
    { shopId, type: 'inventory',  title: 'Reduce overstock in biscuits category',    description: '22 SKUs have >60 days of stock. Clearing slow movers via discounts will free up ₹1.2L in working capital and reduce waste.',                                   impact_inr: 120000, priority: 'medium' },
    { shopId, type: 'customer',   title: 'Launch a loyalty punch-card program',      description: 'Top 200 customers account for 61% of revenue. A simple loyalty card (buy 10 get 1 free) can increase repeat visits by ~18% based on similar shop data.',      impact_inr: 30000,  priority: 'medium' },
    { shopId, type: 'compliance', title: 'File pending GST reconciliation (GSTR-2A)', description: 'You have ₹23,400 in eligible ITC that has not been claimed. Filing GSTR-2A reconciliation this week will reduce your tax liability directly.',               impact_inr: 23400,  priority: 'high'   },
    { shopId, type: 'ipo',        title: 'Prepare unit-economics one-pager',         description: 'Investors will ask for revenue per sq ft, gross margin, and CAC. ScaleShop AI can auto-generate this report — takes 10 minutes to review and publish.',       impact_inr: null,   priority: 'medium' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 ScaleShop AI — Demo Data Seeder\n');

  try {
    // 1. Get all owner-role users
    const { rows: owners } = await q(
      `SELECT id, email, full_name FROM users WHERE role = 'owner' ORDER BY created_at`
    );
    console.log(`Found ${owners.length} owner account(s): ${owners.map(o => o.email).join(', ')}\n`);

    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      const tmpl  = SHOP_TEMPLATES[i % SHOP_TEMPLATES.length];

      console.log(`── Seeding shop for ${owner.email}…`);

      // 2. Upsert shop (idempotent by user_id + name)
      const { rows: [shop] } = await q(
        `INSERT INTO shops
           (user_id, name, owner_name, city, state, shop_type, tier, status,
            onboarding_date, monthly_fee_inr, gstin)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,CURRENT_DATE - INTERVAL '11 months',$9,$10)
         ON CONFLICT DO NOTHING
         RETURNING id, name`,
        [owner.id, tmpl.name, tmpl.owner_name, tmpl.city, tmpl.state,
         tmpl.shop_type, tmpl.tier, tmpl.status, tmpl.monthly_fee_inr, tmpl.gstin]
      );

      // If conflict (shop already exists), fetch it
      let shopId, shopName;
      if (shop) {
        shopId = shop.id; shopName = shop.name;
        console.log(`  ✅ Shop created: ${shopName} (${shopId})`);
      } else {
        const { rows: [existing] } = await q(
          `SELECT id, name FROM shops WHERE user_id = $1 LIMIT 1`, [owner.id]
        );
        shopId = existing.id; shopName = existing.name;
        console.log(`  ℹ️  Shop already exists: ${shopName} (${shopId})`);
      }

      // 3. Upsert 12 months of metrics
      const baseRev = tmpl.tier === 'ipo_ready' ? 1200000 : 700000;
      const baseExp = tmpl.tier === 'ipo_ready' ?  850000 : 520000;
      const mRows = buildMetrics(shopId, baseRev, baseExp);
      let metricCount = 0;
      for (const m of mRows) {
        await q(
          `INSERT INTO shop_metrics
             (shop_id, month, year, revenue_inr, expenses_inr,
              customers_count, orders_count, inventory_value, ai_savings_inr)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
           ON CONFLICT (shop_id, month, year) DO UPDATE SET
             revenue_inr     = EXCLUDED.revenue_inr,
             expenses_inr    = EXCLUDED.expenses_inr,
             customers_count = EXCLUDED.customers_count,
             orders_count    = EXCLUDED.orders_count,
             inventory_value = EXCLUDED.inventory_value,
             ai_savings_inr  = EXCLUDED.ai_savings_inr`,
          [m.shopId, m.month, m.year, m.rev, m.exp, m.cust, m.orders, m.inv, m.savings]
        );
        metricCount++;
      }
      console.log(`  ✅ ${metricCount} months of metrics upserted`);

      // 4. Upsert IPO checklist (delete + re-insert to stay idempotent)
      await q(`DELETE FROM ipo_checklist WHERE shop_id = $1`, [shopId]);
      const items = ipoItems(shopId);
      for (const it of items) {
        await q(
          `INSERT INTO ipo_checklist (shop_id, category, item, status, notes, due_date)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [it.shopId, it.category, it.item, it.status, it.notes, it.due_date]
        );
      }
      console.log(`  ✅ ${items.length} IPO checklist items inserted`);

      // 5. Upsert AI recommendations (delete + re-insert)
      await q(`DELETE FROM ai_recommendations WHERE shop_id = $1`, [shopId]);
      const recs = aiRecs(shopId);
      for (const r of recs) {
        await q(
          `INSERT INTO ai_recommendations (shop_id, type, title, description, impact_inr, priority)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [r.shopId, r.type, r.title, r.description, r.impact_inr, r.priority]
        );
      }
      console.log(`  ✅ ${recs.length} AI recommendations inserted\n`);
    }

    // ── Summary ──────────────────────────────────────────────────────────────
    const [{ rows: [shopCount] }, { rows: [metricCount] }, { rows: [ipoCount] }, { rows: [recCount] }] =
      await Promise.all([
        q('SELECT COUNT(*)::int AS n FROM shops'),
        q('SELECT COUNT(*)::int AS n FROM shop_metrics'),
        q('SELECT COUNT(*)::int AS n FROM ipo_checklist'),
        q('SELECT COUNT(*)::int AS n FROM ai_recommendations'),
      ]);

    console.log('🎉 Seeding complete!\n');
    console.log('Database summary:');
    console.log(`  Shops             : ${shopCount.n}`);
    console.log(`  Metric records    : ${metricCount.n}`);
    console.log(`  IPO checklist rows: ${ipoCount.n}`);
    console.log(`  AI recommendations: ${recCount.n}`);

  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
