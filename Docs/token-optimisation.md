# Token Optimisation

Per the assessment, use tooling to manage AI context efficiently.

## Recommended Plugins / MCP

| Tool | Purpose |
|------|---------|
| **SpecStory** | Auto-save prompts to `.specstory/history/` |
| **Graphify** | Visualise codebase structure for targeted context |
| **Caveman** | Reduce token usage in large codebases |
| **Codebase-memory MCP** | Persist project context across sessions |

## Practices

1. **Spec first** — point AI at `spec/` files instead of pasting requirements repeatedly.
2. **Scoped prompts** — one feature or layer per session (e.g. "implement POST /api/tickets per api-contract.md").
3. **Use rules and commands** — `.cursor/rules/` and slash commands load consistent context without re-explaining standards.
4. **Avoid mega-prompts** — never "build the complete application."
5. **Reference files** — use `@spec/api-contract.md` instead of copying content into the prompt.

## MCP Setup (optional)

Add MCP servers in Cursor Settings → MCP. Example structure for `.cursor/mcp.json` (no secrets):

```json
{
  "mcpServers": {
    "codebase-memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

Adjust based on your installed tools. Never commit API keys in MCP config.
