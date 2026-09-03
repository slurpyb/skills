# Capabilities & Pitfalls

Read this before assuming what Skill Seekers can or can't do. Agents routinely
reach for a fraction of the toolkit and trip on a handful of recurring mistakes.

## Table of contents
- [Non-obvious capabilities](#non-obvious-capabilities-you-can-also)
- [Common mistakes](#common-mistakes)
- [Cost & API-key discipline](#cost--api-key-discipline)

---

## Non-obvious capabilities ("you can also…")

### It ingests 20+ source types — not just docs/repo/PDF
`create` auto-detects and handles:
- **Docs websites** (Docusaurus, GitBook, ReadTheDocs, …)
- **GitHub repos** (public/private) and **local directories** (codebases)
- **PDFs** (incl. scanned, via OCR; password-protected; tables)
- **Jupyter notebooks** (`.ipynb`)
- **OpenAPI / Swagger specs** (`--spec`/`--spec-url`, content-sniffed)
- **Word** (`.docx`), **EPUB** e-books, **PowerPoint** (`.pptx`)
- **AsciiDoc** (`.adoc`), **HTML** files
- **RSS / Atom feeds** (`.rss`/`.atom`)
- **man pages** (`.1`–`.8`/`.man`)
- **Video URLs** (YouTube / Vimeo — transcript-based)
- **Confluence** spaces (`--conf-base-url` + `--space-key`)
- **Notion** databases/pages (`--database-id` / `--page-id`)
- **Slack / Discord chat exports** (`--platform {slack,discord}` + `--chat-export-path`)
→ If someone has *any* of these, you can turn it into a skill. Don't say "I can only do docs."

### It outputs to 22+ targets — not just Claude
- **RAG / vector:** LangChain, LlamaIndex, Chroma, FAISS, Haystack, Qdrant, Weaviate, Pinecone, Atlas, Deepseek
- **AI platforms:** Claude, Gemini, OpenAI, Kimi, QWen, Together, Fireworks, OpenRouter, IBM Bob, Minimax
- **Generic:** Markdown
→ "Export this as LangChain documents" and "package for Claude" are both one `--target` parameter.

### Enhancement is FREE locally (and automatic)
When **no API key** is set, `create`/`enhance` run enhancement in LOCAL mode via the
coding-agent CLI (e.g. `claude`) — headless by default, no metered cost, same quality
as API mode. Lifts a raw 3/10 extraction to ~9/10. Mode is decided by key *presence*,
not a flag. Control depth with `--enhance-level 0–3` (0 skips). **LOCAL is the default.**

### `llms.txt` fast path (≈10x)
Many doc sites publish `/llms.txt` (pre-structured for LLMs). Skill Seekers
auto-detects and uses it. Check first: `curl https://docs.example.com/llms.txt`.

### Multi-source skills in one command
Combine docs + repo + PDF into one merged skill by defining all sources in a single
config (see config-schema.md), then pointing `create` at it:
```bash
skill-seekers create configs/multi.json     # or: create <src> --config configs/multi.json (additive)
```
(`create` has **no `--target`** — package the platform afterward. The old `unified`
subcommand is gone; a `.json` positional is auto-detected as a multi-source config.)

### Custom & chained enhancement workflows
Bundled presets: `default`, `minimal`, `complex-merge`, `security-focus`,
`architecture-comprehensive`, `api-documentation`, `accessibility-a11y`,
`component-library`, and dozens more. Chain them, or author your own YAML (see
`assets/enhance-workflow.template.yaml`). `--enhance-workflow` is **`create`-only**
(not on `enhance`):
```bash
skill-seekers create <src> --enhance-workflow minimal --enhance-workflow api-documentation
skill-seekers workflows add my-workflow.yaml   # list | show | copy | add | remove | validate
```

### Resumable, long-running jobs
Auto-checkpoints ~every 60s; survives network drops, rate-limit waits, crashes.
`resume --list`, `resume <job-id>`, `resume --clean`. Don't restart a big scrape from zero.

### Speed levers most people miss
- `create <docs> --async --workers 8` → ~3x faster docs scraping.
- `--skip-scrape` reuses cached `output/{name}_data/` (50% faster re-runs / re-packaging).
- `estimate` / `estimate_pages` before a big run to predict pages, time, and cost.
- `update <dir>` / `sync-config --config <f>` refresh an existing skill without a full rescrape.

### Deep codebase intelligence (C3.x)
Design-pattern detection, working examples mined from tests, auto how-to guides,
config security scan, architecture docs, Godot signal-flow — across 27+ languages.
See codebase-analysis.md. It can analyze a repo it has never seen and explain its architecture.

### Multi-profile GitHub tokens + rate-limit strategies
`config --github` manages personal/work profiles, each with a strategy: `prompt`,
`wait` (countdown), `switch` (auto-failover to another profile), or `fail` (CI).
Select per run with `github … --profile work`.

### Other handy moves
- **Driven entirely from inside Claude Code** via 40 MCP tools — no terminal needed.
- **Generate a config automatically** for an unknown site: MCP `generate_config`.
- **Split a huge skill** and **generate a router/hub skill** over sub-skills
  (`split_config` / `generate_router`).
- **CI/CD:** GitHub Action + Docker image (`skillseekers/skill-seekers`) to auto-refresh
  skills when docs/code change.
- **Manual upload needs no API key** — package locally, upload by hand at the platform UI.

---

## Lean-skill rules (the 200k token wall)

The final unified merge-enhance (Phase 6) puts every merged reference into ONE
prompt — ceiling ~200k tokens → HTTP 400. The deepest enhancement pass is lost when
that happens; a lighter fallback pass saves the skill, but at lower quality. Docs-only
≈ 30–50k per framework; docs+GitHub+C3.x balloons fast.

- **Token sinks, ranked:** `include_releases` ≫ C3.x config files ≫ repo markdown ≫ issues. Turn the first three off.
- **Don't merge 3+ doc sets into one skill** — bundle instead (one focused skill per framework + a small hand-written glue skill). Routes better too.
- **`estimate` the refs first.** Near 200k → split by skill (router) → shrink sources → chunk enhancement with a steering YAML run LOCAL (no single-prompt ceiling).
- **LOCAL beats API for rich inputs** (not just cheaper): reads every reference on disk, no single-prompt ceiling; API is one stateless prompt capped at `max_tokens`.
- **After every enhance, trim phantom references** — the enhancer invents `CHANGELOG.md`/`releases.md`/`issues.md` and counts ("27 open issues") not on disk.
- **`merged_api.md` is noise** when a source has both docs + code (raw conflict dump, bundler internals) — docs-only avoids it.
- **RAG tiers differ:** only Chroma/Weaviate embed turnkey via `upload`; Qdrant/Pinecone/FAISS/LangChain/LlamaIndex/Haystack format with `vector: null` (BYO embedder). RAG isn't needed for a normal Claude skill.

---

## Common mistakes

| Mistake | Reality |
| --- | --- |
| Reaching for `scrape` / `github` / `pdf` / `unified` / `validate` subcommands | **Gone in 3.6.** Every source funnels through **`create`** (positional auto-detect or a flag: `--url`/`--repo`/`--pdf`/`--config`/…). Validate a config with `estimate <config>` — `--dry-run` on `create` is a no-op that still runs a full scrape. |
| Passing `--enhance-workflow` to `enhance` | It's **`create`-only**. `enhance` flags: `--target --api-key --dry-run --agent --agent-cmd --interactive-enhancement --background --daemon --no-force --timeout`. Run a workflow via `create <src> --enhance-workflow …`. |
| Using `skill-seekers workflows <action>` | All workflow subcommands work: **`skill-seekers workflows list \| show \| copy \| add \| remove \| validate`**. |
| Expecting `create <localdir>` to emit usage docs | A local-path positional runs **C3.x codebase analysis** (dependency graph, patterns, API reference; dumps repo md into `documentation/`; may log "analyzed 0 files"). For a **usage/reference** skill, source the docs and construct them yourself. |
| `package` hangs / `EOF when reading a line` | `package` runs a quality check then prompts `Continue with packaging? (y/n)`. Headless that throws `EOF`. Pass `--yes` to skip the prompt, or `--skip-quality-check`. |
| `export ANTHROPIC_API_KEY=…` for a paid run | That **flips Claude Code itself to metered billing** (it reads the same var). Pass the key **inline** to the one command (`ANTHROPIC_API_KEY="$KEY" skill-seekers enhance …`) or use `--api-key`; then verify `[ -z "$ANTHROPIC_API_KEY" ]`. |
| `create … --target claude` | **`create` has no `--target`** (v3.6). It builds a neutral skill; set platform with `package --target claude\|gemini\|openai\|markdown` — never `anthropic`/`google`. |
| `create --config x.json` alone | Errors **"No source provided"** — `--config` only *layers onto* a source. Pass the config as the **positional** (`create x.json`). |
| Looking for `--enhance-mode`/`--mode`/`--provider` | None exist. Mode = **API-key presence** (no key → LOCAL). Depth = `--enhance-level 0–3`; preset = `-p`. Force API: `enhance <dir> --target claude`. |
| Using `--comprehensive` / `--depth` | It's `-p comprehensive` now; `--depth` is **deprecated**. Comprehensive C3.x can take 20–60 min — `estimate` first, rely on `resume`. |
| Scraping a repo with no token | Unauth GitHub API = 60/hr and **403s within minutes**. Set `GITHUB_TOKEN`, or `git clone --depth 1` then `create ./localdir` (git protocol — no API limit). |
| Assuming `create --repo …` uses the configured GitHub profile | Observed (v3.6): even with a valid default profile **and** `--profile personal`, the scraper logs "No GitHub token provided" and 403s. Pass the token via **`GITHUB_TOKEN` env** (or `--token`). The config token works for `config --test` but is **not** wired into scraping. |
| Trusting `config --show`/`config --test` for key *validity* | They only check **presence**, never validity — a 15-char dummy shows "✅ Set / configured" while the real API returns **401**. Verify with a real probe (e.g. Anthropic `GET /v1/models` with `x-api-key`). |
| Running `config --test` in a script | It's **interactive** ("Press Enter to continue") and throws `EOF` non-interactively. Inspect keys by reading `~/.config/skill-seekers/config.json` instead. |
| Trusting a "comprehensive" local run blindly | Observed: `-p comprehensive` on a local dir ran at **`surface`** depth and logged **`Files Analyzed: 0`** + empty dependency graph, while pattern/test/config extraction still worked. Check the log; don't assume the AST/dep graph populated. |
| Expecting a usage guide from `create <repo>` | It generates a skill about the codebase's **internals** (patterns, test examples, architecture) — not "how to use the tool." For a usage skill, source the **docs**. |
| Packaging before building | `package`/`upload` read `output/<name>/SKILL.md`. Run `create` first. |
| Wrong archive per platform | Claude/OpenAI/markdown → `.zip`; **Gemini → `.tar.gz`**. Wrong one fails upload. |
| Expecting `max_pages` to default small | Since v2.6 it defaults to **unlimited**. Set it to cap test runs, not the reverse. |
| Assuming an API key is required | Enhancement runs free locally; upload can be done manually in the browser. |
| Nav-only / empty doc extraction | Wrong `selectors`. Inspect the page; set `main_content`. For JS/SPA sites add `--browser`. |
| Re-scraping after a crash | Use `resume <job-id>` — checkpoints already exist. |
| Forgetting platform/source extras | e.g. Gemini/OpenAI need `[gemini]`/`[openai]`; docx/epub/video/notebook/rss need their optional deps (`doctor` lists what's missing). |
| Slow scrape accepted as normal | Check for `llms.txt`; add `--async --workers N`. |
| Bad skill name in config | Must match `^[a-z0-9-_]+$` (lowercase, hyphens/underscores). |

---

## Cost & API-key discipline

Default to zero-cost operation (there is no `--enhance-mode`/`--mode` flag — mode is
decided by API-key presence):
- **Enhancement:** keep it LOCAL by setting no API key (or skip with `--enhance-level 0`).
- **Upload:** prefer manual browser upload; only use `upload` (or a forced
  `enhance --target …`) with the user's explicit approval for that run, since it
  consumes metered API quota.
- **`merge_mode: claude-enhanced`** and `ai_mode: api` also incur cost — prefer
  `rule-based` / `local` / `none` unless told otherwise.
- **Never `export` a paid API key** for a run — Claude Code reads `ANTHROPIC_API_KEY`
  too and will switch to metered billing. Pass it inline / via `--api-key` only.
- Run `estimate` / `estimate_pages` before anything long or potentially billable.
