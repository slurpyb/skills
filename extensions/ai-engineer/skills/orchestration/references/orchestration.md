# Orchestration loop

The extension encodes one sequence. Tools exist so the parent can inspect each gate; they are not four independent products.

```
codegraph understand
        ↓
gather_materials     (fan-out 1, read-only)
        ↓
prompt_template fill (templates + materials)
        ↓
review_prompt        (rubric, optional reviewer subagent)
        ↓
fanout_tasks         (fan-out 2, approved packets only)
```

## Completion criteria

| Step | Done when |
|------|-----------|
| codegraph | A map, search, symbol, or deps snapshot is stored on the job |
| gather | At least one gatherer returned files + excerpts + gaps |
| fill | A draft prompt exists with template variables substituted |
| review | Verdict is APPROVE, or REVISE followed by a new fill |
| fan-out | Each approved prompt ran as its own worker |

## Codegraph backends

1. **Local wrapper** — `find` / `rg` (or `grep`) / `sg` if present. Honest about which binary ran.
2. **pi-lens** — if `symbol_search`, `module_report`, `read_symbol`, `lsp_navigation` are registered, the wrapper returns a routing card rather than duplicating them.
3. **Gap** — no in-tree slurpyb `codegraph` plugin. Octocode MCP local tools are a second graph when those tools are present in this session; this extension does not speak MCP itself. Skip named MCP tools that are missing. Never invent results from a tool that did not run.

## Templates

Shipped in `templates/`: `gather`, `task`, `review`. Also indexes `skills/prompt-library/templates/`. Fill accepts `{{var}}`, `{var}`, and `{{#if var}}...{{/if}}`. Job goal, materials, and codegraph summary are injected when those keys are omitted.

## Review

`review_prompt` always runs the local rubric (task, format, guards, grounding, length). `via=subagent` also spawns `prompt-reviewer`. Stricter verdict wins. `fanout_tasks` reads `status=approved` only.

## Subagents

Spawned as `pi --mode json -p --no-session` (same contract as the official pi subagent example). Agents: `gatherer` (read-only), `prompt-reviewer`, `worker`, plus this package's `prompt-engineer` / `skill-author`. Scope `all` also loads `~/.pi/agent/agents` and project `.pi/agents`.

## Slash

`/engineer <goal>` starts a job and prints the next step. Empty `/engineer` prints phase.
