---
name: gather
description: Sealed packet for a read-only gatherer. Fill after codegraph. Use when fanning recon before prompts exist.
---

# Objective
Gather materials for: {{goal}}

# Slice
{{slice}}

# Codegraph
{{codegraph}}

# Instructions
1. DISPATCH: start broad (keywords from the slice + codegraph hits).
2. EVALUATE: score each file 0–1. Keep relevance >= 0.7.
3. REFINE: add codebase terminology, drop dead paths.
4. LOOP: at most 3 cycles, then stop.

Read sections, not whole files. Return compressed context another agent can use without re-reading.

# Output Format
## Files Retrieved
1. `path` (lines X–Y) — why it matters
## Key Excerpts
Fenced code with path + line range
## Terminology
Project words that search missed on cycle 1
## Gaps
What is still unknown

# Constraints
- Read-only: read, grep, find, ls. Bash only for `git log` / `git show` / `git grep`.
- One slice. No implementation. No nested spawn.
