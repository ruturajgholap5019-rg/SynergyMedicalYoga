tt# Synergy Medical Yoga Monorepo

Modern staging candidate for the Synergy Medical Yoga website migration.

## Structure

- `backend/` - Node.js, Express, MongoDB REST API.
- `frontend/` - React + Vite customer website.
- `admin/` - React + Vite standalone admin portal.

The previous misspelled frontend folder has been renamed to `frontend/`. The admin source of truth is the standalone `admin/` app.

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

3. Configure MongoDB and secrets in `backend/.env`.

4. Create the first admin explicitly:

```bash
cd backend
SEED_ADMIN_EMAIL=admin@example.com SEED_ADMIN_PASSWORD="StrongPassw0rd!" npm run seed:admin
```

On Windows PowerShell:

```powershell
$env:SEED_ADMIN_EMAIL="admin@example.com"
$env:SEED_ADMIN_PASSWORD="StrongPassw0rd!"
npm run seed:admin
```

5. Run all services:

```bash
npm run dev
```

## URLs

- Frontend: http://localhost:5173
- Admin: http://localhost:5174
- Backend API: http://localhost:5000/api

## Build

```bash
npm run build
```

## Docker

Copy `.env.example` to `.env`, replace secrets, then:

```bash
docker compose up -d --build
```

Payment gateways are intentionally not production-enabled in this phase. Orders should be treated as pending manual confirmation.
