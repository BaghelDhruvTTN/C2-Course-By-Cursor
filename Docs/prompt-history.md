# Prompt History

All AI prompts for this project are recorded here (and in `.specstory/history/` if using the SpecStory extension).

## How to Log

After each meaningful AI session, append an entry using the template from `.cursor/skills/documentation/SKILL.md`.

---

## 2026-09-18 — Project setup: helper tooling

**Prompt:** Read Assessments.pdf thoroughly and be strictly consistent. Then: start first with all the helper tools we need.

**Context:** Empty workspace; `Docs/Assessments.pdf` defines SE/SSE assignment requirements for spec-driven development.

**Outcome:** Created `.cursor/rules/`, `.cursor/skills/documentation/`, `.cursor/commands/`, prompt history scaffolding, and project tooling docs.

**AI mistakes (if any):** _None identified yet — update as work progresses._

---

## 2026-09-18 — Spec folder creation

**Prompt:** Start the creation of spec folder.

**Context:** Helper tooling already in place; assessment requires spec artefacts before implementation.

**Outcome:** Created all 7 spec files under `spec/` — requirements, architecture, data-model, api-contract, state-machine, ui-flow, test-strategy.

**AI mistakes (if any):** _None identified yet — update as work progresses._

---

## 2026-09-18 — Plan / Tasks

**Prompt:** Move to Plan / Tasks.

**Context:** Spec review passed (READY). All 7 spec artefacts approved.

**Outcome:** Created `spec/plan.md` with 9 phases, locked tech decisions (React+Vite, Flyway, H2 file mode), and per-session prompt guidance.

**AI mistakes (if any):** _None identified yet — update as work progresses._

---

## 2026-09-18 — Phase 1: Backend scaffold

**Prompt:** Start Phase 1.

**Context:** `spec/plan.md` Phase 1 tasks; `spec/architecture.md`.

**Outcome:** Created `backend/` Spring Boot 3.4.1 project with profiles, CORS, health endpoints, Maven wrapper. Tests pass; app starts on port 8080.

**AI mistakes (if any):** Initializr download failed (400); `flyway-database-h2` artifact not on Maven Central at managed version — removed dependency, `flyway-core` handles H2 sufficiently.

---

## 2026-09-18 — Phase 2: Domain & persistence

**Prompt:** Start Phase 2.

**Context:** `spec/data-model.md`, `spec/plan.md` Phase 2.

**Outcome:** Flyway V1 migration, Ticket/Comment entities, enums, repositories, JPA auditing, integration tests. All 4 tests pass.

**AI mistakes (if any):** `@DataJpaTest` did not enable JPA auditing by default — fixed with `@Import(JpaAuditingConfig.class)`.

---

## 2026-09-18 — Phase 3: Service layer & state machine

**Prompt:** Start Phase 3.

**Context:** `spec/api-contract.md`, `spec/state-machine.md`, Phase 3 plan tasks.

**Outcome:** DTOs, exceptions, `TicketService`, `TicketStatusTransitions`, unit tests. All 12 tests pass.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 4: REST controllers & error handling

**Prompt:** Start Phase 4.

**Context:** `spec/api-contract.md`, `TicketService` from Phase 3.

**Outcome:** `TicketController` (6 endpoints), `GlobalExceptionHandler`, `ErrorResponse` DTO, springdoc OpenAPI (dev only), controller integration tests. 17 tests pass.

**AI mistakes (if any):** Redundant `@Size(min=1)` with `@NotBlank` caused duplicate field errors — removed `min=1` from DTOs.

---

## 2026-09-18 — Phase 5: Backend tests

**Prompt:** Start Phase 5.

**Context:** `spec/test-strategy.md` state machine matrix and integration test plan.

**Outcome:** Expanded `TicketServiceTest` (full valid/invalid matrices), added `TicketStateMachineIntegrationTest`, `TicketSearchIntegrationTest`, `TicketValidationIntegrationTest`, `TicketPersistenceIntegrationTest`. 43 tests pass.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 6: Frontend scaffold

**Prompt:** Start Phase (continued from prior session).

**Context:** `spec/architecture.md`, `spec/ui-flow.md`, `spec/api-contract.md`.

**Outcome:** Vite + React + TypeScript app in `frontend/` with React Router, API client, shared components (`ErrorBanner`, `FieldError`, `StatusBadge`, `PriorityBadge`), Vite proxy for `/api`, `.env.example`. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.1–7.3: Ticket List page

**Prompt:** Start Phase (continued).

**Context:** `spec/ui-flow.md` list page, search, filter, pagination.

**Outcome:** `TicketListPage`, `TicketTable`, `SearchBar`, `StatusFilter`, `useDebouncedValue` hook. Debounced keyword search, status filter, pagination, empty/loading/error states. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.4: Create Ticket page

**Prompt:** Start Phase 7.4.

**Context:** `spec/ui-flow.md` create form, `spec/api-contract.md` POST `/api/tickets`.

**Outcome:** `TicketForm`, `CreateTicketPage`, shared `api/errors.ts` helpers. Field-level and banner errors, disabled submit while in flight, redirect to detail on success. `npm run build` passes.

