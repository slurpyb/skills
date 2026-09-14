---
name: skill-seekers-toolkit
description: |
  Turn documentation sites, GitHub repos, PDFs, local codebases, and 14+ other
  source types into structured AI skills and RAG knowledge with the Skill Seekers
  toolkit (`skill-seekers` CLI + 40-tool MCP server). Use when the user wants to:
  build/create an AI skill from docs, a repo, or a PDF; "scrape these docs into a
  skill"; convert a codebase into Claude/Cursor/LangChain knowledge; generate
  .cursorrules or RAG documents; author or validate a scraping config; run C3.x
  codebase/pattern analysis; or package/upload a skill to Claude, Gemini, OpenAI,
  or a vector DB. Also triggers on "skill-seekers", "snack-seekers", "skill seekers",
  and the skill-seekers MCP tools. Emphasizes FREE local enhancement (no API key)
  and the many non-obvious source types and output formats agents overlook.
---

# Skill Seekers Toolkit

Skill Seekers extracts knowledge from a source, analyzes/organizes it, optionally
AI-enhances it, and packages it for an AI platform. Driven two ways:

- **CLI** — `skill-seekers <command>` (this is what you run from a terminal).
- **MCP server** — 40 tools callable by natural language from inside Claude Code,
  Cursor, etc. See [references/mcp-tools.md](references/mcp-tools.md).

> The package is `skill-seekers` (PyPI). The command is also `skill-seekers`.
> The MCP server module is `skill_seekers.mcp.server_fastmcp`.

## Install & verify

```bash
pip install skill-seekers          # or: uv tool install skill-seekers
skill-seekers --version            # expect 3.5.0+
skill-seekers doctor               # checks Python, install, git, Claude Code, API keys
```

Optional extras: `skill-seekers[gemini]`, `[openai]`, `[all]`, `[mcp]`.

## The pipeline

> **3.6 consolidated all source subcommands into `create`.** The old `scrape`,
> `github`, `pdf`, and `unified` subcommands are **gone** — every source type is now
> a `create` flag (or auto-detected from the positional source).

**1. `create` — build the skill (one-shot).** Auto-detects source type and runs the
whole pipeline. Covers 20+ source types, not just docs.

```bash
skill-seekers create <source> -p standard      # preset: quick | standard | comprehensive
```
`create` builds a **platform-neutral** skill dir — it has **no `--target`** flag.
Choose a platform afterward with `package --target …`.

**2. Then enhance / package / upload as needed.**

```bash
skill-seekers create  https://react.dev --name react   # or --repo …, --pdf …, --config …
skill-seekers enhance output/react/                     # auto LOCAL when no API key is set
skill-seekers package output/react/ --target claude
skill-seekers upload  output/react.zip --target claude
```

`create` caches raw data in `output/{name}_data/`, so re-runs (`--skip-scrape`) and
re-packaging for other platforms are cheap. Full flags: [references/cli-commands.md](references/cli-commands.md).

## Pick the source flag

Everything goes through `create`. Auto-detect from the positional `<source>`, or be
explicit with a flag:

| Source | `create` invocation |
| --- | --- |
| Docs website | `create https://docs…` (or `--url …`) |
| GitHub repo | `create owner/repo` (or `--repo owner/repo`); local clone → `--local-repo-path PATH` |
| PDF (incl. scanned) | `create file.pdf` (or `--pdf file.pdf`) `--ocr` |
| Local codebase (dir) | `create ./proj` → **C3.x codebase analysis** (not usage docs — see pitfalls) |
| Jupyter / OpenAPI / .docx / .epub / .pptx / RSS / man page / video URL | `create <file-or-url>` (or `--notebook/--spec/--docx/--epub/--pptx/--feed-url/--man-path/--video-url`) |
| Multiple sources at once | `create configs/multi.json` (or `create <src> --config …` — additive) |

`create` detection order: file extension → video URL → directory → `owner/repo`
or github.com → http(s) URL → bare domain. Full list in
[references/capabilities-and-pitfalls.md](references/capabilities-and-pitfalls.md).

## Enhancement: use FREE local mode

Enhancement turns a 3/10 raw extraction into a ~9/10 curated skill. The mode is
chosen automatically by **API-key presence** — there is no `--mode`/`--enhance-mode` flag:

- **LOCAL (FREE)** — used when no API key is set. Runs headless via the coding-agent
  CLI (e.g. `claude`). No metered cost. **This is the default.**
- **API (PAID)** — used when `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` / `OPENAI_API_KEY`
  / `MOONSHOT_API_KEY` is present (~$0.01–0.30/skill).

```bash
skill-seekers create <source> -p standard       # enhancement runs LOCAL (free) if no key
skill-seekers enhance output/skill/             # enhance existing skill; LOCAL unless a key is set
skill-seekers create <source> --enhance-level 0  # skip AI enhancement entirely (0–3 = depth)
```

**Rule:** Keep it LOCAL. Do **not** introduce an API key for enhancement/upload
(which consumes metered quota) unless the user explicitly approves it for that run.
To force API on an existing skill once approved: `enhance output/skill/ --target claude`.

