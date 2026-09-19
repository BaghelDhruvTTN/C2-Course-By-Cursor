# Test Strategy

## Goals

1. Verify all acceptance criteria in [requirements.md](requirements.md)
2. Prove the state machine is enforced by the backend
3. Ensure validation and error responses match [api-contract.md](api-contract.md)
4. Confirm data persists across application restarts

## Test Pyramid

```
        ┌───────────┐
        │  E2E (few)│  Frontend happy-path flows
        ├───────────┤
        │ Integration│  API + DB, state machine
        ├───────────┤
        │   Unit     │  Service logic, validators
        └───────────┘
```

## Backend Tests

### Unit Tests (JUnit 5 + Mockito)

| Class Under Test | Scenarios |
|------------------|-----------|
| `TicketService.transitionStatus` | Every valid transition succeeds |
| `TicketService.transitionStatus` | Every invalid transition throws `InvalidStatusTransitionException` |
| `TicketService.transitionStatus` | Same-status transition is a no-op |
| `TicketService.createTicket` | Valid input creates ticket with status `OPEN` |
| `TicketService.updateTicket` | Updates fields without changing status |

Location: `backend/src/test/java/.../service/`

### Integration Tests (Spring Boot Test + H2)

| Test Class | Scenarios |
|------------|-----------|
| `TicketStateMachineIntegrationTest` | **Required by assessment** — all valid transitions via REST return 200 |
| `TicketStateMachineIntegrationTest` | Invalid transitions return 400 with correct message |
| `TicketControllerIntegrationTest` | CRUD lifecycle: create → get → update → comment |
| `TicketSearchIntegrationTest` | Keyword search matches title and description |
| `TicketSearchIntegrationTest` | Status filter returns correct subset |
| `TicketPaginationIntegrationTest` | Invalid `page`/`size`/`sort` return 400 |
| `TicketPaginationIntegrationTest` | `sort` query param orders results |
| `TicketListQuerySupportTest` | Pagination and sort parsing validation |
| `TicketValidationIntegrationTest` | Blank title → 400 with fieldErrors |
| `TicketPersistenceIntegrationTest` | Data exists after repository flush / context reload |

Location: `backend/src/test/java/.../integration/`

Use `@SpringBootTest(webEnvironment = RANDOM_PORT)` with `TestRestTemplate` or RestAssured.

### State Machine Integration Test Matrix

**Valid (expect 2xx)**

| # | From | To |
|---|------|-----|
| 1 | `OPEN` | `IN_PROGRESS` |
| 2 | `OPEN` | `CANCELLED` |
| 3 | `IN_PROGRESS` | `RESOLVED` |
| 4 | `IN_PROGRESS` | `CANCELLED` |
| 5 | `RESOLVED` | `CLOSED` |

**Invalid (expect 400)**

| # | From | To |
|---|------|-----|
| 1 | `CLOSED` | `OPEN` |
| 2 | `RESOLVED` | `OPEN` |
| 3 | `CANCELLED` | `OPEN` |
| 4 | `OPEN` | `CLOSED` |
| 5 | `OPEN` | `RESOLVED` |
| 6 | `RESOLVED` | `IN_PROGRESS` |
| 7 | `CLOSED` | `IN_PROGRESS` |

## Frontend Tests

### Component Tests (Vitest + React Testing Library)

| Component | Scenarios |
|-----------|-----------|
| `TicketForm` | Renders validation errors from API `fieldErrors` |
| `StatusActions` | Shows correct buttons per current status |
| `StatusActions` | Displays error alert on 400 transition |
| `SearchBar` | Debounces and calls API with keyword |
| `StatusFilter` | Calls API with selected status |
| `ErrorBanner` | Renders `message` from error response |

Location: `frontend/src/**/*.test.tsx`

TypeScript `strict: true` is enabled in `frontend/tsconfig.app.json`; `npm run build` must pass before merge.

### E2E Tests (optional, Playwright or Cypress)

| Flow | Steps |
|------|-------|
| Create and view | Create ticket → redirected to detail → fields match |
| Full lifecycle | Create → start progress → resolve → close |
| Invalid transition | Attempt illegal transition → error message visible |
| Search | Create two tickets → search → only matching ticket shown |

## Test Data

Use factory methods or `@Sql` scripts for consistent test data:

```java
TicketBuilder.aTicket()
    .title("Login issue")
    .priority(HIGH)
    .status(OPEN)
    .build();
```

## Running Tests

```bash
# Backend — all tests
cd backend && ./mvnw test

# Backend — state machine only
cd backend && ./mvnw test -Dtest=TicketStateMachineIntegrationTest

# Frontend
cd frontend && npm test
```

## Coverage Targets

| Area | Target |
|------|--------|
| State machine service | 100% branch coverage |
| Controllers | All endpoints have at least one integration test |
| Validation | Every `@NotBlank` / `@Size` constraint has a failing test |
| Frontend error display | At least one test per error type (field, business, network) |

## CI (reference)

```yaml
# Run on every push
- mvnw test (backend)
- npm test (frontend)
```

## Traceability Matrix

| Acceptance Criterion | Test |
|----------------------|------|
| Create from UI | E2E: create flow |
| List tickets | Integration: GET /api/tickets |
| View details | Integration: GET /api/tickets/{id} |
| Update fields | Integration: PUT /api/tickets/{id} |
| Change assignee | Integration: PUT with assignee field |
| Add comments | Integration: POST /api/tickets/{id}/comments |
| Search | Integration: GET ?keyword= |
| Status filter | Integration: GET ?status= |
| Valid transitions | `TicketStateMachineIntegrationTest` valid matrix |
| Invalid transitions rejected | `TicketStateMachineIntegrationTest` invalid matrix |
| Data survives restart | `TicketPersistenceIntegrationTest` |
| Backend validation | `TicketValidationIntegrationTest` |
| UI shows errors | Component: `ErrorBanner`, `TicketForm` |
| No secrets committed | Manual / `.gitignore` review |