**AI mistakes (if any):** Initial build failed on `FormEvent` type-only import and optional `fieldErrors` — fixed.

---

## 2026-09-18 — Phase 7.5: Ticket Detail page (view)

**Prompt:** Start Phase 7.5.

**Context:** `spec/ui-flow.md` detail page sections — header, fields, comments list, metadata.

**Outcome:** `TicketDetailPage`, `TicketDetail`, `CommentList` (read-only). Fetches via `GET /api/tickets/{id}`, shows loading/404/network error with retry. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.6: Ticket update form

**Prompt:** Start Phase 7.6.

**Context:** `spec/ui-flow.md` update ticket via PUT, field errors, success confirmation.

**Outcome:** `TicketUpdateForm` with title, description, priority, assignee. Wired in `TicketDetailPage` via `PUT /api/tickets/{id}`. Inline "Changes saved." confirmation and validation errors. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.7: StatusActions

**Prompt:** Start Phase 7.7.

**Context:** `spec/ui-flow.md` and `spec/state-machine.md` legal transitions per status.

**Outcome:** `StatusActions` component with buttons per current status, `PATCH /api/tickets/{id}/status` wiring, 400 error banner. Hidden for terminal states. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.8: CommentList + CommentForm

**Prompt:** Start Phase 7.8.

**Context:** `spec/ui-flow.md` add comment form, append without reload.

**Outcome:** `CommentForm` with author/body fields, `POST /api/tickets/{id}/comments`, appends to list in state, field errors and banner on failure, form clears on success. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 7.9: Detail page load/error states

**Prompt:** Proceed to Phase 7.9.

**Context:** `spec/ui-flow.md` loading, 404, network error with retry.

**Outcome:** `TicketDetailLoadingState` (spinner + skeleton), `TicketNotFoundState`, `TicketLoadErrorState` with Retry and back link. `isConnectionError` / `getDetailLoadErrorMessage` for spec copy. Phase 7 complete. `npm run build` passes.

**AI mistakes (if any):** _None identified._

---

## 2026-09-18 — Phase 9: Review, fix & acceptance

**Prompt:** Start Phase 9.

**Context:** `spec/requirements.md` acceptance criteria, full codebase review.

**Outcome:** Code review completed; fixed `TicketPersistenceIntegrationTest` port conflict (`server.port=0`). All acceptance criteria marked done in `spec/requirements.md`. Root `README.md` written. `.gitignore` verified for secrets. Backend 43 tests + frontend 10 tests pass.

**AI mistakes (if any):** Logged mistakes 3–4 in `docs/ai-mistakes-log.md`.

---

## 2026-09-18 — Phase 8: Frontend tests

**Prompt:** Start Phase 8.

**Context:** `spec/test-strategy.md` component test matrix, `spec/plan.md` Phase 8 tasks.

**Outcome:** Vitest + RTL + jsdom configured. Tests for `ErrorBanner`, `TicketForm`, `StatusActions`, `TicketListPage` debounced search. `npm test` — 10 tests pass.

**AI mistakes (if any):** Initial failures due to missing RTL cleanup and fake-timer/`waitFor` conflict — fixed.

---

## 2026-09-18 — Bug fix: comment createdAt null on POST

**Prompt:** Comments date showing Jan 1, 1970.

**Context:** `POST /comments` returned `createdAt: null`; JS `Date(null)` = epoch.

**Outcome:** `TicketService.addComment` uses `commentRepository.saveAndFlush`. Test assertion added for `id` and `createdAt` on create response.

**AI mistakes (if any):** _None identified._

---

## 2026-09-19 — Code review suggestions

**Prompt:** Start working on the suggestions.

**Context:** Post-review follow-ups: expose `sort` query param, validate pagination, tighten CORS headers, restrict H2 console.

**Outcome:** Added `TicketListQuerySupport` with pagination/sort validation, `InvalidQueryParameterException` handler, integration and unit tests. Updated `spec/api-contract.md` and `spec/test-strategy.md`. CORS uses explicit allowed headers; H2 console sets `web-allow-others: false`.

**AI mistakes (if any):** _None identified._

---

## 2026-09-19 — Dual-track branching strategy

**Prompt:** Main = production; current demo on separate branch; each demonstrable stage gets its own branch; same dev workflow.

**Context:** Multi-dimensional code review identified production gaps. User wants `main` for production work and `demo/*` branches for preserved milestones.

**Outcome:** Added `spec/branching-strategy.md`, Phase 10+ in `spec/plan.md`, README branch table. Created `demo/phase-9-assessment-complete` at commit `00679a7`.

**AI mistakes (if any):** _None identified._

---

## 2026-09-19 — Push branches and Phase 10 production hardening

**Prompt:** Yes push the branches and proceed.

**Context:** Dual-track branching on `main` (production) and `demo/phase-9-assessment-complete`.

**Outcome:** Pushed `main` and `demo/phase-9-assessment-complete` to origin. Phase 10 on `main`: API key auth (prod), rate limiting, keyword length cap, prod CORS from env, frontend list pagination/retry fixes, security tests, GitHub Actions CI.

**AI mistakes (if any):** Used wrong Spring Security import (`authentication.preauth`); fixed with `UsernamePasswordAuthenticationToken`.
