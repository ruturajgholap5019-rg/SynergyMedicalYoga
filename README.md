Test# Synergy Medical Yoga - Monorepo

A machine-independent, cross-platform full-stack application built with Node.js, Express, MongoDB, and React (Vite).

## 🚀 Architecture Overview

The repository consists of 3 main services:
- **`backend/`**: Node.js & Express REST API with MongoDB (Port 5000).
- **`fontend/`**: Main Patient & Customer E-commerce / Appointment Web App (Port 5173).
- **`admin/`**: Dedicated Admin Portal for management of products, appointments, services, orders, and users (Port 5174).

---

## 🛠️ Machine-Independent Quick Start

### Method 1: Native Local Run (Windows / macOS / Linux)

#### Prerequisites
- **Node.js**: v18 or v20+
- **MongoDB**: Installed locally or running via Docker

#### Step 1: Install Dependencies
From the repository root, run:
```bash
npm run install:all
```

#### Step 2: Configure Environment Variables
Copy `.env.example` templates in each service directory if needed:
- `backend/.env.example` -> `backend/.env`
- `fontend/.env.example` -> `fontend/.env`
- `admin/.env.example` -> `admin/.env`

*Note: Default fallback values are pre-configured, allowing out-of-the-box execution without mandatory environment edits.*

#### Step 3: Seed Database (Optional)
Populate default products, services, carousels, and admin account (`admin@synergy.com` / `Admin@123456`):
```bash
npm run seed
```

#### Step 4: Run All Services Concurrently
```bash
npm run dev
```
Access points:
- **Patient App**: http://localhost:5173
- **Admin App**: http://localhost:5174
- **Backend API**: http://localhost:5000/api

---

### Method 2: 1-Command Docker Setup (Zero Local Installation Needed)

#### Prerequisites
- **Docker** & **Docker Compose** installed on your system.

#### Run Everything via Docker Compose
From the project root:
```bash
docker compose up -d --build
```

Access points:
- **Patient Web App**: http://localhost:5173
- **Admin Web App**: http://localhost:5174
- **Backend API**: http://localhost:5000/api

To stop containerized services:
```bash
docker compose down
```

---

## 🔑 Default Admin Credentials

- **Email**: `admin@synergy.com`
- **Password**: `Admin@123456`

---

## 📦 Monorepo Scripts Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs Backend, Frontend, and Admin apps concurrently in development mode |
| `npm run dev:backend` | Starts only the Backend REST API server |
| `npm run dev:frontend` | Starts only the Frontend Patient web app |
| `npm run dev:admin` | Starts only the Admin portal app |
| `npm run build` | Builds production artifacts for Frontend and Admin |
| `npm run seed` | Seeds initial MongoDB data and default admin user |
| `npm run docker:up` | Builds and starts all containers via Docker Compose |
| `npm run docker:down` | Stops all containerized services |
