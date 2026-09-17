---
name: perplexity-cli
description: >-
  AI-synthesized answers with live-web citations, via the Perplexity Sonar API CLI
  (`perplexity-cli`). Use when you want a written answer to a question — grounded in
  real-time web search and returned with source citations — not a list of links. Three
  modes: `ask` (full answer, waits), `chat` (same, streams tokens), `search` (raw
  URLs+snippets, no answer). Good for research synthesis, "what changed in X", compare/
  explain questions, academic (`--mode academic`) or SEC-filing (`--mode sec`) grounding,
  recency-filtered or domain-restricted answers. Iterative loop (broad ask → reflect →
  narrower asks) beats one monolithic question. Outputs compact JSON by default
  (jq-friendly). Differs from siblings: `jina-cli` returns raw SERP results + scraped page
  content (no synthesized answer); `spyfu-cli` does SEO/SEM competitor data. Requires
  PERPLEXITY_API_KEY (or OPENROUTER_API_KEY fallback).
---

# perplexity-cli

A CLI over the **Perplexity Sonar API** (Chat Completions + Search, Bearer-auth). Returns an
**AI-written answer with citations** to a question, grounded in live web search — not just links.
Backend is Perplexity natively, with optional OpenRouter fallback.

## When to use it (and when not)

- **Use `perplexity-cli`** for: a synthesized answer to a question; research synthesis; "what
  changed / how do people do X"; compare/explain; academic or SEC-grounded answers; answers
  filtered by recency or restricted to specific domains.
- **Use `jina-cli`** instead when you want raw SERP results **plus scraped page content** to feed an
  LLM yourself — jina returns results, perplexity returns an *answer*.
- `search` here returns raw URLs+snippets (no AI answer) — lighter than jina (no page content).

## ⚠️ The one thing that bites everyone

**Global flags (`--text`, `--pretty`, `--api-key`) MUST come BEFORE the subcommand.** They live on
the root callback; placed after `ask`/`chat`/`search` they error or are ignored.

```bash
perplexity-cli --text ask "What is Rust?"     # ✅ correct
perplexity-cli ask "What is Rust?" --text      # ❌ wrong
```

Second gotcha: in `chat` (streaming) + JSON mode, **tokens stream to stderr, final JSON to stdout** —
parse stdout only (`2>/dev/null`). In `--text` chat, tokens go to stdout.

## Auth + defaults — set up ONCE, then stop passing flags

**Preferred: a config file.** Drop keys *and* your preferred defaults in
`~/.config/perplexity-cli/perplexity-cli.json` (honors `$XDG_CONFIG_HOME`) and every
command Just Works — no env vars, no `--api-key`, no repeating `--model` every call.

```jsonc
// ~/.config/perplexity-cli/perplexity-cli.json   (chmod 600 — holds secrets)
{
  "perplexity_api_key": "pplx-...",     // key at perplexity.ai/settings/api
  "openrouter_api_key": "sk-or-v1-...", // optional fallback
  "model": "sonar-pro",                  // default model for ask/chat
  "output": "json",                      // json | pretty | text
  "search_mode": "web",                  // optional ask/search defaults:
  "recency": "month",                    //   search_mode, recency,
  "reasoning_effort": "high",            //   reasoning_effort, temperature
  "temperature": 0.2
}
```

With that file present, `perplexity-cli ask "..."` already uses your key + `sonar-pro` +
high reasoning. **Don't pass `--api-key`/`--model`/etc. unless overriding the config for one call.**
All fields optional; missing file is fine; an unknown key or bad value exits `4`.

Env vars still work (and override the config file) if you prefer them:

```bash
export PERPLEXITY_API_KEY="pplx-..."        # primary
export OPENROUTER_API_KEY="sk-or-v1-..."    # optional fallback (also works standalone)
```

**Precedence (highest wins):** `CLI flag > env var > config file > built-in default`.

