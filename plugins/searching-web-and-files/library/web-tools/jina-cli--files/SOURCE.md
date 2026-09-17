---
name: jina-cli
description: Web search WITH full page-content extraction, via the Jina Search API CLI (`jina-cli`). Use when you need search-engine results plus the scraped content of those pages in one call — SERP hits returned as markdown/text/JSON for research, fact-finding with source URLs, site-restricted search (`--site`), news/image search, or PDF/file-type filtering. Outputs compact JSON by default (jq-friendly, camelCase keys). Differs from siblings: `perplexity-cli` returns a synthesized AI answer; `spyfu-cli` returns SEO/SEM competitor data — jina-cli returns raw SERP results + page content, not an answer. Requires JINA_API_KEY.
---

# jina-cli — Jina web search with full page-content extraction

Wraps the **Jina Search API** (`s.jina.ai`): one `search` command returns SERP
results (title, URL, description) **plus the scraped content of each page** as
markdown/HTML/text/JSON. Compact JSON by default — pipe to `jq`.

## Auth
```bash
export JINA_API_KEY="jina_..."        # required; free key at https://jina.ai/
# or pass --api-key (GLOBAL flag, before the subcommand); or a config file
```
4-level config cascade (highest first): CLI flags → env vars → project `./.jina-cli.json` → global `~/.config/jina-cli/config.json`. Missing/empty key → exit 2.

## Gotchas
- **#1: GLOBAL flags go BEFORE the `search` subcommand** — `--text`, `--pretty`, `--api-key`, `--proxy`, `--timeout`. Typer parses the callback first; placed *after* `search` they are silently ignored (output quietly stays compact JSON). `jina-cli --text search "q"` ✅ / `jina-cli search "q" --text` ❌.
- Everything else (`--num`, `--site`, `--respond-with`, `--type`, …) is a **search option, after `search`**.
- `--json` / stdin keys are **camelCase**, not snake_case: `respondWith` not `respond_with`, `num` not `max_results`, `noCache`, `maxTokens`, `tokenBudget`, `targetSelector`. In JSON, multi-value fields are **arrays**: `"site": ["a.com","b.com"]`.
- Default output is **compact JSON**; `--pretty` = indented, `--text` = Rich terminal render (pair `--text` with `--respond-with markdown` for readable content).
- Exit codes: 2 auth, 3 rate-limit (429), 4 bad input/400, 5 server 5xx, 70 internal.

## Commands by job

```bash
# Basic search — compact JSON (results[] with content per hit)
jina-cli search "python async patterns"
jina-cli search "rust ownership" --num 5                 # -n limits results

# Readable content: markdown format + Rich rendering (global --text first)
jina-cli --text search "what is RLHF" --respond-with markdown

# Site-restricted search (one or more domains, comma-separated)
jina-cli search "dependency injection" --site github.com --num 3

# News / images
jina-cli search "AI safety 2024" --type news --gl US --num 10   # -t news|images|web
jina-cli search "data center" --type images

# File-type filter (e.g. PDFs / papers) + in-title filter
jina-cli search "attention mechanism transformers" --filetype pdf
jina-cli search "fastapi" --intitle tutorial

# Localized results
jina-cli search "intelligence artificielle" --type news --hl fr --gl FR

# DOM-targeted / AI-guided extraction
jina-cli search "https://docs.python.org" --target "article" --respond-with markdown
jina-cli search "OpenAI pricing" --instruction "Extract only the pricing table" -f markdown

# Cost control
jina-cli search "long topic" --max-tokens 200 --num 5

# Reproducible invocation via JSON (camelCase keys) — flag or stdin
jina-cli search --json '{"q":"rust async","num":3,"respondWith":"markdown","gl":"US"}'
echo '{"q":"climate models","num":3,"respondWith":"markdown"}' | jina-cli search
```

Content format `--respond-with` / `-f`: `markdown` (reading) · `html` (scraping) · `text` (plain) · `pageshot` / `screenshot` (image URLs). Other useful search options: `--provider google|bing|reader`, `--engine auto|browser|curl|cf-browser-rendering`, `--no-cache`, `--with-links-summary`, `--remove`/`--wait-for` selectors, `--method GET`.

## Output / export
Result shape: `{query, respond_with, results:[{title, description, url, content, publishedTime, links, images, ...}]}`. Common jq extractions:
```bash
jina-cli search "q" --num 5            | jq -r '.results[].url'
jina-cli search "q" --num 1            | jq -r '.results[0].content'
jina-cli search "q"                    | jq -r '.results[] | "\(.title)\t\(.url)"'
jina-cli search "AI news" -t news -n 10 | jq -r '.results[] | "[\(.publishedTime)] \(.title) — \(.url)"'
```

## References (full detail — for development)
- `references/documentation/jina-cli_docs/llms-full.md` — authoritative Jina API spec: full Search request body, the complete Reader `X-*` header catalog, embeddings/reranker/batch endpoints, model specs, rate limits. (`llms-small.md` / `llms.md` are byte-identical duplicates.)
- `references/openapi/jina-search-api_data.json` · `jina-reader-api_data.json` — machine-readable schemas for `s.jina.ai` (search) and `r.jina.ai` (reader).
- `references/codebase_analysis/jina-cli_local_0_jina-cli/` — CLI internals: `JinaSearchClient` (client.py), `JinaConfig` (config.py), config-file inventory. Grep here for exact flags; `jina-cli search --help` is the live source of truth.
