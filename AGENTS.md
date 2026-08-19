# slurpyb/skills

Canonical catalog of agent skills, plugins, commands, rules, and personas.
This tree is the overlay added to every project sandbox.

This file is the instruction source of truth for Cursor, Claude, Codex, Gemini, and OpenCode.
`CLAUDE.md` and `GEMINI.md` are symlinks here. Edit this file only.

## Two modes

**Catalog work** (this directory is the workspace): author and publish skills and plugins.

**Project overlay** (this tree is mounted beside another repo): the project owns product code and any project-local `AGENTS.md`. This tree owns reusable agent capability. Prefer a skill here over inventing a one-off procedure. New reusable capability is contributed back here, not left only in the project.

If a project `AGENTS.md` and this file disagree on product behavior, the project wins. If they disagree on how to author or install a skill, this file wins.

## Layout

| Path | Role |
|---|---|
| `.claude-plugin/marketplace.json` | Published plugin index. In-tree sources are `./plugins/<name>`. |
| `plugins/` | Canonical in-tree plugin sources. |
| `docs/<plugin-name>/` | Operator notes for that marketplace entry. `README.md` lists env vars. |

Only these paths exist for you. Do not list, read, cite, or mention anything else in this repo unless the user directly references it.

## Discover and use

1. Read `.claude-plugin/marketplace.json` for the published plugin index.
2. Look in `plugins/<name>/` for in-tree sources. A marketplace entry may exist before the directory does.
3. Load a skill by reading its `SKILL.md` before improvising.

## Authoring

- One skill = one directory whose name matches `name` in frontmatter.
- `SKILL.md` is the always-loaded surface. Keep it short. Put depth in `references/` one level deep.
- Description is third person, includes what the skill does and when to use it, and is what the agent uses to decide to load it.
- Publish into `plugins/` and register in `marketplace.json`.

When adapting someone else's skill or plugin: scan for references to plugins, agents, skills, MCP servers, and tools we do not ship. Report them before copying. Strip or rewrite those refs in the copy unless we already have an equivalent. Credit the original in SKILL.md frontmatter via `license` plus `metadata` (Claude ignores unknown keys; `metadata` is the spec-safe bucket):

```yaml
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
```

Writing guidance lives in the `writing-for-agents` skill (mattpocock-skills plugin), not in this repo.

## Working rules

- Paths outside Layout, including gitignored trees, are a black hole. Do not forage them. A direct user reference (path, @-mention, or attached file) is permission to read that target only — not the rest of the tree.
- Scope is what was asked. Adjacent problems get one sentence, then move on.
- Verify by running. Do not claim a skill, command, or plugin exists without reading it.
- Do not edit `CLAUDE.md` or `GEMINI.md`.
- When catalog work is ready to use (marketplace, plugins, install fixes), commit and push to `origin` without asking. Do not wait for a second message.
- Secrets stay in the environment or Bitwarden (`bws`). Never commit credentials.
