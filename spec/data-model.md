# Data Model

## Entity Relationship

```
┌─────────────────────┐         1:N         ┌─────────────────────┐
│       Ticket        │────────────────────►│       Comment         │
├─────────────────────┤                     ├─────────────────────┤
│ id (PK)             │                     │ id (PK)             │
│ title               │                     │ ticket_id (FK)      │
│ description         │                     │ body                │
│ priority            │                     │ author              │
│ status              │                     │ created_at          │
│ assignee (nullable) │                     └─────────────────────┘
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

## Ticket

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | `BIGINT` | PK, auto-increment | |
| `title` | `VARCHAR(200)` | NOT NULL, not blank | |
| `description` | `TEXT` | NOT NULL | |
| `priority` | `VARCHAR(20)` | NOT NULL | Enum: `LOW`, `MEDIUM`, `HIGH` |
| `status` | `VARCHAR(20)` | NOT NULL, default `OPEN` | Enum: see state machine |
| `assignee` | `VARCHAR(100)` | NULLABLE | Free-text agent identifier |
| `created_at` | `TIMESTAMP` | NOT NULL | Set on create |
| `updated_at` | `TIMESTAMP` | NOT NULL | Set on create and update |

### TicketStatus enum

`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `CANCELLED`

### Priority enum

`LOW`, `MEDIUM`, `HIGH`

## Comment

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | `BIGINT` | PK, auto-increment | |
| `ticket_id` | `BIGINT` | FK → `ticket.id`, NOT NULL | |
| `body` | `TEXT` | NOT NULL, not blank | |
| `author` | `VARCHAR(100)` | NOT NULL | Free-text; no auth module |
| `created_at` | `TIMESTAMP` | NOT NULL | Immutable after create |

## JPA Entity Notes

- `Ticket` has `@OneToMany(mappedBy = "ticket", cascade = ALL, orphanRemoval = false)` to `Comment`.
- `Comment` has `@ManyToOne(fetch = LAZY)` to `Ticket`.
- Comments are append-only; no update or delete in scope.
- Use `@CreatedDate` and `@LastModifiedDate` on `Ticket` via JPA auditing.

## Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_ticket_status` | `status` | Status filter |
| `idx_ticket_created_at` | `created_at DESC` | Default list sort |

Full-text search uses `LIKE` on `title` and `description` for simplicity (acceptable at assessment scale).

## DTO Mapping

| Entity | Response DTO | Notes |
|--------|--------------|-------|
| `Ticket` | `TicketResponse` | Includes nested `comments` list on detail view |
| `Ticket` | `TicketSummary` | Excludes `description` and `comments` on list view |
| `Comment` | `CommentResponse` | |

Field names in DTOs match [api-contract.md](api-contract.md) exactly (camelCase JSON).

## Validation Rules

| Field | Rule |
|-------|------|
| `title` | Required, 1–200 characters |
| `description` | Required, 1–5000 characters |
| `priority` | Required, valid enum value |
| `assignee` | Optional, max 100 characters |
| `comment.body` | Required, 1–2000 characters |
| `comment.author` | Required, 1–100 characters |
| `status` (transition) | Required, valid enum value; transition must be legal |
