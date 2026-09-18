# UI Flow

## Application Pages

| Page | Route | Purpose |
|------|-------|---------|
| Ticket List | `/` | Browse, search, filter tickets |
| Create Ticket | `/tickets/new` | Create a new ticket |
| Ticket Detail | `/tickets/:id` | View, update, comment, transition status |

## Navigation

```
Ticket List ──► Create Ticket ──► (redirect to Detail)
     │                                    │
     └──────────── Ticket Detail ◄───────┘
```

## Ticket List Page (`/`)

### Layout

- **Header**: app title + "New Ticket" button
- **Toolbar**: search input + status filter dropdown
- **Table**: id, title, priority, status, assignee, created date
- **Pagination**: page controls when `totalPages > 1`

### Interactions

| Action | Behaviour |
|--------|-----------|
| Type in search | Debounced call to `GET /api/tickets?keyword=...` |
| Select status filter | Call `GET /api/tickets?status=...` (combine with keyword) |
| Click row | Navigate to `/tickets/{id}` |
| Click "New Ticket" | Navigate to `/tickets/new` |

### Empty State

Show "No tickets found" when the list is empty (with or without filters active).

---

## Create Ticket Page (`/tickets/new`)

### Form Fields

| Field | Input Type | Required |
|-------|------------|----------|
| Title | text | Yes |
| Description | textarea | Yes |
| Priority | select (`LOW`, `MEDIUM`, `HIGH`) | Yes |

### Actions

| Button | Behaviour |
|--------|-----------|
| Submit | `POST /api/tickets` → on success redirect to `/tickets/{id}` |
| Cancel | Navigate back to `/` |

### Error Display

- Field-level errors from `fieldErrors` array shown below each input.
- General error banner from `message` for non-field errors.
- Submit button disabled while request is in flight.

---

## Ticket Detail Page (`/tickets/:id`)

### Sections

1. **Header** — ticket ID, status badge, priority badge
2. **Details form** — title, description, priority, assignee (editable)
3. **Status actions** — buttons for legal next statuses (see [state-machine.md](state-machine.md))
4. **Comments** — chronological list + add comment form
5. **Metadata** — created/updated timestamps

### Update Ticket

| Action | API Call |
|--------|----------|
| Save changes | `PUT /api/tickets/{id}` |

Show success toast or inline confirmation on save. Show field errors inline on 400.

### Status Transitions

| Current Status | Buttons Shown |
|----------------|---------------|
| `OPEN` | "Start Progress", "Cancel" |
| `IN_PROGRESS` | "Mark Resolved", "Cancel" |
| `RESOLVED` | "Close" |
| `CLOSED` / `CANCELLED` | No buttons |

Each button calls `PATCH /api/tickets/{id}/status` with the target status. On 400, show `message` in an error alert.

### Add Comment

| Field | Input Type | Required |
|-------|------------|----------|
| Author | text | Yes |
| Body | textarea | Yes |

Submit calls `POST /api/tickets/{id}/comments`. On success, append comment to the list without full page reload.

### Loading & Error States

| State | UI |
|-------|-----|
| Loading | Skeleton or spinner |
| Not found (404) | "Ticket not found" with link back to list |
| Network error | "Unable to connect to server" with retry option |

---

## Error Display Standards

All API errors follow a consistent pattern:

```
┌─────────────────────────────────────────┐
│ ⚠ Cannot transition from CLOSED to OPEN │  ← banner from `message`
└─────────────────────────────────────────┘

Title: [________________]
       Title must not be blank              ← from fieldErrors
```

- **400 validation**: highlight invalid fields + show `fieldErrors` messages
- **400 business rule**: show `message` banner (e.g. invalid transition)
- **404**: dedicated not-found page or section
- **500**: "Something went wrong. Please try again."

---

## UI Components (suggested)

| Component | Used On |
|-----------|---------|
| `TicketTable` | List page |
| `SearchBar` | List page toolbar |
| `StatusFilter` | List page toolbar |
| `TicketForm` | Create page |
| `TicketDetail` | Detail page |
| `StatusBadge` | List + detail |
| `PriorityBadge` | List + detail |
| `CommentList` | Detail page |
| `CommentForm` | Detail page |
| `StatusActions` | Detail page |
| `ErrorBanner` | All forms |
| `FieldError` | All forms |

---

## Responsive Behaviour

- Table scrolls horizontally on narrow screens
- Forms stack vertically on mobile
- Minimum target width: 320px
