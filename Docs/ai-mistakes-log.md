# AI Mistakes Log

The assessment requires identifying at least **one meaningful mistake or incorrect suggestion** by the AI. This log demonstrates critical use of AI as an engineering assistant.

Record each mistake as work progresses.

---

## Template

```markdown
### Mistake N — [Category: e.g. State Machine / API Design / Security]

- **What AI suggested:** ...
- **Why it was wrong:** ...
- **Correct approach:** ...
- **Lesson:** ...
```

---

## Log

### Mistake 1 — Dependency resolution

- **What AI suggested:** Add `flyway-database-h2` dependency managed by Spring Boot parent.
- **Why it was wrong:** Artifact `org.flywaydb:flyway-database-h2:10.20.1` is not available on Maven Central; build failed.
- **Correct approach:** Use `flyway-core` only — it supports H2 for this project. Re-add `flyway-database-h2` in Phase 2 only if a specific Flyway version requires it.
- **Lesson:** Verify dependency resolution with `mvnw test` before marking scaffold complete.

### Mistake 2 — Project generation

- **What AI suggested:** Download project from Spring Initializr via URL query string.
- **Why it was wrong:** Request returned HTTP 400; had to scaffold manually.
- **Correct approach:** Create `pom.xml` and structure by hand, or use the Initializr web UI and import the zip.
- **Lesson:** Have a manual fallback when automated generators fail.

### Mistake 3 — Comment response after save

- **What AI suggested:** Return `toCommentResponse(comment)` immediately after `ticketRepository.save(ticket)` in `addComment`.
- **Why it was wrong:** Cascaded save did not populate `id` or `@CreatedDate` on the in-memory entity; API returned `null` timestamps (UI showed Jan 1, 1970).
- **Correct approach:** Use `commentRepository.saveAndFlush(comment)` and return the flushed entity.
- **Lesson:** Always verify POST response bodies in integration tests, not just HTTP status codes.

### Mistake 4 — Error message mapping

- **What AI suggested:** Map all HTTP 5xx proxy failures to a generic "Something went wrong" message.
- **Why it was wrong:** When the backend was unreachable (502), users saw a misleading generic error instead of a connection hint.
- **Correct approach:** Detect gateway/connection errors (502/503/504, `TypeError`) and show "Unable to connect to server".
- **Lesson:** Distinguish connection failures from server errors in the API client.
