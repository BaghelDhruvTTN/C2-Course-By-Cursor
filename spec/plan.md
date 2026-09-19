# Implementation Plan

Workflow stage: **Plan / Tasks** (after Specification, before Implementation)

## Locked Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | React 18 + Vite + TypeScript | Lighter than Next.js for a SPA; spec allows equivalent frontend |
| Backend package | `com.example.tickets` | Per architecture.md |
| Database (dev/test) | H2 file mode | Data survives restart within dev sessions |
| Database (prod) | PostgreSQL | Per assessment |
| Migrations | Flyway | Per architecture.md |
| Exception naming | `InvalidStatusTransitionException` | Per spec review recommendation |
| API client | Native `fetch` wrapper | No extra dependency |

## Implementation Order

```
Phase 1  Backend scaffold
Phase 2  Domain + persistence
Phase 3  Service layer + state machine
Phase 4  REST controllers + error handling
Phase 5  Backend tests (state machine first)
Phase 6  Frontend scaffold
Phase 7  Frontend pages (one at a time)
Phase 8  Frontend tests + error display
Phase 9  Review, fix, acceptance check
```

Implement **one phase at a time**. Run tests after each phase. Do not skip ahead.

---

## Phase 1 — Backend Scaffold

**Goal:** Runnable Spring Boot app with health check and dev profile.

| # | Task | Done |
|---|------|------|
| 1.1 | Generate Spring Boot 3.x project (Java 21, Web, JPA, Validation, H2, Flyway, DevTools) | [x] |
| 1.2 | Set package structure: `controller`, `service`, `repository`, `domain`, `dto`, `exception`, `config` | [x] |
| 1.3 | Configure `application.yml` with `dev`, `test`, `prod` profiles | [x] |
| 1.4 | Configure H2 file datasource for `dev` profile (`jdbc:h2:file:./data/tickets`) | [x] |
| 1.5 | Add CORS config for `http://localhost:5173` (dev profile) | [x] |
| 1.6 | Add `.env.example` with `DB_URL`, `DB_USER`, `DB_PASSWORD` placeholders | [x] |
| 1.7 | Verify app starts: `./mvnw spring-boot:run` | [x] |

**Prompt to use:** _"Scaffold the Spring Boot backend per spec/architecture.md Phase 1 tasks."_

---

## Phase 2 — Domain & Persistence

**Goal:** Database schema and JPA entities matching `spec/data-model.md`.

| # | Task | Done |
|---|------|------|
| 2.1 | Create Flyway migration `V1__create_tickets_and_comments.sql` | [x] |
| 2.2 | Create `TicketStatus` and `Priority` enums | [x] |
| 2.3 | Create `Ticket` entity with JPA auditing (`createdAt`, `updatedAt`) | [x] |
| 2.4 | Create `Comment` entity with `@ManyToOne` to `Ticket` | [x] |
| 2.5 | Create `TicketRepository` with search/filter query methods | [x] |
| 2.6 | Create `CommentRepository` | [x] |
| 2.7 | Verify migration runs and tables exist on startup | [x] |

**Prompt to use:** _"Implement domain entities and Flyway migration per spec/data-model.md."_

---

## Phase 3 — Service Layer & State Machine

**Goal:** Business logic with enforced status transitions.

| # | Task | Done |
|---|------|------|
| 3.1 | Create DTOs: `CreateTicketRequest`, `UpdateTicketRequest`, `StatusTransitionRequest`, `CreateCommentRequest` | [x] |
| 3.2 | Create response DTOs: `TicketResponse`, `TicketSummary`, `CommentResponse`, `PagedTicketResponse` | [x] |
| 3.3 | Implement `TicketService.createTicket()` — always sets status `OPEN` | [x] |
| 3.4 | Implement `TicketService.getTicketById()` and `listTickets(keyword, status, pageable)` | [x] |
| 3.5 | Implement `TicketService.updateTicket()` — must NOT change status | [x] |
| 3.6 | Implement `TicketService.transitionStatus()` with full state machine per `spec/state-machine.md` | [x] |
| 3.7 | Implement `TicketService.addComment()` | [x] |
| 3.8 | Create `InvalidStatusTransitionException` and `TicketNotFoundException` | [x] |

**Prompt to use:** _"Implement TicketService and DTOs per spec/api-contract.md and spec/state-machine.md."_

---

## Phase 4 — REST Controllers & Error Handling

