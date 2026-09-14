# CLI Command Reference

Complete flag reference for the `skill-seekers` CLI. All commands support
`--help`, `--name`, `--output DIR`, and `--config CONFIG` where relevant.

## Table of contents
- [create](#create) — unified one-shot (auto-detects source; the ONLY source entry point in 3.6)
- [Source types (all via `create`)](#source-types-all-via-create) — docs / GitHub / PDF / local code / 14+ more
- [enhance](#enhance) — AI enhancement
- [package](#package) — platform packaging
- [upload](#upload) — deploy to platform
- [config](#config) — tokens/keys/settings wizard
- [resume](#resume) — resume interrupted jobs
- [workflows (steering / enhancement)](#workflows-steering--enhancement) — presets, YAML schema, dispatch bug
- [utility](#utility-commands) — doctor, estimate, quality, update, multilang, …
- [Billing safety (paid API key)](#billing-safety-paid-api-key) — inline-key pattern

---

## create

The primary entry point — and, since **3.6**, the **only** source entry point. The
old `scrape` / `github` / `pdf` / `unified` subcommands no longer exist; every source
type funnels through `create` (auto-detected from the positional source, or selected
with a flag). Auto-detects source type and runs extract → analyze → organize →
enhance → package.

```bash
skill-seekers create <source> [options]
```

**Source auto-detection order:** file extension (`.pdf .docx .epub .ipynb .html
.pptx .adoc .rss .atom .yaml/.yml` [OpenAPI sniffed] `.1`–`.8`/`.man`) → video URL
(YouTube/Vimeo) → directory (local codebase) → `owner/repo` or `github.com` →
http(s) URL → bare domain (inferred docs).

| Flag | Description |
| --- | --- |
| `-p, --preset <quick\|standard\|comprehensive>` | Analysis depth: quick 1–2m, standard 5–10m, comprehensive 20–60m |
| `--enhance-level <0-3>` | AI enhancement depth (0=skip). Runs LOCAL unless an API key is set |
| `--enhance-workflow <name\|file>` | Workflow preset (repeatable): `minimal`, `security-focus`, `api-documentation`, `architecture-comprehensive` |
| `--agent <name>` / `--agent-cmd <cmd>` | LOCAL enhancement agent (`claude`, `kimi`, `codex`, …) / custom command |
| `--repo OWNER/REPO` / `--token` / `--profile` | GitHub source + auth (or just let `<source>` auto-detect) |
| `--local-repo-path PATH` | Analyze an already-cloned repo — skips re-clone + file fetches, but still makes one `GET /repos/…` call (token advised) |
| `--browser` | Playwright rendering for JS/SPA sites |
| `--url URL` / `--max-pages N` | Doc source URL / page cap (default unlimited) |
| `--ocr` / `--pages "1-50"` | PDF OCR / page range |
| `--config FILE` / `--from-json PATH` | Multi-source unified config / prebuilt JSON |
| `--name <name>` / `--output DIR` | Skill name / output location |
| `--async --workers N` | Faster doc scraping |

> **No `--target` on `create`** (v3.6) — it builds a platform-neutral skill; package
> to a platform afterward with `package --target …`. `--depth` is **deprecated** → use `-p`.
> Per-source-type flags: `--pdf --docx --epub --pptx --notebook --spec/--spec-url
> --asciidoc-path --html-path --feed-url/--feed-path --man-path/--man-names
> --video-url/--video-file --conf-base-url/--space-key` (Confluence)
> `--database-id/--page-id` (Notion) `--platform {slack,discord} --chat-export-path`.

```bash
skill-seekers create https://react.dev -p standard
skill-seekers create owner/repo -p comprehensive          # GITHUB_TOKEN strongly recommended
skill-seekers create ./manual.pdf -p standard --ocr --pages "1-50"
skill-seekers create ./my-project -p comprehensive        # local dir → C3.x
skill-seekers package output/react/ --target claude       # choose platform here
```

---

## Source types (all via `create`)

Before 3.6 these were separate subcommands (`scrape`, `github`, `pdf`, `unified`).
They are **gone** — each is now a `create` flag (or auto-detected from the positional
`<source>`). Map a source to the right flag:

| Source | How `create` reaches it | Key flags |
| --- | --- | --- |
| Docs website | auto from URL, or `--url URL` | `--max-pages N`, `--browser` (JS/SPA), `--async --workers N` |
| GitHub repo | auto from `owner/repo`, or `--repo OWNER/REPO` | `--token` / `--profile`, `--max-issues N`, `--no-issues/--no-changelog/--no-releases` |
| Local clone of a repo | `--local-repo-path PATH` | skips re-clone/file fetches; still makes one `GET /repos/…` call (token advised). Fully API-free path = a **directory positional** (`create ./localdir`) |
| PDF | auto from `file.pdf`, or `--pdf PATH` | `--ocr`, `--pages "1-50"` |
| Local codebase (dir) | positional path, or `--directory DIR` | runs C3.x — see note below; `--languages`, `--file-patterns` |
| Word / EPUB / PPTX | `--docx` / `--epub` / `--pptx PATH` | — |
| Jupyter / HTML | `--notebook PATH` / `--html-path PATH` | — |
| OpenAPI / Swagger | `--spec PATH` / `--spec-url URL` | content-sniffed for `.json`/`.yaml` |
| AsciiDoc | `--asciidoc-path PATH` | — |
| RSS / Atom | `--feed-url URL` / `--feed-path PATH` | — |
| man pages | `--man-path PATH` / `--man-names "git,curl"` | — |
| Video (YouTube/Vimeo) | auto from a video URL, or `--video-url` / `--video-file` | `--visual`, `--whisper-model` |
| Confluence / Notion | `--conf-base-url`+`--space-key` / `--database-id`+`--page-id` | — |
| Slack / Discord export | `--platform {slack,discord}` + `--chat-export-path` | — |
| Multiple sources at once | a `.json` config positional (auto-detected) or `--config FILE` | additive — merges sources into one skill |

> `--config FILE` is **additive** ("Load additional settings from JSON file") — it
> layers on top of a source; a bare `.json` positional is auto-detected as a
> (multi-source) config. `--from-json PATH` (build from pre-extracted JSON, skip
> scraping) is supported **only** by PDF, Video, Jupyter, HTML, OpenAPI, AsciiDoc,
> PPTX, RSS, Manpage, Confluence, Notion, Chat — **not** docs/github/generic sources.

> **`create <localdir>` does CODEBASE analysis, not docs scraping.** A local-path
> positional triggers C3.x (`codebase_scraper`): dependency graph, design patterns,
> API reference, test-mined examples — and dumps the repo's markdown into
> `documentation/`. It may even report "Successfully analyzed 0 files". To build a
> **usage / reference** skill from local material you must construct the docs
> yourself; don't expect `create <localdir>` to emit usage docs.

```bash
skill-seekers create https://react.dev -p standard            # docs (auto)
skill-seekers create owner/repo -p comprehensive              # GitHub (GITHUB_TOKEN recommended)
skill-seekers create --local-repo-path /tmp/repo -p comprehensive  # local clone, no API
skill-seekers create ./manual.pdf --ocr --pages "1-50"        # PDF (auto)
skill-seekers create ./my-project -p comprehensive            # local dir → C3.x codebase analysis
skill-seekers create configs/multi.json                       # multi-source config (auto)
```

Per-source extra deps (docx/epub/video/notebook/rss, `[gemini]`/`[openai]` packaging)
are listed by `skill-seekers doctor`.

---

## enhance

```bash
skill-seekers enhance <skill_dir> [OPTIONS]
```

Mode is **auto-selected**: API mode when a key is in env
(`ANTHROPIC_API_KEY`→claude, `GOOGLE_API_KEY`→gemini, `OPENAI_API_KEY`→openai,
`MOONSHOT_API_KEY`→kimi); otherwise LOCAL mode via the coding-agent CLI. There is
**no `--mode`/`--provider`/`--quality` flag** (v3.6).

| Flag | Description |
| --- | --- |
| `--target <platform>` | Force API platform (requires that platform's key) |
| `--api-key KEY` | Provide the key inline instead of env |
| `--agent <name>` / `--agent-cmd <cmd>` | LOCAL agent / custom command template |
| `--background` / `--daemon` | Run async / as a daemon |
| `--interactive-enhancement` | Open a terminal window (default: **headless**) |
| `--timeout SECONDS` | Default 45 min (`SKILL_SEEKER_ENHANCE_TIMEOUT`) |
| `--dry-run` | Preview what would be enhanced without calling AI |

```bash
skill-seekers enhance output/react/                    # LOCAL (free) when no key set
skill-seekers enhance output/react/ --background       # headless, async
skill-seekers enhance output/react/ --target claude    # force API — needs ANTHROPIC_API_KEY, PAID
```

Enhancement writes `SKILL.md.backup` (+ `references/*.md.backup`); restore with `cp`.
It reads all reference files for context, then rewrites `SKILL.md`.

> **`--enhance-workflow` is NOT available on `enhance`.** Steering/enhancement
> workflows (`--enhance-workflow`, `--enhance-stage`, `--var`, `--workflow-dry-run`)
> live **only** on `create`. To run a workflow against existing material, re-run
> `create <source> --enhance-workflow …`. See [workflows](#workflows-steering--enhancement).

---

## package

```bash
skill-seekers package INPUT_DIR [--target PLATFORM] [--output FILE]
```

`--target` ∈ `atlas` | `chroma` | `claude` (default) | `deepseek` | `faiss` | `fireworks` | `gemini` | `haystack` | `ibm-bob` | `kimi` | `langchain` | `llama-index` | `markdown` | `minimax` | `openai` | `opencode` | `openrouter` | `pinecone` | `qdrant` | `qwen` | `together` | `weaviate`.

| Target | Archive | Entry file | Use for |
| --- | --- | --- | --- |
| claude | `.zip` | `SKILL.md` (YAML frontmatter) | Claude Code/Desktop/claude.ai |
| gemini | `.tar.gz` | `system_instructions.md` | Google AI Studio |
| openai | `.zip` | `assistant_instructions.txt` + vector store | ChatGPT/Assistants |
| markdown | `.zip` | plain markdown + `manifest.json` | any LLM / offline |
| RAG/vector targets (chroma, faiss, qdrant, weaviate, pinecone, langchain, etc.) | `.zip` | Vectorized data + metadata | Vector DBs / RAG pipelines |

Platform size caps: Claude ~25 MB, Gemini ~100 MB, OpenAI ~512 MB vector store.

> **`package` runs a quality check, then prompts `Continue with packaging? (y/n)`.**
> In non-interactive/headless use, pass `--yes` to skip the prompt, or `--skip-quality-check`.
>
> ```bash
> skill-seekers package output/react/ --target claude --yes --no-open
> skill-seekers package output/react/ --target claude --skip-quality-check --no-open
> ```

---

## upload

```bash
skill-seekers upload PACKAGE_FILE [--target PLATFORM]
```

`--target` ∈ `claude` | `gemini` | `openai`. **Requires the matching API key and
consumes metered quota — get user approval first.**

| Platform | Env key | Manual fallback |
| --- | --- | --- |
| claude | `ANTHROPIC_API_KEY` (`sk-ant-…`) | https://claude.ai/skills |
| gemini | `GOOGLE_API_KEY` (`AIza…`) | https://aistudio.google.com/ |
| openai | `OPENAI_API_KEY` (`sk-proj-…`) | https://platform.openai.com/assistants/ |

Manual upload needs no key — prefer it when avoiding API usage.

---

## config

Interactive wizard. Stores `~/.config/skill-seekers/config.json` (chmod 600).

| Flag | Action |
| --- | --- |
| `--github` | Manage GitHub token profiles (personal/work/…) |
| `--api-keys` | Set Anthropic/Google/OpenAI keys |
| `--show` | Display config (keys masked) |
| `--test` | Test all tokens/keys/connectivity |
| `--welcome` | Re-run the welcome wizard |

GitHub rate-limit strategies per profile: `prompt` (default) | `wait` | `switch`
| `fail`. Select a profile per run with `github … --profile work`. Env vars
(`GITHUB_TOKEN`, `ANTHROPIC_API_KEY`, …) are used as fallback when not in config.

---

## resume

Auto-checkpoints every ~60s; survives network drops, rate-limit waits, crashes.

```bash
skill-seekers resume --list          # show resumable jobs
skill-seekers resume <job-id>        # continue from checkpoint
skill-seekers resume --clean         # delete old job files
```

---

## workflows (steering / enhancement)

A *steering workflow* is a sequence of enhancement stages (YAML) applied to a skill,
or a bundled preset name. Apply one with `create <source> --enhance-workflow <name|file>`
(repeatable/chainable; `create`-only — **not** on `enhance`). Preview the stages with
`--workflow-dry-run`. Add inline stages with `--enhance-stage 'name:prompt'` and
override variables with `--var key=value`.

```bash
skill-seekers workflows list                 # bundled presets + your user workflows
skill-seekers workflows show security-focus  # print a workflow's YAML
skill-seekers workflows copy <name>          # copy a bundled preset into your user dir
skill-seekers workflows add ./my.yaml        # install a custom workflow
skill-seekers workflows remove <name>        # delete a user workflow
skill-seekers workflows validate ./my.yaml   # validate YAML structure
```

User workflows live in `~/.config/skill-seekers/workflows/`. Many bundled presets
exist: `default`, `minimal`, `complex-merge`, `security-focus`,
`architecture-comprehensive`, `api-documentation`, `accessibility-a11y`,
`component-library`, and dozens more (`skill-seekers-workflows list`).

**Workflow YAML schema** (see `assets/enhance-workflow.template.yaml`):

```yaml
name: my-workflow
description: What this workflow produces
variables: { framework: React }        # optional; interpolate as {framework} in prompts
stages:
  - name: security-pass
    prompt: "Audit {framework} usage for security issues and document them."
    target: skill_md                   # optional (e.g. skill_md)
    uses_history: false                # optional; pass prior stage output as context
    type: builtin                      # optional: builtin | custom
    model: claude                      # optional
```

Stages run **sequentially**; `{var}` placeholders interpolate from `variables` (or
`--var`). Apply with `create <source> --enhance-workflow ./my-workflow.yaml`, preview
with `--workflow-dry-run`.

A multi-source **config** may *also* embed workflow data at the top level:
`workflows: [...]`, `workflow_stages: [...]`, and `workflow_vars: {...}`. Those are
consumed when the config is passed via `create --config <f>`.

---

## Utility commands

| Command | Purpose |
| --- | --- |
| `skill-seekers doctor` | Diagnose install (Python, git, Claude Code, keys, optional deps) |
| `skill-seekers estimate [config]` | Estimate page count before scraping (`--all` lists configs) |
| `skill-seekers quality <dir>` | Score SKILL.md quality (`--report`, `--threshold`) |
| `skill-seekers enhance-status <dir>` | Monitor a background/daemon enhancement (`--watch`, `--json`) |
| `skill-seekers install --config <config>` | Complete workflow: fetch → scrape → enhance → package → upload |
| `skill-seekers install-agent <dir> --agent <name>` | Copy a skill into an agent's dir (claude, cursor, vscode, amp, goose, opencode, kimi-code, bob, all) |
| `skill-seekers extract-test-examples [dir]` | Mine real API usage examples from test files |
| `skill-seekers sync-config --config <f> [--apply]` | Diff a config's `start_urls` against the live docs nav; `--apply` writes them back |
| `skill-seekers stream <input_file>` | Ingest a very large doc file chunk-by-chunk (memory-efficient) |
| `skill-seekers update <dir> [--check-changes]` | Incrementally update a docs skill without a full rescrape |
| `skill-seekers multilang <dir>` | Multi-language docs scraping/organization (`--languages`, `--detect`) |

> **No `validate` / `convert` / `unified` subcommands in 3.6.** To validate a config,
> run `skill-seekers estimate <f>` — `--dry-run` on `create` is a no-op that still runs a full scrape.
> Multi-source builds are just `create --config <f>` (or a `.json` positional).

CI/CD: pass `--non-interactive` so rate limits fail fast (no prompts) with clear
exit codes; supply secrets via env vars.

---

## Billing safety (paid API key)

skill-seekers keys API enhancement off `ANTHROPIC_API_KEY`. **Claude Code itself also
reads `ANTHROPIC_API_KEY`** and will switch from your subscription to **metered API
billing** if it is set in the environment. So to use a paid API key for skill-seekers
**without** flipping Claude Code to metered, **never `export` it** / put it in your
profile — pass it **inline** to the single command only:

```bash
ANTHROPIC_API_KEY="$YOUR_KEY" skill-seekers enhance output/skill/ --target claude
ANTHROPIC_API_KEY="$YOUR_KEY" skill-seekers create <src> --enhance-workflow security-focus
# or use the flag instead of the env var:
skill-seekers enhance output/skill/ --target claude --api-key "$YOUR_KEY"
```

Afterwards, confirm the env is clean: `[ -z "$ANTHROPIC_API_KEY" ] && echo "safe"`.
