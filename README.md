# Support Ticket Management System

A full-stack support ticket application built with **Spring Boot 3** and **React 18**, developed using a spec-driven workflow.

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready track (latest hardening) |
| `demo/phase-10-production-baseline` | Production baseline demo (Phase 10 complete) |
| `demo/phase-9-assessment-complete` | Assessment-ready demo (Phases 1–9 complete) |

See [`spec/branching-strategy.md`](spec/branching-strategy.md) for the full branching model.

## Features

- Create, list, view, and update support tickets
- Search by keyword and filter by status
- Comment threads on tickets
- Enforced status lifecycle (`OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`, with `CANCELLED` branches)
- Backend validation with structured error responses
- H2 file database for local dev (data survives restarts)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Java 21, Spring Boot 3.4, Spring Data JPA, Flyway |
| Frontend | React 18, TypeScript, Vite, React Router |
| Database (dev) | H2 file mode |
| Database (prod) | PostgreSQL |
| Tests | JUnit 5, Spring Boot Test, Vitest, React Testing Library |

## Prerequisites

- Java 21+
- Node.js 20+
- Maven (or use the included wrapper in `backend/`)

## Quick Start

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
.\mvnw.cmd spring-boot:run    # Windows
```

The API starts on **http://localhost:8080**.

- Swagger UI (dev): http://localhost:8080/swagger-ui.html
- Health check: http://localhost:8080/actuator/health

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI starts on **http://localhost:5173** and proxies `/api` to the backend.

## Configuration

Copy environment examples (do not commit real secrets):

```bash
cp .env.example .env          # root — PostgreSQL prod placeholders
cp frontend/.env.example frontend/.env
```

| Variable | Purpose |
|----------|---------|
| `DB_URL`, `DB_USER`, `DB_PASSWORD` | PostgreSQL connection (prod profile) |
| `API_KEY` | API key required for `/api/**` in prod profile |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins (prod profile) |
| `VITE_API_URL` | Frontend API base URL (empty = use Vite proxy) |
| `VITE_API_KEY` | Optional `X-API-Key` header for secured production API |

### Profiles

| Profile | Database | Use |
|---------|----------|-----|
| `dev` (default) | H2 file (`backend/data/tickets`) | Local development |
| `test` | H2 in-memory | Automated tests |
| `prod` | PostgreSQL via env vars | Production |

Run with a specific profile:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tickets` | List tickets (`?keyword`, `?status`, `?page`, `?size`) |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/{id}` | Get ticket with comments |
| PUT | `/api/tickets/{id}` | Update ticket fields |
| PATCH | `/api/tickets/{id}/status` | Transition status |
| POST | `/api/tickets/{id}/comments` | Add comment |

See [`spec/api-contract.md`](spec/api-contract.md) for full details.

## Running Tests

```bash
# Backend (63 tests)
cd backend && ./mvnw test

# Frontend (10 tests)
cd frontend && npm test

# Frontend production build
cd frontend && npm run build
```

## Project Structure

```
├── backend/          # Spring Boot REST API
├── frontend/         # React SPA
├── spec/             # Requirements, API contract, state machine, plan
├── docs/             # Prompt history, AI tooling notes
└── .cursor/          # Cursor rules, skills, commands
```

## Specification

All behaviour is defined under `spec/`:

- [`requirements.md`](spec/requirements.md) — user stories and acceptance criteria
- [`api-contract.md`](spec/api-contract.md) — REST API
- [`state-machine.md`](spec/state-machine.md) — status transitions
- [`ui-flow.md`](spec/ui-flow.md) — frontend pages and interactions
- [`test-strategy.md`](spec/test-strategy.md) — test plan

## Development Workflow

```
Requirement → Specification → Plan → Implementation → Testing → Review → Fix
```

See [`spec/plan.md`](spec/plan.md) for the phased implementation history.
