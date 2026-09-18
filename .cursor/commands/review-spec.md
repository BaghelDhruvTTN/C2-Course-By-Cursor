# Review Spec

Validate specification artefacts before starting or continuing implementation.

## Steps

1. List all files under `spec/` and read each one.
2. Cross-reference against `Docs/Assessments.pdf` application requirements.
3. Check internal consistency across spec documents.

## Completeness Checklist

- [ ] `requirements.md` — all 10 features and acceptance criteria listed
- [ ] `architecture.md` — backend, frontend, database, and deployment described
- [ ] `data-model.md` — Ticket, Comment entities with all fields and types
- [ ] `api-contract.md` — every endpoint with request/response examples and error cases
- [ ] `state-machine.md` — all valid and invalid transitions documented
- [ ] `ui-flow.md` — screens for create, list, detail, update, comment, search, filter
- [ ] `test-strategy.md` — unit, integration, and state-machine test plan

## Consistency Checks

| Check | Files to compare |
|-------|------------------|
| Field names match | `data-model.md` ↔ `api-contract.md` |
| Status values match | `state-machine.md` ↔ `api-contract.md` ↔ `data-model.md` |
| UI actions map to APIs | `ui-flow.md` ↔ `api-contract.md` |
| Tests cover acceptance criteria | `test-strategy.md` ↔ `requirements.md` |

## State Machine Verification

Confirm these transitions are documented and marked invalid where needed:

```
OPEN → IN_PROGRESS → RESOLVED → CLOSED
OPEN → CANCELLED
IN_PROGRESS → CANCELLED
```

Invalid examples to explicitly reject: CLOSED→OPEN, RESOLVED→OPEN, CANCELLED→OPEN.

## Output Format

```markdown
# Spec Review — [date]

## Status: READY | NEEDS WORK

## Gaps
- ...

## Inconsistencies
- ...

## Recommendations
- ...
```

Do not begin implementation if status is NEEDS WORK. Update the spec first.