**Goal:** All 6 API endpoints working per `spec/api-contract.md`.

| # | Task | Done |
|---|------|------|
| 4.1 | Create `TicketController` — GET/POST `/api/tickets`, GET/PUT `/api/tickets/{id}` | [x] |
| 4.2 | Add PATCH `/api/tickets/{id}/status` endpoint | [x] |
| 4.3 | Create `CommentController` or nested POST `/api/tickets/{id}/comments` | [x] |
| 4.4 | Implement `GlobalExceptionHandler` with standard `ErrorResponse` JSON | [x] |
| 4.5 | Wire `@Valid` validation on all request DTOs | [x] |
| 4.6 | Add OpenAPI/Swagger config (dev profile only) | [x] |
| 4.7 | Manual smoke test all endpoints with curl or Swagger UI | [x] |

**Prompt to use:** _"Implement REST controllers and GlobalExceptionHandler per spec/api-contract.md."_

---

## Phase 5 — Backend Tests

**Goal:** State-machine integration tests pass (assessment requirement).

| # | Task | Done |
|---|------|------|
| 5.1 | Unit tests: `TicketService.transitionStatus` — all valid transitions | [x] |
| 5.2 | Unit tests: `TicketService.transitionStatus` — all invalid transitions | [x] |
| 5.3 | Unit tests: same-status no-op, create, update (no status change) | [x] |
| 5.4 | Integration: `TicketStateMachineIntegrationTest` — valid matrix (5 transitions) | [x] |
| 5.5 | Integration: `TicketStateMachineIntegrationTest` — invalid matrix incl. `IN_PROGRESS→OPEN` | [x] |
| 5.6 | Integration: `TicketControllerIntegrationTest` — CRUD + comment lifecycle | [x] |
| 5.7 | Integration: `TicketSearchIntegrationTest` — keyword + status filter | [x] |
| 5.8 | Integration: `TicketValidationIntegrationTest` — blank title → 400 + fieldErrors | [x] |
| 5.9 | Integration: `TicketPersistenceIntegrationTest` — H2 file DB survives context restart | [x] |
| 5.10 | Run `./mvnw test` — all green | [x] |

**Prompt to use:** _"/generate-tests for backend state machine and validation per spec/test-strategy.md."_

---

## Phase 6 — Frontend Scaffold

**Goal:** Runnable React app that can call the backend.

| # | Task | Done |
|---|------|------|
| 6.1 | Create Vite + React + TypeScript project in `frontend/` | [x] |
| 6.2 | Add React Router, base layout, and route stubs | [x] |
| 6.3 | Create TypeScript types mirroring API DTOs (`spec/api-contract.md`) | [x] |
| 6.4 | Create API client module (`frontend/src/api/tickets.ts`) | [x] |
| 6.5 | Create shared components: `ErrorBanner`, `FieldError`, `StatusBadge`, `PriorityBadge` | [x] |
| 6.6 | Configure Vite proxy or env var `VITE_API_URL=http://localhost:8080` | [x] |
| 6.7 | Verify dev server starts: `npm run dev` | [x] |

**Prompt to use:** _"Scaffold the React frontend per spec/architecture.md and spec/ui-flow.md Phase 6."_

---

## Phase 7 — Frontend Pages

**Goal:** All UI flows per `spec/ui-flow.md`. Implement **one page per session**.

| # | Task | Done |
|---|------|------|
| 7.1 | **Ticket List page** — table, pagination, empty state | [x] |
| 7.2 | **SearchBar** — debounced keyword search | [x] |
| 7.3 | **StatusFilter** — dropdown filter combined with search | [x] |
| 7.4 | **Create Ticket page** — form, validation errors, redirect on success | [x] |
| 7.5 | **Ticket Detail page** — view all fields, metadata | [x] |
| 7.6 | **Update form** — save via PUT, show field errors | [x] |
| 7.7 | **StatusActions** — buttons per legal transitions, error on 400 | [x] |
| 7.8 | **CommentList + CommentForm** — add and display comments | [x] |
| 7.9 | Loading, 404, and network error states on detail page | [x] |

**Prompts (one at a time):**
- _"Implement Ticket List page per spec/ui-flow.md task 7.1–7.3."_
- _"Implement Create Ticket page per spec/ui-flow.md task 7.4."_
- _"Implement Ticket Detail page per spec/ui-flow.md tasks 7.5–7.9."_

