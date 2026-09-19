# Branching Strategy

## Overview

This project uses a **dual-track** Git model:

| Track | Branch pattern | Purpose |
|-------|----------------|---------|
| **Production** | `main` | Production-ready code. All hardening, security, and scale work lands here. |
| **Demonstration** | `demo/phase-{N}-{slug}` | Frozen milestones suitable for demos, reviews, and assessment checkpoints. |

Both tracks follow the same development workflow:

```
Requirement → Specification → Plan → Implementation → Testing → Review → Fix
```

## Branch Naming

### Production track

- **`main`** — always the production-ready branch (may be ahead of demo branches).

### Demonstration track

```
demo/phase-{number}-{short-slug}
```

| Component | Rule | Example |
|-----------|------|---------|
| `phase-{number}` | Matches `spec/plan.md` phase | `phase-9` |
| `{short-slug}` | Kebab-case, 2–4 words | `assessment-complete` |

**Examples**

- `demo/phase-9-assessment-complete` — full-stack app with all acceptance criteria met
- `demo/phase-10-auth-baseline` — future demo after auth is added to `main`

## Rules

1. **Never force-push `main`** or rewrite demo milestone branches.
2. **Demo branches are snapshots** — create a new demo branch at the end of each demonstrable phase; do not rewrite history on an existing demo branch.
3. **Production work happens on `main`** — branch from `main`, merge back to `main`.
4. **Demo branches are created from the commit that completes a phase** — tag the commit if you need a permanent pointer.
5. **Spec first** — update `spec/` before implementation on either track.
6. **One phase (or sub-task) per session** — per `spec/plan.md` session guidelines.

## Workflow

### Completing a demonstrable phase

```bash
# 1. Finish phase on main (or a short-lived feature branch merged to main)
git checkout main
git pull

# 2. Run tests
cd backend && ./mvnw test
cd frontend && npm test

# 3. Create the demo milestone branch from the completing commit
git branch demo/phase-N-short-slug
git push -u origin demo/phase-N-short-slug
```

### Starting production hardening (on `main`)

```bash
git checkout main
# implement per spec/plan.md Phase 10+
# commit, test, review
```

### Checking out a demo for presentation

```bash
git checkout demo/phase-9-assessment-complete
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```

## Current Branches

| Branch | Commit | Description |
|--------|--------|-------------|
| `main` | latest | Production track; receives Phase 10+ work |
| `demo/phase-9-assessment-complete` | `00679a7` | Phases 1–9 complete: full-stack app, 57 backend + 10 frontend tests, review fixes |

### Phases 1–8 (historical note)

Phases 1–8 were implemented in a single development pass and are not available as separate Git branches. The first archived demo milestone is **Phase 9**, which captures the complete assessment-ready application. Future phases will each get a dedicated `demo/` branch at completion.

## Phase Map

| Phase | Track | Branch when complete |
|-------|-------|----------------------|
| 1–9 | Assessment / demo | `demo/phase-9-assessment-complete` |
| 10+ | Production | `main` (demo branch optional per milestone) |

See [`plan.md`](plan.md) for task details.

## Remote

Push both tracks to keep demos recoverable:

```bash
git push -u origin main
git push -u origin demo/phase-9-assessment-complete
```
