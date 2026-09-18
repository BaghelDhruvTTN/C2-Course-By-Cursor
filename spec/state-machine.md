# Ticket State Machine

## States

| State | Description |
|-------|-------------|
| `OPEN` | Newly created; not yet being worked on |
| `IN_PROGRESS` | Actively being investigated or resolved |
| `RESOLVED` | Fix applied; awaiting confirmation or closure |
| `CLOSED` | Completed and closed (terminal) |
| `CANCELLED` | Discarded or no longer relevant (terminal) |

## State Diagram

```
                    ┌─────────────┐
                    │    OPEN     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
     ┌────────────────┐         ┌──────────────┐
     │  IN_PROGRESS │         │  CANCELLED   │ (terminal)
     └───────┬────────┘         └──────────────┘
             │
    ┌────────┼────────┐
    ▼                  ▼
┌──────────┐    ┌──────────────┐
│ RESOLVED │    │  CANCELLED   │ (terminal)
└────┬─────┘    └──────────────┘
     │
     ▼
┌──────────┐
│  CLOSED  │ (terminal)
└──────────┘
```

## Valid Transitions

| From | To | Trigger |
|------|-----|---------|
| `OPEN` | `IN_PROGRESS` | Agent starts work |
| `OPEN` | `CANCELLED` | Ticket no longer needed |
| `IN_PROGRESS` | `RESOLVED` | Issue fixed |
| `IN_PROGRESS` | `CANCELLED` | Ticket abandoned |
| `RESOLVED` | `CLOSED` | Ticket confirmed closed |

## Invalid Transitions (must return HTTP 400)

| From | To | Reason |
|------|-----|--------|
| `CLOSED` | `OPEN` | Terminal state — cannot reopen |
| `CLOSED` | `IN_PROGRESS` | Terminal state |
| `CLOSED` | `RESOLVED` | Terminal state |
| `CLOSED` | `CANCELLED` | Terminal state |
| `CANCELLED` | `OPEN` | Terminal state — cannot reopen |
| `CANCELLED` | `IN_PROGRESS` | Terminal state |
| `CANCELLED` | `RESOLVED` | Terminal state |
| `CANCELLED` | `CLOSED` | Terminal state |
| `RESOLVED` | `OPEN` | Cannot revert to open |
| `RESOLVED` | `IN_PROGRESS` | Cannot revert to in-progress |
| `RESOLVED` | `CANCELLED` | Cannot cancel after resolution |
| `OPEN` | `RESOLVED` | Must go through IN_PROGRESS |
| `OPEN` | `CLOSED` | Must follow full lifecycle |

## Implementation Rules

1. Enforce in `TicketService.transitionStatus(ticketId, newStatus)` only.
2. `PUT /api/tickets/{id}` must **not** accept or change `status`.
3. `PATCH /api/tickets/{id}/status` is the sole endpoint for status changes.
4. On invalid transition, throw `InvalidStatusTransitionException` → HTTP 400 with message: `"Cannot transition from {current} to {requested}"`.
5. Transition to the same status is a no-op (HTTP 200, no change).

## UI Behaviour

- Show only **legal next statuses** as action buttons on the ticket detail page.
- If the API returns 400 for a transition, display the `message` field to the user.
- Terminal states (`CLOSED`, `CANCELLED`) show no transition buttons.

## Legal Next Status per Current State

| Current Status | Allowed Actions (UI buttons) |
|----------------|------------------------------|
| `OPEN` | Start Progress (`IN_PROGRESS`), Cancel (`CANCELLED`) |
| `IN_PROGRESS` | Mark Resolved (`RESOLVED`), Cancel (`CANCELLED`) |
| `RESOLVED` | Close (`CLOSED`) |
| `CLOSED` | None |
| `CANCELLED` | None |
