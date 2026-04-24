const router = require('express').Router({ mergeParams: true });
const db     = require('../config/db');
const { auth } = require('../middleware/auth');

// GET /api/shops/:id/ipo
router.get('/', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM ipo_checklist WHERE shop_id=$1 ORDER BY category, item`,
      [req.params.id]
    );
    // Group by category
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.category]) acc[row.category] = [];
      acc[row.category].push(row);
      return acc;
    }, {});
    const total    = rows.length;
    const done     = rows.filter(r => r.status === 'completed').length;
    const score    = total ? Math.round((done / total) * 100) : 0;
    res.json({ checklist: grouped, score, total, completed: done });
  } catch (err) { next(err); }
});

// PUT /api/shops/:id/ipo/:item_id
router.put('/:item_id', auth, async (req, res, next) => {
  const { status, notes } = req.body;
  if (!['pending','in_progress','completed','na'].includes(status))
    return res.status(422).json({ error: 'Invalid status' });
  try {
    const { rows } = await db.query(
      `UPDATE ipo_checklist SET status=$1, notes=$2 WHERE id=$3 AND shop_id=$4 RETURNING *`,
      [status, notes||null, req.params.item_id, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json({ item: rows[0] });
  } catch (err) { next(err); }
});

// POST /api/shops/:id/ipo  — add custom checklist item
router.post('/', auth, async (req, res, next) => {
  const { category, item, due_date } = req.body;
  if (!category || !item) return res.status(422).json({ error: 'category and item required' });
  try {
    const { rows } = await db.query(
      `INSERT INTO ipo_checklist(shop_id,category,item,due_date) VALUES($1,$2,$3,$4) RETURNING *`,
      [req.params.id, category, item, due_date||null]
    );
    res.status(201).json({ item: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;
