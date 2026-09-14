# Configuration Schema Reference

The unified config (v2.6.0+, JSON) describes one or more sources that merge into a
single skill. Legacy single-source configs still work and auto-convert.

A fill-in skeleton lives at `assets/unified-config.template.json`.

> **3.6: no `validate` subcommand.** Validate a config (and preview the plan) with
> `skill-seekers create --config <file> --dry-run`. `create --config` is **additive**
> — it layers the config onto a source; a bare `.json` positional is auto-detected as
> a multi-source config. A config may also carry top-level **`workflows`**,
> **`workflow_stages`**, and **`workflow_vars`** (steering/enhancement stages — see
> [cli-commands.md](cli-commands.md#workflows-steering--enhancement)), consumed when
> the config is passed to `create`.

## Table of contents
- [Top-level fields](#top-level-fields)
- [Documentation source](#documentation-source)
- [GitHub source](#github-source)
- [PDF source](#pdf-source)
- [Worked examples](#worked-examples)
- [Legacy migration](#legacy-migration)
- [Authoring best practices](#authoring-best-practices)

---

## Top-level fields

| Field | Req | Notes |
| --- | --- | --- |
| `name` | ✅ | Skill id + filename. Pattern `^[a-z0-9-_]+$` (lowercase, hyphens/underscores). |
| `description` | ✅ | 1–2 sentences; say *when to use* the skill. Shows in metadata/gallery. |
| `sources` | ✅ | Array, ≥1. Types: `documentation`, `github`, `pdf`. Order = merge priority. |
| `merge_mode` | — | `rule-based` (default, deterministic) or `claude-enhanced` (AI merge). |

```json
{ "name": "react", "description": "React docs + codebase. Use when building React apps.",
  "merge_mode": "rule-based", "sources": [ /* … */ ] }
```

---

## Documentation source

Required: `type: "documentation"`, `base_url` (with scheme).

| Field | Default | Purpose |
| --- | --- | --- |
| `extract_api` | false | Pull API-reference sections separately |
| `start_urls` | — | Explicit seed URLs (bypasses auto-discovery) |
| `selectors` | — | `{ main_content, title, code_blocks }` CSS selectors |
| `url_patterns` | — | `{ include: [...], exclude: [...] }` path filters |
| `categories` | — | `{ name: [keywords] }` for organization + merging |
| `rate_limit` | — | Seconds between requests (start 0.5) |
| `max_pages` | unlimited | Cap pages. Omit / `null` / `-1` = unlimited (the default since v2.6) |

```json
{
  "type": "documentation",
  "base_url": "https://docs.astro.build/en/",
  "extract_api": true,
  "start_urls": ["https://docs.astro.build/en/getting-started/"],
  "selectors": { "main_content": "article", "title": "h1", "code_blocks": "pre code" },
  "url_patterns": { "include": ["/en/getting-started/", "/en/guides/"], "exclude": ["/en/blog/"] },
  "categories": { "getting_started": ["getting-started", "install"], "integrations": ["integrations"] },
  "rate_limit": 0.5
}
```

> **Finding the right `selectors`:** scrape one page first and inspect which wrapper
> holds the body (often `article`, `.md-content`, `div.document`, `main`). Wrong
> selectors yield nav-only extractions.

---

## GitHub source

Required: `type: "github"`, `repo` (`owner/repo`).

| Field | Default | Purpose |
| --- | --- | --- |
| `enable_codebase_analysis` | false | Turn on C3.x AST analysis |
| `code_analysis_depth` | — | `surface` \| `deep` \| `full` (see codebase-analysis.md) |
| `fetch_issues` | false | Include issues |
| `max_issues` | — | Cap issue count (needs `fetch_issues`) |
| `fetch_changelog` | false | Extract CHANGELOG.md |
| `fetch_releases` | false | Include releases |
| `file_patterns` | — | Globs to analyze, e.g. `["src/**/*.ts"]` |
| `ai_mode` | — | `auto` \| `api` \| `local` \| `none` (prefer `local`/`none` to avoid API cost) |

```json
{
  "type": "github", "repo": "tiangolo/fastapi",
  "enable_codebase_analysis": true, "code_analysis_depth": "deep",
  "fetch_issues": true, "max_issues": 50,
  "file_patterns": ["fastapi/**/*.py"], "ai_mode": "local"
}
```

---

## PDF source

Required: `type: "pdf"`, `path` (local or URL).

| Field | Default | Purpose |
| --- | --- | --- |
| `ocr` | false | OCR scanned PDFs (needs Tesseract) |
| `password` | — | Decrypt protected PDFs |
| `extract_tables` | false | Structured table extraction |
| `parallel` | false | Parallel page processing (~3x faster) |

```json
{ "type": "pdf", "path": "/docs/manual.pdf", "ocr": true, "extract_tables": true, "parallel": true }
```

---

## Worked examples

**Single docs source:**
```json
{ "name": "vue", "description": "Vue 3 docs for reactive web apps.",
  "sources": [ { "type": "documentation", "base_url": "https://vuejs.org/guide/",
    "selectors": { "main_content": "article", "title": "h1", "code_blocks": "pre code" },
    "rate_limit": 0.5 } ] }
```

**Docs + GitHub (merged):**
```json
{ "name": "fastapi",
  "description": "FastAPI docs + codebase. Use for high-performance Python APIs.",
  "merge_mode": "rule-based",
  "sources": [
    { "type": "documentation", "base_url": "https://fastapi.tiangolo.com/",
      "extract_api": true, "selectors": { "main_content": ".md-content", "title": "h1", "code_blocks": "pre code" },
      "categories": { "getting_started": ["tutorial", "first-steps"], "advanced": ["security", "database"] },
      "rate_limit": 0.5 },
    { "type": "github", "repo": "tiangolo/fastapi", "enable_codebase_analysis": true,
      "code_analysis_depth": "deep", "fetch_issues": true, "max_issues": 50,
      "file_patterns": ["fastapi/**/*.py"] } ] }
```

Run a config-based build with `skill-seekers create --config <file>` (single- or
multi-source — the old `scrape`/`unified` subcommands are gone in 3.6).

---

## Legacy migration

Legacy = single-source flat config (`base_url`/`selectors` at top level). They still
auto-convert at load time. (The `convert` subcommand is gone in 3.6 — there's no
standalone conversion step.) To migrate by hand, wrap the old body inside
`sources: [ { "type": "documentation", … } ]` and add a `description`.

---

## Authoring best practices

- **Name:** lowercase-hyphenated, descriptive (`godot-game-engine`, not `godot`).
- **Order sources by authority:** official docs first, then GitHub, then PDFs.
- **Rate limit:** 0.5–1.0s official sites; 1.0–2.0s community sites.
- **Page limits:** leave unlimited for full coverage; cap only for test runs.
- **Code analysis:** `deep` for most repos; `full` only for critical frameworks;
  always scope `file_patterns` to relevant dirs.
- **merge_mode:** `rule-based` for predictable output; `claude-enhanced` for messy/
  overlapping sources (uses AI — confirm cost expectations).
- Validate with `create --config <file> --dry-run`, or paste into the web validator
  at skillseekersweb.com/configs.