**Billing safety:** Claude Code itself reads `ANTHROPIC_API_KEY` and will flip from
your subscription to metered API billing if it's set in the environment. If the user
approves a paid run, **never `export` the key** — pass it **inline** to that one
command (`ANTHROPIC_API_KEY="$KEY" skill-seekers enhance … --target claude`, or
`--api-key`), then confirm `[ -z "$ANTHROPIC_API_KEY" ]`.

## Common workflows

**Docs → skill (free):**
```bash
skill-seekers create https://tailwindcss.com/docs -p standard --max-pages 50
skill-seekers package output/tailwindcss/ --target claude   # platform chosen here, not on create
```

**Repo → deep codebase skill:**
```bash
export GITHUB_TOKEN=ghp_...                        # REQUIRED: unauth GitHub API = 60/hr, 403s fast
skill-seekers create owner/repo -p comprehensive   # runs C3.x suite (20–60 min)
# No token? Clone first, analyze locally (git protocol dodges the API rate limit):
#   git clone --depth 1 https://github.com/owner/repo /tmp/repo
#   skill-seekers create /tmp/repo -p comprehensive
```
See [references/codebase-analysis.md](references/codebase-analysis.md) for what C3.x extracts.

**One source → many platforms (build once, package many):**
```bash
skill-seekers create --config configs/react.json
for t in claude gemini openai markdown; do skill-seekers package output/react/ --target "$t"; done
```

**Custom site (no preset config):** author a config, validate, then build.
```bash
skill-seekers create --config configs/mysite.json --dry-run   # validate (no `validate` subcommand in 3.6)
skill-seekers create --config configs/mysite.json
```
Schema + a fill-in template: [references/config-schema.md](references/config-schema.md),
`assets/unified-config.template.json`.

**Steering workflows (enhancement passes):** apply a YAML workflow or bundled preset
during `create` (repeatable; `create`-only — not on `enhance`). Preview with
`--workflow-dry-run`. The `workflows` subcommand is broken — use the direct entry
point `skill-seekers-workflows`.
```bash
skill-seekers create <src> --enhance-workflow security-focus --enhance-workflow api-documentation
skill-seekers-workflows list                  # presets + yours (NOT `skill-seekers workflows`)
```

## Using the MCP server

If the skill-seekers MCP server is connected, prefer driving it by natural language
("Analyze facebook/react", "Scrape the Vue docs into a skill", "Validate my config")
rather than shelling out — same engine, no terminal. Setup (stdio for Claude Code,
HTTP for Cursor/Windsurf) and all 40 tools: [references/mcp-tools.md](references/mcp-tools.md).

## Reference map

| Need | Read |
| --- | --- |
| Every CLI command + flag | [references/cli-commands.md](references/cli-commands.md) |
| The 40 MCP tools + setup | [references/mcp-tools.md](references/mcp-tools.md) |
| Write/validate a scraping config | [references/config-schema.md](references/config-schema.md) |
| Deep code/pattern analysis (C3.x) | [references/codebase-analysis.md](references/codebase-analysis.md) |
| **What else it can do + what trips agents up** | [references/capabilities-and-pitfalls.md](references/capabilities-and-pitfalls.md) |

## Top pitfalls (full list in capabilities-and-pitfalls.md)

- `create` has **no `--target`** — it builds a neutral skill; choose platform with
  `package --target claude|gemini|openai|markdown` (those are the values — not `anthropic`).
- Enhancement mode = **API-key presence**, not a `--mode`/`--enhance-mode` flag (neither
  exists). Use `--enhance-level 0–3` for depth, `-p` for the preset.
- GitHub repos: **set `GITHUB_TOKEN`** or expect 403 rate-limits within minutes (unauth
  = 60/hr). No token? `git clone` then `create ./localdir` (git protocol skips the API).
- `-p comprehensive` on a *local* dir can still report `Files Analyzed: 0` / an empty
  dependency graph — check the run log; pattern/test/config extraction may succeed while AST analysis quietly no-ops.
- 3.6 removed `scrape`/`github`/`pdf`/`unified`/`validate` — **everything is `create`** (validate a config with `create --config <f> --dry-run`).
- `create <localdir>` does **codebase analysis** (C3.x internals), not usage docs — for a usage skill, source the docs and construct them yourself.
- `package` runs a quality check then prompts `y/n` — headless it throws `EOF`; pipe `printf 'y\n' |` or pass `--skip-quality-check`.
- `skill-seekers workflows` is broken (bad-arg dispatch) — use `skill-seekers-workflows <action>`. `--enhance-workflow` is `create`-only.
- You must `create` before `package`; packaging reads `output/<name>/SKILL.md`.
- Each platform needs its archive: Claude/OpenAI/markdown = `.zip`, Gemini = `.tar.gz`.
- `max_pages` defaults to **unlimited** (v2.6+); set it only to cap test runs.
- Check for `llms.txt` first — ~10x faster.
