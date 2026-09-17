---
name: jina-cli
description: >-
  Web search WITH full page-content extraction, via the Jina Search API CLI (`jina-cli`).
  Use when you need search-engine results plus the scraped content of those pages in one
  call — SERP hits returned as markdown/text/JSON — for research, fact-finding with source
  URLs, site-restricted search (`--site`), news or image search, file-type filtering
  (PDFs), or feeding fresh web content to an LLM. Outputs compact JSON by default
  (jq-friendly). Prefer over ad-hoc curl/scraping. For a synthesized AI answer use
  `perplexity-cli`; jina-cli returns raw results + content, not an answer. Requires
  JINA_API_KEY.
---

# jina-cli

A CLI over the **Jina Search API** (`https://s.jina.ai/`, Bearer-auth). One search call returns
SERP results **and** the extracted content of each page — titles, URLs, descriptions, and
markdown/text/HTML content — so you don't scrape separately.

## When to use it (and when not)

- **Use `jina-cli`** for: web search where you also want page *content*; site-restricted
  search; news/image search; PDF/filetype filtering; grabbing fresh, citable web content for an LLM.
- **Use `perplexity-cli`** instead when you want a *synthesized answer* with citations, not raw results.
- It is a SEARCH tool. For a single already-known URL, fetch that URL directly.

## ⚠️ The one thing that bites everyone

**Global flags (`--text`, `--pretty`, `--api-key`, `--proxy`, `--timeout`) MUST come BEFORE the
`search` subcommand.** Typer parses the callback first; flags placed after `search` are silently
ignored (you'll get default compact JSON and wonder why).

```bash
jina-cli --text search "query"      # ✅ correct
jina-cli search "query" --text      # ❌ --text silently ignored
```

## Auth

```bash
export JINA_API_KEY="jina_..."      # required; free key at https://jina.ai/
```
Resolution order (first wins): CLI `--api-key` → `JINA_*` env → `./.jina-cli.json` → ``. Don't put the key in project config — use the env var.

## Usage

```bash
jina-cli search "python async best practices"          # compact JSON (default — pipe to jq)
jina-cli --pretty search "rust vs go"                  # indented JSON
jina-cli --text search "what is RLHF" -f markdown      # rich human-readable
```

Most-used flags (full list → `references/jina-search-api.md`):

| Flag | Meaning |
|---|---|
| `-n, --num N` | number of results |
| `-f, --respond-with` | content format: `content`·`markdown`·`html`·`text`·`pageshot`·`screenshot` |
| `-s, --site a.com,b.com` | restrict to domains |
| `-t, --type` | `web`·`images`·`news` |
| `--gl US` / `--hl en` | country / language |
| `--filetype pdf,docx` | file-type filter |
| `--max-tokens` / `--token-budget` | cap content tokens (cost control) |
| `--engine browser` | render JS pages before extracting |
| `--instruction "..."` | natural-language extraction guidance |
| `--no-cache` | bypass Jina cache (fresh fetch) |

Reproducible/structured input via `--json` or stdin — **keys are camelCase** (`respondWith`, not `respond_with`):

```bash
echo '{"q":"climate models","num":3,"respondWith":"markdown","gl":"US"}' | jina-cli search
jina-cli search --json '{"q":"fastapi DI","site":["github.com"],"num":5}'
```

## Agent patterns

```bash
jina-cli search "q" --num 5 | jq -r '.results[].url'                 # just URLs
jina-cli search "q" --num 1 | jq -r '.results[0].content'           # first result's content
jina-cli search "AI news" -t news --gl US -n 10 \
  | jq -r '.results[] | "[\(.publishedTime)] \(.title) — \(.url)"'  # news digest
jina-cli search "topic" --max-tokens 200 -n 5 | jq -r '.results[].content'  # token-capped
```

## Output (compact JSON)

`{ "query", "respond_with", "results": [ { title, url, description, content, chunks,
publishedTime, html, text, screenshotUrl, links, images, metadata } ] }` — `url` always present;
`content` format follows `--respond-with`. Full schema in `references/jina-search-api.md`.

## Exit codes

`0` ok · `2` auth/missing key · `3` rate limit (429) · `4` bad input/400 · `5` server 5xx · `70` internal · `130` interrupted.

## If `jina-cli` isn't on PATH

It's a uv project: `uv tool install .` from the repo, or run `uv run jina-cli …` inside it. Debug with `JINA_CLI_DEBUG=1`.
