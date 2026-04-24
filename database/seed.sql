-- ScaleShop AI — Seed Data (dev/demo)
-- Passwords are bcrypt hashes of: Admin@123 / Shop@123

INSERT INTO users (id, email, password_hash, full_name, role, phone) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'admin@scaleshop.ai',
   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
   'Prathap Velavaluri', 'admin', '+91-9876543210'),
  ('00000000-0000-0000-0000-000000000002',
   'ravi@kirana.com',
   '$2b$10$TkIhGYJxZj/lXbIFrq6xGe1l.MgJF3iBq2SBhK8K9YTb1tFjJFXBC',
   'Ravi Kumar', 'owner', '+91-9811234567'),
  ('00000000-0000-0000-0000-000000000003',
   'sunita@pharmacy.com',
   '$2b$10$TkIhGYJxZj/lXbIFrq6xGe1l.MgJF3iBq2SBhK8K9YTb1tFjJFXBC',
   'Sunita Sharma', 'owner', '+91-9922345678')
ON CONFLICT DO NOTHING;

INSERT INTO shops (id, user_id, name, owner_name, city, state, shop_type, tier, monthly_fee_inr) VALUES
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   'Ravi General Stores', 'Ravi Kumar', 'Mumbai', 'Maharashtra', 'kirana', 'growth', 25000),
  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000003',
   'Sunita Medicals', 'Sunita Sharma', 'Delhi', 'Delhi', 'pharmacy', 'ipo_ready', 50000)
ON CONFLICT DO NOTHING;

-- Metrics for Ravi's shop (last 6 months)
INSERT INTO shop_metrics (shop_id, month, year, revenue_inr, expenses_inr, customers_count, orders_count, inventory_value, ai_savings_inr) VALUES
  ('10000000-0000-0000-0000-000000000001', 11, 2024, 480000, 310000, 820, 1240, 950000, 42000),
  ('10000000-0000-0000-0000-000000000001', 12, 2024, 530000, 325000, 910, 1380, 980000, 48000),
  ('10000000-0000-0000-0000-000000000001',  1, 2025, 495000, 318000, 855, 1290, 920000, 44000),
  ('10000000-0000-0000-0000-000000000001',  2, 2025, 512000, 321000, 870, 1310, 935000, 46000),
  ('10000000-0000-0000-0000-000000000001',  3, 2025, 558000, 330000, 940, 1420, 1010000, 51000),
  ('10000000-0000-0000-0000-000000000001',  4, 2025, 601000, 340000, 985, 1490, 1050000, 55000)
ON CONFLICT DO NOTHING;

-- Metrics for Sunita's shop
INSERT INTO shop_metrics (shop_id, month, year, revenue_inr, expenses_inr, customers_count, orders_count, inventory_value, ai_savings_inr) VALUES
  ('10000000-0000-0000-0000-000000000002', 11, 2024, 920000, 580000, 1200, 1850, 2100000, 88000),
  ('10000000-0000-0000-0000-000000000002', 12, 2024, 980000, 600000, 1310, 2010, 2200000, 92000),
  ('10000000-0000-0000-0000-000000000002',  1, 2025, 955000, 590000, 1260, 1940, 2150000, 90000),
  ('10000000-0000-0000-0000-000000000002',  2, 2025, 1010000, 605000, 1340, 2060, 2250000, 95000),
  ('10000000-0000-0000-0000-000000000002',  3, 2025, 1080000, 620000, 1420, 2180, 2350000, 101000),
  ('10000000-0000-0000-0000-000000000002',  4, 2025, 1150000, 635000, 1500, 2310, 2450000, 108000)
ON CONFLICT DO NOTHING;

-- IPO Checklist for Sunita's shop
INSERT INTO ipo_checklist (shop_id, category, item, status, notes) VALUES
  ('10000000-0000-0000-0000-000000000002', 'financial', '3 years audited financial statements', 'completed', 'Audited by Deloitte'),
  ('10000000-0000-0000-0000-000000000002', 'financial', 'Revenue reconciliation report', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000002', 'financial', 'Tax compliance certificates (GST, IT)', 'in_progress', 'FY24 pending'),
  ('10000000-0000-0000-0000-000000000002', 'legal', 'Company incorporation certificate', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000002', 'legal', 'Trademark registration', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000002', 'legal', 'Shareholder agreement', 'in_progress', NULL),
  ('10000000-0000-0000-0000-000000000002', 'compliance', 'SEBI LODR compliance checklist', 'pending', NULL),
  ('10000000-0000-0000-0000-000000000002', 'compliance', 'Related party transaction disclosure', 'pending', NULL),
  ('10000000-0000-0000-0000-000000000002', 'operations', 'Standard operating procedures documented', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000002', 'operations', 'Inventory management system audit', 'completed', 'ScaleShop AI verified'),
  ('10000000-0000-0000-0000-000000000002', 'governance', 'Board of directors constitution', 'in_progress', NULL),
  ('10000000-0000-0000-0000-000000000002', 'governance', 'Audit committee formation', 'pending', NULL)
ON CONFLICT DO NOTHING;

-- IPO Checklist for Ravi's shop (basic tier)
INSERT INTO ipo_checklist (shop_id, category, item, status, notes) VALUES
  ('10000000-0000-0000-0000-000000000001', 'financial', '3 years audited financial statements', 'pending', NULL),
  ('10000000-0000-0000-0000-000000000001', 'financial', 'Revenue reconciliation report', 'in_progress', NULL),
  ('10000000-0000-0000-0000-000000000001', 'legal', 'Company incorporation certificate', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000001', 'compliance', 'GST registration & filings', 'completed', NULL),
  ('10000000-0000-0000-0000-000000000001', 'operations', 'Inventory management system audit', 'in_progress', NULL)
ON CONFLICT DO NOTHING;

-- AI Recommendations
INSERT INTO ai_recommendations (shop_id, type, title, description, impact_inr, priority) VALUES
  ('10000000-0000-0000-0000-000000000001', 'revenue', 'Launch evening loyalty hour',
   'Customers between 6–8 PM buy 23% more. A 5% loyalty cashback for this window could boost monthly revenue by ₹28,000.', 28000, 'high'),
  ('10000000-0000-0000-0000-000000000001', 'inventory', 'Reduce dal overstock',
   'You are carrying 40 days of toor dal vs. industry average 15 days. Reducing to 20 days frees ₹42,000 working capital.', 42000, 'high'),
  ('10000000-0000-0000-0000-000000000001', 'cost', 'Switch to LED lighting',
   'Your electricity bill is 18% above peer median. LED switch estimated to save ₹3,200/month.', 3200, 'medium'),
  ('10000000-0000-0000-0000-000000000002', 'ipo', 'File SEBI LODR checklist',
   'IPO readiness score is 68%. Filing the LODR compliance checklist moves you to 78% and unlocks Tier 3 underwriter introductions.', NULL, 'high'),
  ('10000000-0000-0000-0000-000000000002', 'revenue', 'Add online prescription delivery',
   '5 nearby pharmacies offer WhatsApp prescription delivery. Adding this feature estimated to grow customer base by 12%.', 115000, 'medium')
ON CONFLICT DO NOTHING;
