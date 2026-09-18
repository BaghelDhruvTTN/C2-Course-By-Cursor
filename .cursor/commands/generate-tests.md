# Generate Tests

Generate or extend tests following `spec/test-strategy.md` and `.cursor/rules/testing.mdc`.

## Steps

1. Read `spec/test-strategy.md`, `spec/state-machine.md`, and `spec/api-contract.md`.
2. Identify the code under test (service, controller, or component).
3. Check for existing tests; extend rather than duplicate.
4. Generate tests, then run them and fix failures.

## Priority Test Scenarios

### State Machine (integration — required by assessment)

```java
// Valid transitions — expect 200/204
OPEN → IN_PROGRESS
IN_PROGRESS → RESOLVED
RESOLVED → CLOSED
OPEN → CANCELLED
IN_PROGRESS → CANCELLED

// Invalid transitions — expect 400
CLOSED → OPEN
RESOLVED → OPEN
CANCELLED → OPEN
CLOSED → IN_PROGRESS
```

### Validation

- Create ticket with blank title → 400 with fieldErrors
- Create ticket with invalid priority → 400
- Update non-existent ticket → 404

### Persistence

- Create ticket, restart context (or new transaction), verify data still exists

### Search & Filter

- Create tickets with distinct titles/statuses
- `?keyword=X` returns only matching tickets
- `?status=OPEN` returns only open tickets

### Comments

- Add comment to existing ticket → 201, comment appears in GET detail
- Add comment to missing ticket → 404

## Frontend Tests

- Form shows API validation errors from `fieldErrors`
- Status transition button disabled or shows error for invalid transitions
- Search input filters the ticket list

## Output

After generating tests, report:

```markdown
# Tests Generated — [date]

## Files created/updated
- ...

## Run command
cd backend && ./mvnw test

## Results
[Paste pass/fail summary]
```

Do not commit tests that are intentionally failing or skipped.
