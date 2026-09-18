# API Contract

Base URL: `http://localhost:8080`

All endpoints return JSON. Request bodies use `Content-Type: application/json`.

## Shared Types

### TicketStatus

`OPEN` | `IN_PROGRESS` | `RESOLVED` | `CLOSED` | `CANCELLED`

### Priority

`LOW` | `MEDIUM` | `HIGH`

### ErrorResponse

```json
{
  "timestamp": "2026-09-18T15:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable summary",
  "path": "/api/tickets/1/status",
  "fieldErrors": [
    { "field": "title", "message": "Title must not be blank" }
  ]
}
```

`fieldErrors` is included for validation failures; empty array or omitted for business-rule errors.

---

## Endpoints

### GET /api/tickets

List tickets with optional search and filter.

**Query parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `keyword` | string | No | Case-insensitive search in title and description |
| `status` | TicketStatus | No | Filter by exact status |
| `page` | int | No | Page number, default `0` |
| `size` | int | No | Page size, default `20` |
| `sort` | string | No | Default `createdAt,desc` |

**Response 200**

```json
{
  "content": [
    {
      "id": 1,
      "title": "Login page not loading",
      "priority": "HIGH",
      "status": "OPEN",
      "assignee": "alice@example.com",
      "createdAt": "2026-09-18T10:00:00Z",
      "updatedAt": "2026-09-18T10:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

---

### POST /api/tickets

Create a new ticket. Initial status is always `OPEN`.

**Request body**

```json
{
  "title": "Login page not loading",
  "description": "Users report a blank page after entering credentials.",
  "priority": "HIGH"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | 1–200 chars, not blank |
| `description` | string | Yes | 1–5000 chars, not blank |
| `priority` | Priority | Yes | Valid enum |

**Response 201**

```json
{
  "id": 1,
  "title": "Login page not loading",
  "description": "Users report a blank page after entering credentials.",
  "priority": "HIGH",
  "status": "OPEN",
  "assignee": null,
  "createdAt": "2026-09-18T10:00:00Z",
  "updatedAt": "2026-09-18T10:00:00Z",
  "comments": []
}
```

**Response 400** — validation failure with `fieldErrors`

---

### GET /api/tickets/{id}

Get full ticket details including comments.

**Response 200**

```json
{
  "id": 1,
  "title": "Login page not loading",
  "description": "Users report a blank page after entering credentials.",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "assignee": "alice@example.com",
  "createdAt": "2026-09-18T10:00:00Z",
  "updatedAt": "2026-09-18T11:30:00Z",
  "comments": [
    {
      "id": 10,
      "body": "Checked server logs — 500 on auth endpoint.",
      "author": "alice@example.com",
      "createdAt": "2026-09-18T11:00:00Z"
    }
  ]
}
```

**Response 404** — ticket not found

---

### PUT /api/tickets/{id}

Update ticket fields. Does **not** change status.

**Request body**

```json
{
  "title": "Login page returns 500",
  "description": "Updated after log review.",
  "priority": "MEDIUM",
  "assignee": "bob@example.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `title` | string | Yes | 1–200 chars |
| `description` | string | Yes | 1–5000 chars |
| `priority` | Priority | Yes | Valid enum |
| `assignee` | string | No | Max 100 chars; `null` to unassign |

**Response 200** — full `TicketResponse` (same shape as GET detail)

**Response 400** — validation failure

**Response 404** — ticket not found

---

### PATCH /api/tickets/{id}/status

Transition ticket status. Enforces [state-machine.md](state-machine.md).

**Request body**

```json
{
  "status": "IN_PROGRESS"
}
```

**Response 200** — full `TicketResponse` with updated status

**Response 400** — invalid transition

```json
{
  "timestamp": "2026-09-18T15:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Cannot transition from CLOSED to OPEN",
  "path": "/api/tickets/1/status",
  "fieldErrors": []
}
```

**Response 404** — ticket not found

---

### POST /api/tickets/{id}/comments

Add a comment to a ticket.

**Request body**

```json
{
  "body": "Deployed hotfix to staging.",
  "author": "bob@example.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `body` | string | Yes | 1–2000 chars, not blank |
| `author` | string | Yes | 1–100 chars, not blank |

**Response 201**

```json
{
  "id": 11,
  "body": "Deployed hotfix to staging.",
  "author": "bob@example.com",
  "createdAt": "2026-09-18T14:00:00Z"
}
```

**Response 400** — validation failure

**Response 404** — ticket not found

---

## HTTP Status Summary

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST |
| 400 | Validation error or invalid state transition |
| 404 | Resource not found |
| 500 | Unexpected server error |

## CORS

`dev` profile allows `http://localhost:5173` and `http://localhost:3000`.

## OpenAPI

Swagger UI at `/swagger-ui.html` (dev profile only). Generated from controller annotations.
