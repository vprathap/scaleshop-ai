# ScaleShop AI — Full-Stack Web Application

AI-powered platform helping Indian SME shop owners automate operations, grow revenue, and prepare for IPO.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS + Vite |
| Backend | Node.js + Express 4 |
| Database | PostgreSQL 15 |
| Auth | JWT (jsonwebtoken + bcrypt) |
| Containerisation | Docker + Docker Compose |

## Project Structure

```
scaleshop-ai/
├── database/
│   ├── schema.sql          # All table definitions
│   └── seed.sql            # Demo data for dev/testing
├── backend/
│   ├── src/
│   │   ├── server.js       # Express app entry point
│   │   ├── config/db.js    # PostgreSQL pool
│   │   ├── middleware/     # auth.js, errorHandler.js
│   │   └── routes/         # auth, shops, admin, ipo
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx         # Router + layout
    │   ├── api/client.js   # Axios instance
    │   ├── context/        # AuthContext
    │   ├── components/     # Navbar, Sidebar, StatCard, etc.
    │   └── pages/          # Landing, Login, Dashboard, Admin, IPOTracker
    ├── vite.config.js
    └── package.json
```

## Quick Start (Docker)

```bash
git clone <your-repo-url>
cd scaleshop-ai
docker-compose up --build
```

- **Frontend**: http://localhost:5173  
- **Backend API**: http://localhost:4000/api  
- **API Health**: http://localhost:4000/api/health

## Quick Start (Local)

### 1. Database
```bash
psql -U postgres -c "CREATE DATABASE scaleshop;"
psql -U postgres -d scaleshop -f database/schema.sql
psql -U postgres -d scaleshop -f database/seed.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # Edit with your DB credentials
npm install
npm run dev                 # Runs on port 4000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                 # Runs on port 5173
```

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@scaleshop.ai | Admin@123 |
| Shop Owner | ravi@kirana.com | Shop@123 |

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new shop owner |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | JWT | Current user profile |
| GET | /api/shops | JWT | List shops (admin: all, owner: own) |
| POST | /api/shops | JWT (admin) | Create new shop |
| GET | /api/shops/:id/metrics | JWT | Shop KPI metrics |
| GET | /api/shops/:id/recommendations | JWT | AI recommendations |
| GET | /api/shops/:id/ipo | JWT | IPO checklist |
| PUT | /api/shops/:id/ipo/:item_id | JWT | Update IPO checklist item |
| GET | /api/admin/overview | JWT (admin) | Platform-wide summary |

## Git Setup

```bash
cd scaleshop-ai
git init
git add .
git commit -m "feat: initial ScaleShop AI full-stack scaffold"
git remote add origin https://github.com/<your-username>/scaleshop-ai.git
git push -u origin main
```

## Environment Variables

See `backend/.env.example` for all required backend variables.  
See `frontend/src/api/client.js` for `VITE_API_URL` usage.
