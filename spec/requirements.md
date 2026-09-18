# Requirements

## Overview

Support Ticket Management System — a web application that lets support agents create, track, search, and resolve customer support tickets with enforced status lifecycle rules.

## Actors

| Actor | Description |
|-------|-------------|
| Support Agent | Creates and manages tickets, adds comments, updates assignees |

## User Stories

1. As a support agent, I can create a ticket with a title, description, and priority so that customer issues are recorded.
2. As a support agent, I can view a list of all tickets so that I can see the current workload.
3. As a support agent, I can open a ticket to view its full details and comment history.
4. As a support agent, I can update a ticket's title, description, priority, and assignee so that information stays current.
5. As a support agent, I can add comments to a ticket so that progress and notes are tracked.
6. As a support agent, I can search tickets by keyword so that I can find related issues quickly.
7. As a support agent, I can filter tickets by status so that I can focus on a specific queue.
8. As a support agent, I can transition a ticket through valid statuses so that progress is tracked correctly.
9. As a support agent, I see clear error messages when my input is invalid or an action is not allowed.

## Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Create a ticket (title, description, priority) | Must |
| FR-02 | List tickets with pagination | Must |
| FR-03 | View ticket details including comments | Must |
| FR-04 | Update title, description, priority, and assignee | Must |
| FR-05 | Add comments to a ticket | Must |
| FR-06 | Search tickets by keyword (title and description) | Must |
| FR-07 | Filter tickets by status | Must |
| FR-08 | Persist all data in a database | Must |
| FR-09 | Validate input on the backend | Must |
| FR-10 | Display meaningful errors in the UI | Must |
| FR-11 | Enforce ticket status state machine on the backend | Must |
| FR-12 | Reject invalid status transitions with HTTP 400 | Must |

## Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Data survives application restart |
| NFR-02 | Backend: Java 21, Spring Boot 3.x |
| NFR-03 | Database: PostgreSQL (prod), H2 (local dev and tests) |
| NFR-04 | Frontend: React or Next.js |
| NFR-05 | REST API with JSON payloads |
| NFR-06 | No secrets committed to the repository |
| NFR-07 | OpenAPI documentation available in dev profile |

## Out of Scope

- User authentication and role-based access control
- Email or webhook notifications
- File attachments on tickets or comments
- Multi-tenant organisations

## Acceptance Criteria

- [x] Ticket can be created from the UI
- [x] Tickets can be listed
- [x] Ticket details can be viewed
- [x] Ticket fields (title, description, priority) can be updated
- [x] Assignee can be changed
- [x] Comments can be added
- [x] Search by keyword works
- [x] Status filter works
- [x] Valid status transitions work (`OPEN → IN_PROGRESS → RESOLVED → CLOSED`, `OPEN → CANCELLED`, `IN_PROGRESS → CANCELLED`)
- [x] Invalid status transitions are rejected by the backend (e.g. `CLOSED → OPEN`)
- [x] Data survives application restart
- [x] Backend validation works (blank title, invalid enum values)
- [x] UI shows meaningful errors from API responses
- [x] State-machine integration tests pass
- [x] No secrets are committed

## References

- State machine detail: [state-machine.md](state-machine.md)
- API detail: [api-contract.md](api-contract.md)
- UI detail: [ui-flow.md](ui-flow.md)
- Test detail: [test-strategy.md](test-strategy.md)
