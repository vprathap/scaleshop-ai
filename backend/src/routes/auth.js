const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db      = require('../config/db');
const { auth } = require('../middleware/auth');

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),
  body('full_name').trim().notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password, full_name, phone } = req.body;
  try {
    const exists = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users(email,password_hash,full_name,phone) VALUES($1,$2,$3,$4) RETURNING id,email,full_name,role',
      [email, password_hash, full_name, phone || null]
    );
    const user = rows[0];
    res.status(201).json({ token: signToken(user.id), user });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const { rows } = await db.query(
      'SELECT id,email,full_name,role,password_hash FROM users WHERE email=$1', [email]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const { password_hash, ...safeUser } = user;
    res.json({ token: signToken(user.id), user: safeUser });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => res.json({ user: req.user }));

module.exports = router;
