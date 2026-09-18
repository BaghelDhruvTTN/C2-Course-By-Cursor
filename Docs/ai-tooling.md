# AI Tooling Guide

This project follows the **SE/SSE Assignment** spec-driven workflow using Cursor.

## Workflow

```
Requirement → Specification → Plan/Tasks → Implementation → Testing → Review → Fix
```

## Directory Map

```
.cursor/
├── rules/                    # Persistent AI steering (auto-applied by Cursor)
│   ├── spec-driven-workflow.mdc   # Always on — enforces workflow
│   ├── java-springboot.mdc        # Java files in backend/
│   ├── testing.mdc                # Test files
│   └── api-standards.mdc          # Controllers, DTOs, api-contract
├── skills/
│   └── documentation/             # How to write specs and log prompts
└── commands/                      # Slash commands in Cursor chat
    ├── review-code.md
    ├── review-spec.md
    └── generate-tests.md

spec/                         # Created next — specifications before code
docs/
├── prompt-history.md         # Manual prompt log
├── ai-mistakes-log.md        # Required: document AI errors
├── ai-tooling.md             # This file
└── token-optimisation.md     # MCP and context tips

.specstory/history/           # Auto prompt history (SpecStory extension)
```

## Cursor Slash Commands

Type `/` in chat to invoke:

| Command | When to use |
|---------|-------------|
| `/review-code` | After implementing a feature |
| `/review-spec` | Before starting implementation |
| `/generate-tests` | After service/controller code is written |

## Rules Behaviour

| Rule | Applies when |
|------|--------------|
| `spec-driven-workflow` | Every session |
| `java-springboot` | Editing `backend/**/*.java` |
| `testing` | Editing test files |
| `api-standards` | Editing controllers, DTOs, or `spec/api-contract.md` |

## Prompt History

1. Install the **SpecStory** extension for automatic capture to `.specstory/history/`.
2. Manually append significant prompts to `docs/prompt-history.md`.
3. Log AI mistakes in `docs/ai-mistakes-log.md` when you catch incorrect suggestions.

## Next Step

Create all `spec/` artefacts, then run `/review-spec` before writing application code.
