---
name: content-cli-patterns
description: >-
  Agent recipes for content-cli — jq extraction patterns, multi-step research
  workflows, scoping, error handling, audit trails. Use when constructing
  multi-step queries, piping output, or integrating content-cli into agent
  workflows or shell scripts.
---

# content-cli — Agent Patterns

Reusable recipes for agents calling `content-cli`. Default output is compact JSON, optimal for `jq`.

---

## jq Extraction

```bash
# Snippets only
content-cli research "muesli" | jq -r '.data.matches[].snippet'

# Table + id pairs
content-cli research "muesli" | jq -r '.data.matches[] | "\(.table)/\(.id)"'

# Filter to one table from output
content-cli research "muesli" | jq '.data.matches[] | select(.table=="reviews")'

# Top-rated reviews only
content-cli research "muesli" --in reviews | \
  jq '.data.matches[] | select(.rating >= 5.0)'

# Sort by distance (vector similarity, lower = better)
content-cli research "muesli" | \
  jq '.data.matches | sort_by(.distance)'

# Group by table
content-cli research "muesli" | \
  jq '.data.matches | group_by(.table) | map({table: .[0].table, count: length})'

# Extract full row from one table
content-cli research "muesli" --full --in collections | \
  jq '.data.matches[] | select(.table=="collections")'
```

---

## Research Scoping Strategies

### Broad → narrow

```bash
# 1. Broad scan
content-cli research "muesli" --limit 3
# Inspect which tables yielded the best matches

# 2. Narrow to those tables
content-cli research "muesli" --in collections,reviews --limit 10
```

### Hard filter for a domain

```bash
content-cli research "muesli" \
  --filter "domain='themueslifolk.com.au'" \
  --in collections,scrapes,profiles
```

### Browse a table (no semantic query, just filter)

```bash
content-cli research "" \
  --in reviews \
  --filter "rating=5.0" \
  --limit 20
```

### Exclude a table from search

LanceDB search has no NOT-IN-TABLE filter. Easier to invert with `--in <every-table-except-X>`:

```bash
# Search everything EXCEPT spyfu
content-cli research "muesli" \
  --in corpus,collections,reviews,recipes,skus,ingredients,profiles,scrapes,doctrine
```

---

## Multi-Step Research Workflow

```bash
# 1. Find which competitors talk about a topic
content-cli research "raw honey" --in collections,profiles --limit 5

# 2. Drill into a specific brand
content-cli research "raw honey" \
  --filter "domain='themueslifolk.com.au'" \
  --in collections

# 3. Get their full brand profile
content-cli research "themueslifolk" --in profiles

# 4. See their actual scraped homepage
content-cli research "themueslifolk" --in scrapes --full
```

---

## Audit Trail / Provenance

```bash
# Where did this row come from?
content-cli research "muesli" --with-provenance | \
  jq '.data.matches[] | {id, source: ._provenance.source_path}'

# Manually trace a single row
content-cli debug source "rev:12916250"

# Find rows whose source file changed since extract
content-cli debug drift

# What's been quarantined and why?
content-cli debug quarantine
```

---

## Error Handling

```bash
# Check exit code
if ! content-cli research "test" > /tmp/out 2> /tmp/err; then
  cat /tmp/err
  echo "content-cli failed (exit $?)"
fi

# Distinguish empty results from errors
result=$(content-cli research "<query>")
if echo "$result" | jq -e '.ok' > /dev/null; then
  count=$(echo "$result" | jq '.data.match_count')
  echo "Found $count matches"
else
  echo "Error: $(echo "$result" | jq -r '.error.message')"
fi

# Common error codes (in `.error.code` field)
# - "invalid_argument": bad query / from_step / etc.
# - "not_found": debug source <id> couldn't find the row
# - "draft_too_large": legacy editor-mode error (review detached)
```

---

## Bulk / Batch Patterns

### Gather evidence by topic list

```bash
TOPICS=("primal muesli" "raw honey" "no refined sugar" "JERF")
for topic in "${TOPICS[@]}"; do
  content-cli research "$topic" --limit 3 \
    | jq -c --arg t "$topic" '.data.matches[] | . + {topic: $t}' \
    >> evidence.jsonl
done
wc -l evidence.jsonl
```

### Pre-render markdown for an LLM call

```bash
# --md format produces markdown ready to paste into another prompt
content-cli --md research "muesli" --limit 5 > evidence.md
# Now use evidence.md as a tool result / system prompt fragment
```

### CSV for spreadsheets (legacy `inspo` cmds only)

```bash
content-cli --csv inspo list --domain themueslifolk.com.au > collections.csv
```

---

## Format Selection by Context

| Context | Format flag | Why |
|---------|-------------|-----|
| Agent → agent | *(default JSON)* | Easiest to `jq` and chain |
| Pasting into another LLM prompt | `--md` | Pre-rendered markdown |
| Operator inspecting at terminal | `--human` | Pretty-printed |
| Spreadsheet | `--csv` | Inspo cmds only |
| Debugging missing field | `--full` | All per-table fields kept |

---

## Common Mistakes

| Mistake | What happens | Fix |
|---------|--------------|-----|
| `content-cli research "q" --human` | `--human` silently ignored, JSON returned | `content-cli --human research "q"` |
| `--in corpus, reviews` (whitespace) | Unknown-table error | `--in corpus,reviews` (no spaces) |
| `--filter "domain=foo.com"` | LanceDB SQL parse error | Quote string values: `--filter "domain='foo.com'"` |
| Long draft as query | Embedding limit / poor results | Split into short topic queries |
| `content-cli ask "..."` | "No such command" | `ask` was renamed to `research` |
| `content-cli review/draft/write` | "No such command" | Editor mode was detached |
| Forgot `GEMINI_FWF_INTELLIGENCE` | First search errors with `EmbedError` | `export GEMINI_FWF_INTELLIGENCE="..."` |

---

## See Also

- [../SKILL.md](../SKILL.md) — root skill (quick reference, gotcha)
- [../commands/SKILL.md](../commands/SKILL.md) — full command reference
- [../schemas/SKILL.md](../schemas/SKILL.md) — JSON schemas + LanceDB filter syntax
