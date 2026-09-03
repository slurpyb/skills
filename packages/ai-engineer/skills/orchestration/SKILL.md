---
name: orchestration
description: Runs the AI Engineer loop on pi — codegraph understand, gather materials, fill prompt templates, review those prompts, then fan out tasks. Use when spawning subagents, building worker prompts from templates, or gating fan-out on prompt review.
---

# Orchestration

Always-loaded tools on the `ai-engineer` pi extension. Depth: `references/orchestration.md`.

## Loop

`codegraph` → `gather_materials` → `prompt_template fill` → `review_prompt` → `fanout_tasks`

Later steps stay gated. `fanout_tasks` refuses until `review_prompt` approves a draft.

## When

- A job needs codebase orientation before workers exist
- Materials must be gathered in parallel before prompts are written
- Subagent-produced prompts must be reviewed before a second fan-out

## Pointers

- Codegraph deep reads: pi-lens `symbol_search` → `module_report` → `read_symbol` when that package is loaded
- Gather cycles: iterative-retrieval DISPATCH → EVALUATE → REFINE (max 3)
- Prompt craft: `prompt-creation`, `prompt-optimization`, `prompt-library`
- Packet rules: `agent-design` fresh-eyes; octocode-subagent lobby if installed
- Writing: `writing-for-agents` (short surface, references one level deep)
