const router = require('express').Router();
const db     = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/admin/overview
router.get('/overview', auth, adminOnly, async (req, res, next) => {
  try {
    const [shops, mrr, users, recs] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total,
                SUM(CASE WHEN status='active' THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN tier='ipo_ready' THEN 1 ELSE 0 END) AS ipo_ready
                FROM shops`),
      db.query(`SELECT SUM(monthly_fee_inr) AS total_mrr FROM shops WHERE status='active'`),
      db.query(`SELECT COUNT(*) AS total FROM users`),
      db.query(`SELECT COUNT(*) AS total FROM ai_recommendations WHERE dismissed=false`),
    ]);

    res.json({
      shops:    shops.rows[0],
      mrr:      mrr.rows[0],
      users:    users.rows[0],
      pending_recommendations: recs.rows[0].total,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/shops  — paginated shop list with latest metrics
router.get('/shops', auth, adminOnly, async (req, res, next) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const { rows } = await db.query(`
      SELECT
        s.*,
        u.email,
        u.full_name AS user_name,
        m.revenue_inr AS latest_revenue,
        m.customers_count AS latest_customers,
        m.ai_savings_inr AS latest_ai_savings
      FROM shops s
      JOIN users u ON u.id = s.user_id
      LEFT JOIN LATERAL (
        SELECT * FROM shop_metrics
        WHERE shop_id = s.id
        ORDER BY year DESC, month DESC LIMIT 1
      ) m ON true
      ORDER BY s.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const total = (await db.query('SELECT COUNT(*) FROM shops')).rows[0].count;
    res.json({ shops: rows, pagination: { page, limit, total: parseInt(total) } });
  } catch (err) { next(err); }
});

// GET /api/admin/mrr-trend  — last 6 months platform MRR
router.get('/mrr-trend', auth, adminOnly, async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT year, month,
             SUM(revenue_inr) AS total_revenue,
             COUNT(DISTINCT shop_id) AS active_shops,
             SUM(ai_savings_inr) AS total_ai_savings
      FROM shop_metrics
      GROUP BY year, month
      ORDER BY year DESC, month DESC
      LIMIT 6
    `);
    res.json({ trend: rows.reverse() });
  } catch (err) { next(err); }
});

module.exports = router;
