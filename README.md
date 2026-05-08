# ProfileHub

A professional community portfolio platform built as an Nx monorepo.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS + Framer Motion |
| Backend | NestJS + TypeORM + PostgreSQL |
| Validation | Zod (shared FE ↔ BE) |
| State | TanStack Query v5 |
| Monorepo | Nx |

## Project Structure

```
profilehub/
├── apps/
│   ├── client/          # React + Vite frontend
│   └── service/         # NestJS backend
├── libs/
│   └── shared/
│       └── data-access/ # Zod schemas + shared types
├── docker-compose.yml   # PostgreSQL (local dev)
└── .env.example
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
docker-compose up -d

# 3. Copy env file
cp .env.example .env

# 4. Run both apps
npm run start:service    # → http://localhost:3000/api
npm run start:client     # → http://localhost:5173
```

## API Endpoints

```
GET  /api/profiles/discover      Discovery feed
GET  /api/profiles/:username     Profile by username
POST /api/profiles               Create profile
PATCH /api/profiles/:id          Update profile
PATCH /api/profiles/:id/visibility  Toggle public/private

POST /api/profiles/:id/experiences   Add experience
POST /api/profiles/:id/educations    Add education
POST /api/profiles/:id/skills        Add skill

POST /api/interactions           Toggle like / endorse
```
