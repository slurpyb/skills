---
name: content-cli-schemas
description: >-
  Full JSON envelope schemas for content-cli output, per-table match shapes,
  and LanceDB --filter SQL syntax. Use when constructing parsing logic for
  content-cli output, building jq pipelines that need exact field paths, or
  writing --filter expressions.
---

# content-cli — JSON Schemas

Default output is compact JSON. The envelope contract is consistent across all subcommands.

---

## Top-Level Envelope

```jsonc
// Success
{
  "ok": true,
  "request_id": "req_<12-hex-chars>",
  "data": <subcommand-specific>,
  "agent_instructions": "..."  // hint for the calling agent
}

// Error
{
  "ok": false,
  "request_id": "req_<12-hex-chars>",
  "error": {
    "code": "<machine-code>",
    "message": "<human description>"
  }
}
```

---

## `research` Output Schema

```jsonc
{
  "ok": true,
  "request_id": "req_a3b6...",
  "data": {
    "query": "muesli",
    "tables_searched": ["corpus","collections","reviews","..."],
    "k_per_table": 5,
    "match_count": 20,
    "matches": [<Match>, ...]
  },
  "agent_instructions": "Surface these matches verbatim with their source paths..."
}
```

### `Match` (common fields)

Every match has:

| Field | Type | Description |
|-------|------|-------------|
| `table` | string | Source table name |
| `id` | string | Stable row id (e.g. `rev:12916250`, `manifesto:paleo-hero-...`) |
| `score_type` | string | `vector_cosine` or `bm25` |
| `distance` | float | Lower = better (cosine distance) or higher = better (BM25 score). Check `score_type`. |
| `snippet` | string | First ~256 chars of the match text |

Plus per-table fields (see below).

### Per-Table Match Fields

