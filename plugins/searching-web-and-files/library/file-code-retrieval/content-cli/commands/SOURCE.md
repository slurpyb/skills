---
name: content-cli-commands
description: >-
  Full command reference for content-cli — every subcommand with complete
  syntax, all flags, types, defaults, and worked examples. Use when user
  needs full flag reference, is writing a command with unfamiliar options,
  or needs syntax for a specific subcommand.
---

# content-cli — Full Command Reference

Format flags (`--json` / `--human` / `--md` / `--csv` / `--full`) are GLOBAL — they go before the subcommand. Subcommand-local flags come after.

```
content-cli [GLOBAL] <subcommand> [SUBCOMMAND_FLAGS]
```

---

## Global Flags (root callback)

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--json` | bool | true | Compact JSON output. Default if no format flag set. |
| `--human` | bool | false | Pretty-printed Python repr for terminal inspection. |
| `--md` | bool | false | Markdown ready to paste into another LLM prompt. |
| `--csv` | bool | false | CSV (legacy `inspo` cmds only). |
| `--full` | bool | false | Include all fields, not just essentials. |
| `--help` | — | — | Show top-level help. |

Mutual exclusivity: at most one of `--json` / `--human` / `--md` / `--csv` per call. Multiple → exit 2.

---

## `content-cli` (bare, no subcommand)

Returns top-level orientation envelope.

```bash
content-cli
```

Response:

```json
{
  "ok": true,
  "data": {
    "tool": "content-cli",
    "purpose": "Semantic search engine over the bundled brand intelligence...",
    "verbs": [{ "verb": "research", "use_when": "...", "example": "content-cli research \"primal muesli\"" }],
    "tables": ["corpus","collections","reviews","recipes","skus","ingredients","profiles","scrapes","spyfu","doctrine"],
    "format_flags": "Pass --json (default) / --human / --md BEFORE the verb."
  },
  "agent_instructions": "Read AGENTS.md for the operating contract. Use `research` to query..."
}
```

---

## `research` — semantic search

Hybrid BM25 + 768d vector search across 10 tables.

```
content-cli [GLOBAL] research [QUERY] [--in TABLES] [--filter SQL] [--limit N] [--with-provenance]
```

### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `QUERY` | str (positional) | — | What to search for. Omit for orientation envelope. |
| `--in` | str | all 10 tables | Comma-separated tables (no spaces). |
| `--filter` | str | — | LanceDB SQL filter on structured columns. |
| `--limit` | int | 5 | Per-table top-K. |
| `--with-provenance` | bool | false | Include `source_path` + `source_sha256` per match. |

### Available `--in` Tables

`corpus,collections,reviews,recipes,skus,ingredients,profiles,scrapes,spyfu,doctrine`

### Examples

```bash
# Bare — orientation
content-cli research

# Default — all 10 tables, top-5 each
content-cli research "primal muesli"

# Single table
content-cli research "raw honey" --in doctrine

# Multiple tables
content-cli research "muesli" --in collections,reviews,profiles --limit 3

# SQL filter (LanceDB syntax — single-quote string values)
content-cli research "muesli" --filter "domain='themueslifolk.com.au'"
content-cli research "" --in reviews --filter "rating=5.0" --limit 10
content-cli research "" --in collections --filter "handle LIKE '%muesli%'"

# Audit trail
content-cli research "muesli" --with-provenance

# Format flag goes BEFORE
content-cli --human research "Mark Rockley" --in corpus
content-cli --md research "MCT coconut oil" --in ingredients
```

---

## `debug` — operator-only introspection

Hidden from `--help` by default. Subcommands:

```
content-cli debug source <row_id>          # full provenance for a row
content-cli debug drift [--zone X]         # rows whose source file sha changed since extract
content-cli debug zone <name>              # zone summary (name='_quarantine' for quarantine)
content-cli debug quarantine               # list quarantined rows + reason breakdown
content-cli debug audit                    # pattern scan for suspect content (LLM tells, prompt injection)
```

### Examples

```bash
# Trace a row to its source
content-cli debug source "rev:12916250"

# Find rows with stale source files
content-cli debug drift
content-cli debug drift --zone collections

# Quarantine summary
content-cli debug quarantine

# Audit corpus for AI tells / prompt injection / spam patterns
content-cli debug audit
```

---

## `manual` — open editor manual HTML

```bash
content-cli manual
```

Opens `resources/how-to-edit-for-paleo-hero.html` (or falls back to `how-to-write-for-paleo-hero.html`) in default browser. Exits 1 if neither exists.

Uses `open` on macOS, `xdg-open` on Linux, `webbrowser` module as fallback.

---

## `inspo` — legacy competitor Shopify collection lookup

Predates `research`. Mostly superseded by `research --in collections`. Kept for backwards compat.

Subcommands: `domains`, `list`, `show`, `compare`, `top`, etc. Run `content-cli inspo --help` for full list.

```bash
# Examples
content-cli inspo domains              # list known competitor domains
content-cli inspo list --domain themueslifolk.com.au
content-cli inspo show <handle>
```

Prefer `research --in collections` for new agent code.

---

## Detached Commands (no longer registered)

These were part of the editor mode and are now removed from the CLI surface. Code is preserved in `editor/check.py` for resurrection by un-commenting decorators in `cli.py`.

| Was | Status | Replacement |
|-----|--------|-------------|
| `review` | Detached | None — content-cli is search-only now |
| `draft` | Detached | — |
| `write` | Detached | — |
| `ask` | Renamed | `research` |
| `check` | Renamed → detached | None |
