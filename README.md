# Fitness Member Management

Mini-MVP for fitness business member management.

## Tech Stack

- **Backend**: Node.js 20, Express, TypeScript, Prisma, Zod
- **Frontend**: React 19, TypeScript, Vite, TanStack Query, TailwindCSS
- **Database**: PostgreSQL 16
- **Testing**: Vitest

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

## Quick Start (Docker)

```bash
# Start all services (Postgres + Backend + Frontend)
docker compose up --build

# Backend API: http://localhost:3000
# Frontend UI: http://localhost:5173
```

## Local Development (Without Docker)

### 1. Start PostgreSQL

```bash
docker compose up postgres -d
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Run migrations and seed
npx prisma migrate dev
npx prisma db seed

# Start dev server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Run once
npm run test:run
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/members | List/search members |
| GET | /api/members/:id | Get member summary |
| POST | /api/members | Create member |
| GET | /api/memberships/plans | List plans |
| POST | /api/memberships | Assign plan |
| PATCH | /api/memberships/:id/cancel | Cancel membership |
| POST | /api/check-ins | Record check-in |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Business logic
│   │   ├── validators/   # Zod schemas
│   │   └── lib/          # Prisma client
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
├── frontend/
│   └── src/
│       ├── components/   # React components
│       ├── hooks/        # React Query hooks
│       ├── api/          # API client
│       └── types/        # TypeScript types
├── TECH_SPEC.md          # Technical specification
├── DECISIONS.md          # Architecture decisions
└── docker-compose.yml
```

## Demo Video

[Link to demo video]

## Documentation

- [TECH_SPEC.md](./TECH_SPEC.md) - API docs, schema, business rules
- [DECISIONS.md](./DECISIONS.md) - Technical decisions and trade-offs
