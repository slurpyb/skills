---
name: content-cli
description: >-
  content-cli CLI reference for agents. Semantic search engine over Paleo Hero
  brand intelligence (doctrine, competitor collections, customer reviews,
  recipes, ingredients, profiles, SpyFu, scrapes). Hybrid BM25 + vector search
  across 10 tables. TRIGGER when: user mentions "content-cli", "paleo hero
  search", "brand intelligence query", or asks how to research/query/search
  Paleo Hero data from the command line. Also triggers when writing a shell
  command or script that calls content-cli.
origin: local
metadata:
  repo: /Users/jordan/j/repos/collections_cli
  version: "0.2.0"
allowed-tools:
  - Read
  - Bash
---

# content-cli — Quick Reference

Semantic search over Paleo Hero brand intelligence. One verb (`research`), 10 tables, JSON envelope output.

---

## ⚠️ CRITICAL: Format flags go BEFORE the subcommand

```bash
# ✅ CORRECT
content-cli --human research "muesli" --limit 3

# ❌ WRONG — flag silently ignored, falls back to JSON
content-cli research "muesli" --limit 3 --human
```

`--json` / `--human` / `--md` / `--csv` / `--full` are global Typer flags on the root callback. They precede the subcommand. Subcommand-local flags (`--limit`, `--in`, `--filter`, `--with-provenance`) come after.

---

## Auth

```sh
export GEMINI_FWF_INTELLIGENCE="<key>"  # required for query embedding
```

Falls back to `GEMINI_API_KEY` if `GEMINI_FWF_INTELLIGENCE` is unset.

---

## Commands at a Glance

| Command | Purpose | Output |
|---------|---------|--------|
| `content-cli` (bare) | Tour: verbs + tables + format-flag rule | Compact JSON |
| `research <query>` | Hybrid search across 10 tables | Compact JSON envelope |
| `research` (bare) | Usage + 5 example queries | Compact JSON |
| `manual` | Open editor manual HTML in browser (when present) | — |
| `debug <subcmd>` | Operator: source / drift / zone / quarantine / audit | Compact JSON |
| `inspo ...` | Legacy competitor lookup (rarely needed) | Compact JSON |

`review`, `draft`, `write` are NOT commands — editor mode was detached.

---

## Quick Examples

```bash
# Most common
content-cli research "primal muesli"

# Narrow tables
content-cli research "raw honey" --in doctrine
content-cli research "muesli" --in collections,reviews --limit 5

# SQL filter on structured columns
content-cli research "muesli" --filter "domain='themueslifolk.com.au'"
content-cli research "" --in reviews --filter "rating=5.0" --limit 10

# Human terminal output (flag goes BEFORE!)
content-cli --human research "Mark Rockley"

# jq: just snippets
content-cli research "muesli" | jq -r '.data.matches[].snippet'

# jq: ids by table
content-cli research "muesli" | jq -r '.data.matches[] | "\(.table)/\(.id)"'

# Audit provenance
content-cli research "muesli" --with-provenance | jq '.data.matches[0]._provenance'
```

---

## Tables

`corpus` (Mark's manifestos) · `collections` (2,344 competitor pages, 59 brands) · `reviews` (customer + curated) · `recipes` · `skus` · `ingredients` (mechanism science) · `profiles` (brand/competitor) · `scrapes` (homepages) · `spyfu` (SEO/PPC) · `doctrine` (rules + voice).

Pass to `--in` as a comma-separated list (no spaces): `--in corpus,reviews`.

---

## Output Envelope

```json
{
  "ok": true,
  "request_id": "req_<hex>",
  "data": {
    "query": "...",
    "tables_searched": [...],
    "match_count": 20,
    "matches": [{ "table": "...", "id": "...", "snippet": "...", "distance": 0.51 }]
  },
  "agent_instructions": "Surface verbatim with source paths..."
}
```

Errors: `{ "ok": false, "error": { "code": "...", "message": "..." } }`.

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Search failed (`ok:false` envelope) |
| 2 | Bad usage (file not found, missing arg, conflicting flags) |

---

## Deep References

- [commands/SKILL.md](commands/SKILL.md) — full flag reference, every option, syntax for every subcommand
- [schemas/SKILL.md](schemas/SKILL.md) — full JSON envelope schemas, per-table match shapes, `--filter` SQL syntax
- [patterns/SKILL.md](patterns/SKILL.md) — agent recipes: jq extraction, multi-step research, scoping, error handling

---

## Common Mistakes

| Mistake | What happens | Fix |
|---------|--------------|-----|
| Flag after subcommand | `--human` silently ignored | `content-cli --human research ...` |
| `--in corpus, reviews` (space) | Unknown-table error | `--in corpus,reviews` |
| `--filter "domain=foo.com"` | SQL parse error | Quote values: `"domain='foo.com'"` |
| Long draft as query | Embedding limit / poor results | Use short topic queries |
| `content-cli ask` / `review` / `draft` | "No such command" | `ask` → `research`; rest were detached |
| Missing API key | `EmbedError` on first search | `export GEMINI_FWF_INTELLIGENCE="..."` |