| Keys present (any source) | Behavior |
|---|---|
| Perplexity only | Native Perplexity |
| OpenRouter only | OpenRouter → `perplexity/sonar*` |
| Both | Perplexity primary; fall back to OpenRouter on 401/402/403/408/429/5xx + network errors |
| Neither | Exit `2` |

`--api-key` overrides the Perplexity key only (no `--api-key` for OpenRouter). `.env` is NOT auto-loaded.

## Research methodology (matters for quality)

**Many small queries beat one monolithic ask.** Start broad → reflect on the answer → ask narrower
follow-ups on terms that surfaced → synthesize. A single "compare A vs B vs C and tell me which with
5 constraints" produces a shallow, prompt-biased answer. Split each "and" clause into its own ask.

## Commands

| Command | Use for | Streaming |
|---|---|---|
| `ask` | AI answer + citations, waits for full response | no |
| `chat` | same as ask, tokens stream as they arrive (`--no-stream` = ask) | yes |
| `search` | raw titles/URLs/snippets, no AI answer | no |

```bash
# With a config file set up, this is all you need — model/recency come from config:
perplexity-cli ask "What changed in Python 3.13?"
# Flags are only for one-off OVERRIDES of the config:
perplexity-cli ask "What changed in Python 3.13?" --model sonar-reasoning --recency week
perplexity-cli --text chat "Explain monads"
perplexity-cli search "climate research" --mode academic --recency year
```

Most-used flags (full list → `references/perplexity-api.md`):

| Flag | Short | On | Meaning |
|---|---|---|---|
| `--model` | `-m` | ask/chat | `sonar`(default)·`sonar-pro`·`sonar-reasoning`·`sonar-deep-research` |
| `--system` | `-s` | ask/chat | system prompt |
| `--reasoning` | | ask/chat | `minimal`·`low`·`medium`·`high` |
| `--recency` | `-r` | all | `hour`·`day`·`week`·`month`·`year` |
| `--mode` | `-m`* | all | `web`(default)·`academic`·`sec` (*`-m`=mode on search, =model on ask) |
| `--domains` | `-d` | all | comma-sep domain filter |
| `--related` / `--images` | | ask | include follow-up Qs / image URLs |
| `--max-results` | `-n` | search | result count |
| `--temperature` | `-t` | ask/chat | 0.0–2.0 |

## JSON input / stdin (agent-preferred)

`--json`/stdin keys are **snake_case** and differ from flag names. `search` needs `query`; `ask`/`chat`
need `question`. CLI flags override JSON.

```bash
perplexity-cli ask --json '{"question":"What is Rust?","model":"sonar-pro","reasoning_effort":"high"}'
echo '{"query":"AI news","search_mode":"web","max_results":5}' | perplexity-cli search
```

## Agent patterns

```bash
perplexity-cli ask "What is TLS?" | jq -r '.content'              # answer text only
perplexity-cli ask "Latest Node release" | jq -r '.citations[]'   # citation URLs
perplexity-cli search "python packaging" | jq '.results[] | {url, name}'
result=$(perplexity-cli chat "Explain TLS" 2>/dev/null); echo "$result" | jq -r '.content'  # capture stream JSON
```

Output (compact JSON): `ask`/`chat` → `{ content, model, citations[], usage{prompt_tokens,
completion_tokens, total_tokens}, related_questions[] }`. `search` → `{ query, results:[{url, name,
snippet, date}] }`. On OpenRouter fallback, search `snippet`/`date` are always `null` and
`related_questions` is `[]` — don't filter on `.snippet != null`.

## Exit codes

`0` ok · `2` auth/bad usage/no key · `3` rate limit (429) · `4` validation/400 · `5+` server 5xx ·
`70` internal · `130` interrupted.

## Install / invoke

uv project: `uv tool install .` from the repo, or `uv run perplexity-cli …` inside it. Binary is
`perplexity-cli`. Debug: `PERPLEXITY_CLI_DEBUG=1` for tracebacks.