---

## Phase 8 — Frontend Tests

**Goal:** Error display and key interactions tested.

| # | Task | Done |
|---|------|------|
| 8.1 | Set up Vitest + React Testing Library | [x] |
| 8.2 | Test `TicketForm` — renders `fieldErrors` from API | [x] |
| 8.3 | Test `StatusActions` — correct buttons per status | [x] |
| 8.4 | Test `StatusActions` — shows error alert on 400 transition | [x] |
| 8.5 | Test `ErrorBanner` — renders `message` | [x] |
| 8.6 | Test `SearchBar` — debounced API call | [x] |
| 8.7 | Run `npm test` — all green | [x] |

**Prompt to use:** _"/generate-tests for frontend components per spec/test-strategy.md."_

---

## Phase 9 — Review, Fix & Acceptance

**Goal:** All acceptance criteria met; no secrets committed.

| # | Task | Done |
|---|------|------|
| 9.1 | Run `/review-code` on full codebase | [x] |
| 9.2 | Fix any critical issues from review | [x] |
| 9.3 | Walk through acceptance criteria checklist in `spec/requirements.md` | [x] |
| 9.4 | Verify data survives backend restart (manual test) | [x] |
| 9.5 | Verify `.gitignore` blocks secrets; no credentials in repo | [x] |
| 9.6 | Update `docs/prompt-history.md` and log any AI mistakes | [x] |
| 9.7 | Write root `README.md` with setup and run instructions | [x] |

---

## Traceability: Spec → Phase

| Spec file | Implemented in |
|-----------|----------------|
| `requirements.md` | Phases 3–9 (verified in Phase 9) |
| `architecture.md` | Phases 1, 6 |
| `data-model.md` | Phase 2 |
| `api-contract.md` | Phases 3, 4 |
| `state-machine.md` | Phase 3, 5 |
| `ui-flow.md` | Phases 6, 7 |
| `test-strategy.md` | Phases 5, 8 |

---

## Session Guidelines

1. **One phase or sub-task per AI session** — e.g. Phase 3 only, or Phase 7.4 only.
2. **Reference spec files** in prompts: `@spec/api-contract.md`.
3. **Run tests** at the end of every backend/frontend phase.
4. **Log prompts** to `docs/prompt-history.md` after each session.
5. **Record AI mistakes** in `docs/ai-mistakes-log.md` when caught.

## Branching

This project uses a dual-track model documented in [`branching-strategy.md`](branching-strategy.md):

- **`main`** — production-ready track (Phase 10+)
- **`demo/phase-{N}-{slug}`** — frozen demonstrable milestones

The assessment-ready application (Phases 1–9) is preserved on `demo/phase-9-assessment-complete`.

---

## Phase 10+ — Production Readiness (on `main`)

**Goal:** Harden the application for production deployment.

| # | Task | Done |
|---|------|------|
| 10.1 | Authentication and authorization (API key, prod profile) | [x] |
| 10.2 | Rate limiting and `keyword` length cap | [x] |
| 10.3 | Prod CORS from environment variable | [x] |
| 10.4 | Frontend: pagination race fix, list error retry | [x] |
| 10.5 | Frontend: TypeScript `strict` mode | [ ] |
| 10.6 | Expanded test coverage per review | [x] |
| 10.7 | CI pipeline (backend + frontend tests) | [x] |
| 10.8 | Create `demo/phase-10-production-baseline` when demonstrable | [ ] |

Implement one task or sub-task per session. Update spec before code.

---

## Current Status

| Phase | Status | Branch |
|-------|--------|--------|
| Phase 1 — Backend scaffold | **Done** | (included in demo/phase-9) |
| Phase 2 — Domain & persistence | **Done** | (included in demo/phase-9) |
| Phase 3 — Service layer | **Done** | (included in demo/phase-9) |
| Phase 4 — REST controllers | **Done** | (included in demo/phase-9) |
| Phase 5 — Backend tests | **Done** | (included in demo/phase-9) |
| Phase 6 — Frontend scaffold | **Done** | (included in demo/phase-9) |
| Phase 7 — Frontend pages | **Done** | (included in demo/phase-9) |
| Phase 8 — Frontend tests | **Done** | (included in demo/phase-9) |
| Phase 9 — Review & acceptance | **Done** | `demo/phase-9-assessment-complete` |
| Phase 10+ — Production readiness | **In progress** | `main` |
