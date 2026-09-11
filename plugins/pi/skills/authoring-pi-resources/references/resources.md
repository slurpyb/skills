# Resource contracts

## Choose the artifact

| Artifact | Invocation | Best for |
|---|---|---|
| Skill | model or `/skill:name` | reusable capability and branch-specific reference |
| Prompt template | user `/name` | repeatable task kickoff with arguments |
| `AGENTS.md` | startup context | durable project rules and source-of-truth pointers |
| Pi package | install/config | distributing skills and prompts together |

A model-invoked skill description is always loaded. Use `disable-model-invocation: true` only when human-only invocation is intentional.

## Skill contract

A skill directory contains `SKILL.md`. Required frontmatter:

- `name`: 1–64 lowercase letters, digits, or hyphens; no edge/consecutive hyphens
- `description`: at most 1024 characters; capability plus trigger

Pi discovers skill folders recursively. It also supports direct root Markdown skills in Pi-specific skill directories and package skill roots. Keep portable skills directory-based. Relative links resolve from the skill directory.

## Prompt contract

Prompt templates are non-recursive Markdown files in `prompts/`. Filename becomes `/name`. Frontmatter may contain `description` and `argument-hint`. Supported substitutions include `$1`, `$@`, `$ARGUMENTS`, `${1:-default}`, `${ARGUMENTS:-default}`, `${@:N}`, and `${@:N:L}`.

## Context contract

Pi concatenates global and ancestor/current context files. `AGENTS.override.md` replaces `AGENTS.md` or `CLAUDE.md` in its own directory, not other directories. Put source-of-truth locations, conventions, and verification commands here. Keep task recipes in skills/prompts.

## Package contract

```json
{
  "keywords": ["pi-package"],
  "pi": {
    "skills": ["./skills"],
    "prompts": ["./prompts"]
  }
}
```

Manifest paths are package-relative and support globs/exclusions. Runtime dependencies belong in `dependencies`; Pi core packages belong in `peerDependencies` with `"*"`. Consumers can filter package resources; an omitted type loads all, `[]` loads none, and filters narrow the manifest.

## Completion

A resource is complete when its invocation metadata routes correctly, its body has one job, all disclosed files are reachable, package paths resolve, and explicit-load plus discovery-load tests both pass.
