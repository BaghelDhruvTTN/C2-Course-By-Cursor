# Architecture

## System Context

```
┌─────────────┐         REST/JSON          ┌──────────────────┐
│   Browser   │ ◄────────────────────────► │  Spring Boot API │
│  (React/    │      http://localhost:8080   │    (Java 21)     │
│  Next.js)   │                            └────────┬─────────┘
└─────────────┘                                     │
                                                    │ JDBC
                                                    ▼
                                           ┌──────────────────┐
                                           │  PostgreSQL / H2 │
                                           └──────────────────┘
```

## Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | React 18 + Vite (or Next.js) | SPA calling REST API |
| Backend | Java 21, Spring Boot 3.x | REST controllers, JPA, validation |
| Database | H2 (dev/test), PostgreSQL (prod) | Flyway migrations |
| API format | JSON, camelCase fields | See [api-contract.md](api-contract.md) |
| Dev tools | Cursor, GitHub Copilot | Spec-driven workflow |

## Repository Layout

```
├── backend/                  # Spring Boot application
│   └── src/main/java/com/example/tickets/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── domain/
│       ├── dto/
│       ├── exception/
│       └── config/
├── frontend/                 # React SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api/              # API client functions
│       └── types/            # TypeScript types mirroring API DTOs
├── spec/                     # Specifications (this folder)
└── docs/                     # Prompt history, tooling guides
```

## Backend Module Boundaries

| Module | Responsibility |
|--------|----------------|
| `controller` | HTTP mapping, request validation (`@Valid`), response codes |
| `service` | Business logic, state-machine enforcement, DTO mapping |
| `repository` | JPA data access |
| `domain` | `Ticket`, `Comment` entities; `TicketStatus`, `Priority` enums |
| `exception` | `GlobalExceptionHandler` — consistent error JSON |
| `config` | CORS, datasource profiles, JPA auditing, OpenAPI |

## Key Design Decisions

### State machine in the service layer

Status transitions are enforced exclusively in `TicketService.transitionStatus()`. Controllers delegate; entities do not auto-transition on field update. See [state-machine.md](state-machine.md).

### Separate status transition endpoint

Ticket field updates (`PUT /api/tickets/{id}`) do not change status. Status changes use `PATCH /api/tickets/{id}/status` so the state machine is applied in one place.

### Assignee as a plain string

No user-management module. Assignee is an optional free-text field (e.g. agent name or email) to keep scope focused on ticket lifecycle.

### Search and filter on list endpoint

`GET /api/tickets` accepts optional `keyword` and `status` query parameters. Both can be combined.

## Configuration Profiles

| Profile | Database | Purpose |
|---------|----------|---------|
| `dev` | H2 in-memory or file | Local development |
| `test` | H2 | Automated tests |
| `prod` | PostgreSQL | Production (env vars for credentials) |

## CORS

Frontend dev server (`http://localhost:5173` or `http://localhost:3000`) is allowed in the `dev` profile. Production CORS targets the deployed frontend origin only.

## Error Handling Flow

```
Controller → Service (throws InvalidTransitionException / NotFoundException)
          → GlobalExceptionHandler → standard error JSON → Frontend displays message
```

## Deployment (reference)

- Backend: executable JAR, port 8080
- Frontend: static build served by CDN or reverse proxy
- Database: managed PostgreSQL instance
- Secrets via environment variables (`DB_URL`, `DB_USER`, `DB_PASSWORD`)

## Branching

- **`main`** — production-ready track (see [`branching-strategy.md`](branching-strategy.md))
- **`demo/phase-{N}-{slug}`** — frozen demonstrable milestones (e.g. `demo/phase-9-assessment-complete`)
