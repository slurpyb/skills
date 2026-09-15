# Refactoring Guru agent for Pi

A dedicated Pi agent extension derived from the complete upstream Refactoring.Guru rules folder.

## Use

```text
/refactoring-guru extract authentication policy from src/auth/session.ts without changing behavior
```

The command starts a new, named session instead of changing the current assistant. The replacement session receives a refactoring-specific system prompt, repository instructions, a live Git/project snapshot, and a curated coding tool set.

Use `--refactoring-guru` only when the current session should start directly in this role.

## Agent workflow

The agent must trace callers and contracts, diagnose one smell, select the smallest treatment, capture a passing pre-edit baseline, refactor, verify against the same commands and scope, then stop at the declared condition.

## Role tools

- `refactoring_impact` categorizes lexical symbol hits across the target, production dependents, tests, and public contract surfaces.
- `refactoring_checkpoint` records the smell, treatment, scope, stop condition, dirty baseline, and no-shell verification commands; its verification result gates behavior-preservation claims.
- `refactoring_catalog` searches the full upstream treatment catalog after a smell is diagnosed.

The bundled `mini` rules drive the system prompt. `full`, `mini`, `nano`, and the renamed upstream `upstream-skill.md` are preserved under `references/refactoring-guru/` as source material, but this package does not register or execute a skill.

## Source

Derived from [`ciembor/agent-rules-books` at commit `802595f`](https://github.com/ciembor/agent-rules-books/tree/802595f127b9541180999d51e33f0a1da43e1d83/refactoring-guru). Upstream content is MIT licensed; see `LICENSE`.
