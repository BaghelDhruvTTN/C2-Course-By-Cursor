---
name: documentation
description: >-
  Write and maintain project documentation including spec artefacts, API docs,
  README sections, and prompt history entries. Use when creating or updating
  files under spec/, docs/, or when the user asks for documentation.
---

# Documentation Skill

## When to Use

- Creating or updating spec artefacts before implementation
- Writing API documentation aligned with `spec/api-contract.md`
- Recording prompts and AI mistakes for the assessment

## Spec Artefact Checklist

Before implementation, ensure these exist under `spec/`:

| File | Purpose |
|------|---------|
| `requirements.md` | User stories, acceptance criteria |
| `architecture.md` | System diagram, tech stack, module boundaries |
| `data-model.md` | Entities, fields, relationships |
| `api-contract.md` | Endpoints, request/response schemas, error codes |
| `state-machine.md` | Valid/invalid status transitions |
| `ui-flow.md` | Screens, navigation, error display |
| `test-strategy.md` | Test types, coverage goals, key scenarios |

## Writing Standards

- Use present tense and active voice.
- One concern per section; link between docs instead of duplicating.
- Keep API field names identical across `data-model.md`, `api-contract.md`, and code.
- Include at least one example request/response per endpoint in `api-contract.md`.

## Prompt History Entry Template

Append to `docs/prompt-history.md`:

```markdown
## YYYY-MM-DD — [Short title]

**Prompt:** [Exact prompt text]

**Context:** [What spec/code was relevant]

**Outcome:** [What was produced]

**AI mistakes (if any):** [What was wrong and how it was corrected]
```

## AI Mistakes Log

When AI output is incorrect, record in `docs/ai-mistakes-log.md`:

```markdown
### Mistake N — [Category]

- **What AI suggested:** ...
- **Why it was wrong:** ...
- **Correct approach:** ...
- **Lesson:** ...
```

The assessment requires identifying at least one meaningful AI mistake.

## Templates

See [templates.md](templates.md) for copy-paste starters for each spec file.