**`corpus`** (Mark Rockley's manifestos):
- `book_slug`: e.g. `"paleo-hero-clean-eating-guide"`
- `chunk_index`: int

**`collections`** (competitor pages):
- `domain`: e.g. `"themueslifolk.com.au"`
- `handle`: e.g. `"traditional-muesli"`
- `url`: full collection URL
- `title`: page title
- `intent`, `angle`, `tone`, `keywords`, `target_queries`, `language` (if LLM-enriched)

**`reviews`**:
- `type`: `"review"` / `"perplexity_review"` / `"perplexity_ingredient"`
- `rating`: float (1.0–5.0)

**`recipes`**:
- `name`, `category`, `cuisine`

**`skus`**:
- `slug`, `title`

**`ingredients`**:
- `slug`, `name`

**`profiles`**:
- `slug`, `name` (snippet contains JSON-encoded brand profile)

**`scrapes`**:
- `slug` (snippet contains scraped page markdown)

**`spyfu`**:
- `domain`, `slug`

**`doctrine`**:
- `section`: `"philosophy"` / `"nutritional_rules"` / `"voice_rules"` / `"antipatterns"` / `"product_attributes"`
- `principle`: short rule statement
- `evidence`: longer prose (when present)

### With `--with-provenance`

Adds:

```jsonc
"_provenance": {
  "source_path": "src/content_cli/_assets/embeddings.npz",
  "source_sha256": "bc2caa..."
}
```

---

## Orientation Envelopes (bare commands)

### `content-cli` (bare)

```jsonc
{
  "ok": true,
  "data": {
    "tool": "content-cli",
    "purpose": "Semantic search engine over the bundled brand intelligence...",
    "verbs": [{"verb": "research", "use_when": "...", "example": "..."}],
    "tables": ["corpus", "collections", ...],
    "format_flags": "Pass --json (default) / --human / --md BEFORE the verb."
  },
  "agent_instructions": "Read AGENTS.md for the operating contract. Use `research` to query..."
}
```

### `content-cli research` (bare)

```jsonc
{
  "ok": true,
  "data": {
    "verb": "research",
    "purpose": "Hybrid search across bundled corpus + competitors + reviews + recipes + doctrine.",
    "usage": "content-cli research \"<query>\" [--in TABLE,...] [--limit N] [--filter k=v] [--with-provenance]",
    "tables": [...],
    "examples": ["content-cli research \"primal muesli\"", "..."]
  },
  "agent_instructions": "Pick a query that matches the user's intent..."
}
```

---

## `debug` Subcommand Schemas

### `debug source <id>`

```jsonc
{
  "ok": true,
  "data": {
    "found": true,
    "table": "reviews",
    "id": "rev:12916250",
    "source_path": "...",
    "source_sha256_at_extract": "...",
    "drift": {
      "source_resolved": "/absolute/path",
      "source_sha256_now": "...",
      "stale": false  // or true, or string "unknown_no_path" / "unknown_source_missing"
    }
  }
}
```

### `debug drift [--zone X]`

```jsonc
{
  "ok": true,
  "data": {
    "stale_rows": 0,
    "fresh_rows": 3128,
    "unknown_rows": 0,
    "skipped_no_provenance": 12,
    "samples": [{"zone": "...", "id": "...", "source_path": "...", "recorded_sha": "...", "current_sha": "..."}]
  }
}
```

### `debug zone <name>`

Returns either zone summary from `sources.json` or quarantine row count + reason breakdown.

### `debug quarantine`

```jsonc
{
  "ok": true,
  "data": {
    "quarantined_count": 204,
    "by_reason": {"pre_enrichment_blog": 204},
    "sample": [{"id": "...", "title": "...", "author": "...", "reason": "..."}]
  }
}
```

### `debug audit`

```jsonc
{
  "ok": true,
  "data": {
    "rows_scanned": 3654,
    "flagged_count": 0,
    "long_rows_8kb_plus": 0,
    "samples": [{"zone": "...", "id": "...", "tag": "ai_self_reference", "snippet": "..."}]
  }
}
```

Audit tags: `ai_self_reference` · `ai_refusal_pattern` · `prompt_injection_ignore` · `prompt_injection_role` · `spam_cta` · `embedded_script`.

---

## `--filter` SQL Syntax (LanceDB)

LanceDB accepts a SQL-like WHERE clause on indexed structured columns. Quote string values with **single quotes**:

```bash
# Equality
--filter "domain='themueslifolk.com.au'"
--filter "rating=5.0"
--filter "type='review'"

# Comparison
--filter "rating>=4.0"
--filter "chunk_index<5"

# String matching
--filter "handle LIKE '%muesli%'"
--filter "domain LIKE '%.com.au'"

# Boolean composition
--filter "rating>=4.0 AND type='review'"
--filter "domain='themueslifolk.com.au' OR domain='paleohero.com.au'"

# IN
--filter "section IN ('philosophy', 'voice_rules')"
```

### Per-Table Filterable Columns

| Table | Columns | Notes |
|-------|---------|-------|
| `corpus` | `book_slug`, `chunk_index` | |
| `collections` | `domain`, `handle`, `url`, `title`, `tone`, `language` | LLM-enriched columns may not be present on all rows |
| `reviews` | `rating`, `type` | |
| `recipes` | `category`, `cuisine`, `name` | |
| `skus` | `slug`, `title` | |
| `ingredients` | `slug`, `name` | |
| `profiles` | `slug`, `name` | Most data is in `text` (JSON blob), not filterable directly |
| `scrapes` | `slug` | |
| `spyfu` | `domain`, `slug` | |
| `doctrine` | `section`, `principle` | |

For complex filters on data inside `text` blobs (e.g. JSON profile fields), use `research` to surface candidates then post-filter with `jq`.

---

## CLI Flag → Envelope Field Mapping

| CLI flag | Envelope effect |
|----------|-----------------|
| `--in corpus,reviews` | `data.tables_searched = ["corpus", "reviews"]` |
| `--limit 3` | `data.k_per_table = 3` |
| `--filter "..."` | Applied at LanceDB layer; affects which rows are scored |
| `--with-provenance` | Each match gets `_provenance` sub-object |
| `--full` | Adds all per-table fields (default mode drops empty/sparse fields) |
| Format flags | Change render only — same JSON envelope under the hood |
