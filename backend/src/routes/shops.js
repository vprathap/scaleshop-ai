const router = require('express').Router();
const db     = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/shops  — admin sees all, owner sees own
router.get('/', auth, async (req, res, next) => {
  try {
    let rows;
    if (req.user.role === 'admin') {
      ({ rows } = await db.query(`
        SELECT s.*, u.email, u.phone,
               COUNT(DISTINCT m.id) AS metrics_months
        FROM shops s
        JOIN users u ON u.id = s.user_id
        LEFT JOIN shop_metrics m ON m.shop_id = s.id
        GROUP BY s.id, u.email, u.phone
        ORDER BY s.created_at DESC
      `));
    } else {
      ({ rows } = await db.query(`
        SELECT s.* FROM shops s
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
      `, [req.user.id]));
    }
    res.json({ shops: rows });
  } catch (err) { next(err); }
});

// POST /api/shops  — admin only
router.post('/', auth, adminOnly, async (req, res, next) => {
  const { user_id, name, owner_name, city, state, shop_type, tier, monthly_fee_inr, gstin } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO shops(user_id,name,owner_name,city,state,shop_type,tier,monthly_fee_inr,gstin)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [user_id, name, owner_name, city, state, shop_type||'kirana', tier||'basic', monthly_fee_inr||10000, gstin||null]
    );
    res.status(201).json({ shop: rows[0] });
  } catch (err) { next(err); }
});

// GET /api/shops/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM shops WHERE id=$1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Shop not found' });
    const shop = rows[0];
    if (req.user.role !== 'admin' && shop.user_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });
    res.json({ shop });
  } catch (err) { next(err); }
});

// GET /api/shops/:id/metrics
router.get('/:id/metrics', auth, async (req, res, next) => {
  try {
    const shop = (await db.query('SELECT * FROM shops WHERE id=$1', [req.params.id])).rows[0];
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    if (req.user.role !== 'admin' && shop.user_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    const { rows } = await db.query(
      `SELECT * FROM shop_metrics WHERE shop_id=$1 ORDER BY year DESC, month DESC LIMIT 12`,
      [req.params.id]
    );
    // Latest month summary
    const latest = rows[0] || {};
    const prev   = rows[1] || {};
    const mrr_growth = prev.revenue_inr
      ? ((latest.revenue_inr - prev.revenue_inr) / prev.revenue_inr * 100).toFixed(1)
      : null;

    res.json({ metrics: rows, summary: { ...latest, mrr_growth } });
  } catch (err) { next(err); }
});

// GET /api/shops/:id/recommendations
router.get('/:id/recommendations', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM ai_recommendations
       WHERE shop_id=$1 AND dismissed=false
       ORDER BY priority='high' DESC, created_at DESC`,
      [req.params.id]
    );
    res.json({ recommendations: rows });
  } catch (err) { next(err); }
});

// PUT /api/shops/:id/recommendations/:rec_id/dismiss
router.put('/:id/recommendations/:rec_id/dismiss', auth, async (req, res, next) => {
  try {
    await db.query(
      'UPDATE ai_recommendations SET dismissed=true WHERE id=$1 AND shop_id=$2',
      [req.params.rec_id, req.params.id]
    );
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
