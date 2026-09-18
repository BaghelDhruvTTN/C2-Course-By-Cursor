# Spec Document Templates

## requirements.md

```markdown
# Requirements

## Overview
Support Ticket Management System — [one-line description]

## User Stories
1. As a support agent, I can create a ticket with title, description, and priority.
2. ...

## Functional Requirements
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Create ticket | Must |

## Non-Functional Requirements
- Data persists across restarts
- Backend validates all input
- UI shows meaningful errors

## Acceptance Criteria
- [ ] Ticket can be created from UI
- [ ] ...
```

## state-machine.md

```markdown
# Ticket State Machine

## States
OPEN, IN_PROGRESS, RESOLVED, CLOSED, CANCELLED

## Valid Transitions
| From | To |
|------|-----|
| OPEN | IN_PROGRESS, CANCELLED |
| IN_PROGRESS | RESOLVED, CANCELLED |
| RESOLVED | CLOSED |

## Invalid Transitions (examples)
| From | To | Reason |
|------|-----|--------|
| CLOSED | OPEN | Terminal state |
| RESOLVED | OPEN | Cannot reopen |
| CANCELLED | OPEN | Terminal state |
```

## api-contract.md (endpoint stub)

```markdown
### POST /api/tickets

**Request**
```json
{ "title": "string", "description": "string", "priority": "LOW|MEDIUM|HIGH" }
```

**Response 201**
```json
{ "id": 1, "title": "...", "status": "OPEN", "createdAt": "..." }
```

**Response 400** — validation errors per API standards rule
```
