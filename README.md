# Fitness Member Management

Mini-MVP for fitness business member management.

## Tech Stack

- **Backend**: Node.js 20, Express, TypeScript, Prisma, Zod
- **Frontend**: React 19, TypeScript, Vite, TanStack Query, TailwindCSS
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker Compose

## Quick Start

```bash
# Start all services
docker compose up

# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

## Development

```bash
# Backend (standalone)
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (standalone)
cd frontend
npm install
npm run dev
```

## Project Structure

```
├── backend/
│   ├── src/
│   └── prisma/
├── frontend/
│   └── src/
└── docker-compose.yml
```
