---
name: skill-seekers
description: |
  Turn documentation sites, GitHub repos, PDFs, local codebases, and 20+ other
  source types into structured AI skills and RAG knowledge with the Skill Seekers
  toolkit (`skill-seekers` CLI + 40-tool MCP server). Use when the user wants to:
  build/create an AI skill from docs, a repo, or a PDF; "scrape these docs into a
  skill"; convert a codebase into Claude/Cursor/LangChain knowledge; generate RAG
  documents; author or validate a scraping config; run C3.x codebase/pattern
  analysis; or package/upload a skill to Claude, Gemini, OpenAI, or a vector DB.
  Also triggers on "skill-seekers", "skill seekers", and the
  skill-seekers MCP tools. Emphasizes FREE local enhancement (no API key) and the
  many non-obvious source types and output formats agents overlook.
  
  Verified facts for the installed version live in docs/skill-seekers.md at the repo root; it wins on any conflict.
---

# Skill Seekers Toolkit

Skill Seekers extracts knowledge from a source, analyzes/organizes it, optionally
AI-enhances it, and packages it for an AI platform. Driven two ways:

- **CLI** — `skill-seekers <command>` (this is what you run from a terminal).
- **MCP server** — 40 tools callable by natural language from inside Claude Code,
  Cursor, etc. Ships as an extra and is often absent; `doctor` reports it present
  either way. Confirm it before planning around it — see
  [Using the MCP server](#using-the-mcp-server).

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

**LOCAL is higher quality for rich inputs, not just cheaper.** It's a coding agent
that reads every reference on disk with no 200k ceiling; API is one stateless prompt
capped at `max_tokens` (same baseline run: LOCAL 240 lines vs API 166, truncated).
Reserve API for a quick single-source polish when a key is approved.

**After every enhance: trim phantom references.** The enhancer fabricates an
"Available References" list + counts on every run — it invents `CHANGELOG.md`,
`releases.md`, `issues.md`, "27 open issues" that aren't on disk. Delete any bullet
whose file doesn't exist; spot-check snippets against real source (~90% right,
confidently wrong on the rest — matters for linters/parsers).

**Billing safety:** Claude Code itself reads `ANTHROPIC_API_KEY` and will flip from
your subscription to metered API billing if it's set in the environment. If the user
approves a paid run, **never `export` the key** — pass it **inline** to that one
command (`ANTHROPIC_API_KEY="$KEY" skill-seekers enhance … --target claude`, or
`--api-key`), then confirm `[ -z "$ANTHROPIC_API_KEY" ]`.

## The 200k token wall — what silently ruins big skills

The final step (Phase 6, the unified merge-enhance) stuffs every merged reference
into ONE prompt. Hard ceiling ~200k tokens → HTTP 400. When that happens the deepest
enhancement pass is lost; a lighter fallback pass then saves the skill, but at lower
quality than intended. Docs-only ≈ 30–50k per framework; docs+GitHub+C3.x balloons fast.

- Token sinks, ranked: `include_releases` ≫ C3.x config files ≫ repo markdown ≫ issues. Turn the first three off for a lean skill.
- Don't merge 3+ doc sets into one skill — you'll breach 200k. Bundle instead: one focused skill per framework + a small hand-written glue skill for the seams. It routes better too (Claude picks a skill by name+description, then loads its whole context).
- `estimate` the refs first. Under ~50k → just build. Near 200k → split by skill (router), shrink sources (scope `file_patterns`, kill `include_releases`), then chunk enhancement with a steering YAML run LOCAL (no single-prompt ceiling).

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
skill-seekers create configs/react.json
for t in claude gemini openai markdown; do skill-seekers package output/react/ --target "$t"; done
```

**Custom site (no preset config):** author a config, validate, then build.
```bash
skill-seekers estimate configs/mysite.json     # non-destructive: loads+validates config, resolves URLs
skill-seekers create  configs/mysite.json       # config is POSITIONAL; --config only *layers onto* a source
```
Schema + a fill-in template: [references/config-schema.md](references/config-schema.md),
`assets/unified-config.template.json`.

**Steering workflows (enhancement passes):** apply a YAML workflow or bundled preset
during `create` (repeatable; `create`-only — not on `enhance`). Preview with
`--workflow-dry-run`. Access workflows with `skill-seekers workflows`.
```bash
skill-seekers create <src> --enhance-workflow security-focus --enhance-workflow api-documentation
skill-seekers workflows list                  # presets + yours
```

## Using the MCP server

Only use a named MCP/tool if it is present in this session. If the Skill Seekers MCP server, Context7, fetch, or similar are missing, skip them and use available tools (the CLI in this skill). Never invent results from a tool that did not run.

**Check that it is actually installed before planning around it.** `skill-seekers
doctor` reports `MCP server — Importable ✅` even when the `mcp` package is absent,
because it only attempts the import. The honest check runs the module:

```bash
python -m skill_seekers.mcp.server_fastmcp    # "mcp package not installed" = it is not there
pip install 'skill-seekers[mcp]'              # the fix
```

With the server connected, prefer driving it by natural language ("Analyze
facebook/react", "Scrape the Vue docs into a skill", "Validate my config") rather
than shelling out — same engine, no terminal. Setup (stdio for Claude Code, HTTP for
Cursor/Windsurf) and all 40 tools: [references/mcp-tools.md](references/mcp-tools.md).

Without it, every capability here is reachable through the CLI, which is the path the
rest of this skill documents. The MCP tools are a surface over the same engine, not
extra functionality.

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
- 3.6 removed `scrape`/`github`/`pdf`/`unified`/`validate` — **everything is `create`**. `--dry-run` on `create` is a **no-op that still runs a full real scrape** — validate/preview with `skill-seekers estimate <config>`.
- `create <localdir>` does **codebase analysis** (C3.x internals), not usage docs — for a usage skill, source the docs and construct them yourself.
- `package` runs a quality check then prompts `y/n` — headless it throws `EOF`; pass `--yes` or `--skip-quality-check`.
- `--enhance-workflow` is `create`-only; access workflows with `skill-seekers workflows <action>`.
- You must `create` before `package`; packaging reads `output/<name>/SKILL.md`.
- Each platform needs its archive: Claude/OpenAI/markdown = `.zip`, Gemini = `.tar.gz`.
- `max_pages` defaults to **unlimited** (v2.6+); set it only to cap test runs.
- Check for `llms.txt` first — ~10x faster. But if the site's `llms-full.md` is huge, set `skip_llms_txt: true` per source — it can bloat the enhance prompt and poison enhancement quality.
