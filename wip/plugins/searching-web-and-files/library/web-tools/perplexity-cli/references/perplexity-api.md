# perplexity-cli — full reference

Fuses the CLI surface (`perplexity_cli/main.py`, `AGENTS.md`) with the upstream Perplexity Sonar API.
JSON-input keys below are **snake_case** wire-format (Perplexity request fields), distinct from CLI flag names.

## Upstream contract

- **Backend (primary):** Perplexity API via the `perplexityai` SDK — Chat Completions (`ask`/`chat`)
  and Search (`search`). **Auth:** `Authorization: Bearer $PERPLEXITY_API_KEY`.
- **Backend (fallback):** OpenRouter (`OPENROUTER_API_KEY`), routes to `perplexity/sonar*` chat models.
  `search` is *emulated* via a `perplexity/sonar-pro` chat completion (returns `url`+`name` only;
  `snippet`/`date` always `null`; `related_questions` always `[]`).
- **Resources:** `ask`/`chat` → Chat Completions (answer + citations); `search` → Search (raw SERP).

### Backend resolution

| Keys present | Behavior |
|---|---|
| `PERPLEXITY_API_KEY` only | Native Perplexity |
| `OPENROUTER_API_KEY` only | OpenRouter standalone |
| Both | Perplexity primary; fall back to OpenRouter on **401/402/403/408/429/5xx + network errors** |
| Neither | Exit `2` with help |

Fallback caveats: `chat` streaming fallback only triggers **before the first chunk emits** (mid-stream
errors propagate, no restart — would duplicate stdout). `content`/`citations`/`usage` identical on both backends.

## Global flags (BEFORE subcommand)

| Flag | Env | Default | Notes |
|---|---|---|---|
| `--pretty` | — | off | indented JSON (mutually exclusive with `--text`) |
| `--text` | — | off | human-readable; citations printed below |
| `--api-key` | `PERPLEXITY_API_KEY` | — | Perplexity key only (no `--api-key` for OpenRouter) |

Default output = compact JSON. Streaming `chat`: JSON mode → chunks to **stderr**, final JSON to
**stdout**; `--text` mode → chunks to **stdout**, citations to stderr.

## `search` — raw web results (no AI answer)

`perplexity-cli [GLOBAL] search [QUERY] [OPTIONS]`

| Flag | Short | JSON key (snake_case) | Notes |
|---|---|---|---|
| `--mode` | `-m` | `search_mode` | `web`(default)·`academic`·`sec` |
| `--recency` | `-r` | `search_recency_filter` | `hour`·`day`·`week`·`month`·`year` |
| `--domains` | `-d` | `search_domain_filter` (array) | comma-sep → array |
| `--language` | `-l` | `search_language_filter` (array) | ISO 639-1, comma-sep |
| `--max-results` | `-n` | `max_results` | int |
| `--country` | | `country` | ISO 3166-1 alpha-2 |
| `--after` | | `search_after_date_filter` | `MM/DD/YYYY` |
| `--before` | | `search_before_date_filter` | `MM/DD/YYYY` |
| `--json` | `-j` | — | full params as JSON; CLI flags override |

JSON-only: `max_tokens`. `query` accepts a string or list of strings.

**Search JSON input:**
```json
{ "query": "AI news", "search_mode": "web", "search_recency_filter": "week",
  "search_domain_filter": ["a.com"], "search_language_filter": ["en"],
  "max_results": 10, "max_tokens": 500, "country": "US",
  "search_after_date_filter": "01/01/2024", "search_before_date_filter": "12/31/2024" }
```
**Search JSON output:**
```json
{ "query": "string", "results": [ { "url": "https://…", "name": "title",
  "snippet": "excerpt|null", "date": "2024-01-15|null" } ] }
```

## `ask` — single question, full wait

`perplexity-cli [GLOBAL] ask [QUESTION] [OPTIONS]`

| Flag | Short | JSON key | Default | Notes |
|---|---|---|---|---|
| `--model` | `-m` | `model` | `sonar` | model name (table below) |
| `--system` | `-s` | `system_prompt` | — | system prompt |
| `--mode` | | `search_mode` | — | `web`·`academic`·`sec` |
| `--recency` | `-r` | `search_recency_filter` | — | `hour`…`year` |
| `--domains` | `-d` | `search_domain_filter` (array) | — | comma-sep |
| `--temperature` | `-t` | `temperature` | — | 0.0–2.0 (enforced) |
| `--max-tokens` | | `max_tokens` | — | response cap |
| `--reasoning` | | `reasoning_effort` | — | `minimal`·`low`·`medium`·`high` |
| `--related` | | `return_related_questions` | off | flag → bool |
| `--images` | | `return_images` | off | flag → bool |
| `--json` | `-j` | — | — | full params; CLI overrides |

## `chat` — streaming answer

Same flags as `ask` **minus `--related` and `--images`**, plus `--no-stream` (equivalent to `ask`).

**ask/chat JSON input:**
```json
{ "question": "string (required)", "model": "sonar", "system_prompt": "…",
  "search_mode": "web|academic|sec", "search_recency_filter": "hour|day|week|month|year",
  "search_domain_filter": ["domain.com"], "temperature": 0.2, "max_tokens": 1000,
  "reasoning_effort": "minimal|low|medium|high", "return_related_questions": false,
  "return_images": false }
```
**ask/chat JSON output:**
```json
{ "content": "answer text", "model": "sonar",
  "citations": ["https://…"],
  "usage": { "prompt_tokens": 42, "completion_tokens": 180, "total_tokens": 222 },
  "related_questions": ["…?"] }
```
`ask` exits `5` if the API returns a choice with empty content.

## Models

| Model | Best for | Speed | Cost |
|---|---|---|---|
| `sonar` | Quick factual Q&A (default) | fast | low |
| `sonar-pro` | Deep analysis, multi-step reasoning | medium | medium |
| `sonar-reasoning` | Complex analytical questions | slow | high |
| `sonar-deep-research` | Extensive multi-round research | slowest | highest |

## Research methodology (loop)

```
broad ask → reflect on answer → narrower asks on terms/options that surfaced
          → reflect → synthesis ask referencing what was actually learned
```
| Situation | Do |
|---|---|
| Topic unfamiliar | Round 1 deliberately vague ("what do people use for X?") |
| You think you know the answer | Bias check — phrase R1 as first-time learner |
| 3+ "and" clauses | Split each into its own ask |
| Two queries overlap | Not narrowing enough — sharpen R2 on R1 specifics |
| Answer feels generic | Pull a concrete noun from it, follow up centered on that |

## JSON / stdin gotchas

- Keys are **snake_case** and ≠ flag names (`search_recency_filter`, not `--recency`).
- `search` requires `query`; `ask`/`chat` require `question`.
- `--json` flag and stdin pipe both supported; CLI flags override JSON values.
- Don't filter search results on `.snippet != null` — null on OpenRouter fallback path.

## Exit codes

`0` success · `2` auth (401) / bad usage / no key · `3` rate limit (429) · `4` validation / bad JSON /
400 · `5+` server 5xx (incl. empty-content) · `70` internal CLI error · `130` interrupted.

## Install / debug

uv: `uv tool install .` or `uv run perplexity-cli …`. Binary `perplexity-cli`. `PERPLEXITY_CLI_DEBUG=1`
re-raises full tracebacks instead of the exit-70 wrapper.
