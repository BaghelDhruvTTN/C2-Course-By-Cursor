# Review Code

Perform a structured code review of recent changes against project standards.

## Steps

1. Read `.cursor/rules/java-springboot.mdc`, `testing.mdc`, and `api-standards.mdc`.
2. Read the relevant `spec/` files for the changed area.
3. Inspect the diff (uncommitted or branch changes).

## Review Checklist

### Correctness
- [ ] State machine enforced in service layer; invalid transitions return 400
- [ ] Backend validation on all write endpoints (`@Valid`, custom validators)
- [ ] Search and status filter match spec behaviour
- [ ] Comments are persisted and linked to the correct ticket

### API & Data
- [ ] Endpoints match `spec/api-contract.md`
- [ ] Error responses follow the standard JSON format
- [ ] DTOs used at API boundary; entities not exposed directly
- [ ] Enum values consistent across DB, API, and frontend

### Security & Hygiene
- [ ] No secrets, API keys, or credentials in code or config committed to git
- [ ] No `ddl-auto=create-drop` in production profile
- [ ] CORS configured intentionally (not `*` in production)

### Tests
- [ ] State machine integration tests exist and pass
- [ ] Validation edge cases covered
- [ ] New behaviour has corresponding tests

### Frontend
- [ ] API errors displayed meaningfully to the user
- [ ] Forms validate before submit where appropriate

## Output Format

```markdown
# Code Review — [date]

## Summary
[1-2 sentences]

## Critical (must fix)
- ...

## Suggestions
- ...

## Passed
- ...
```

If critical issues exist, fix them before marking the task complete.
