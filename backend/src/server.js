require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many requests' }
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/shops',        require('./routes/shops'));
app.use('/api/shops/:id/ipo', require('./routes/ipo'));
app.use('/api/admin',        require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, ts: new Date() })
);

// 404
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }));

// Global error handler
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ ScaleShop API running on port ${PORT} [${process.env.NODE_ENV}]`);
});
