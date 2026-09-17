---
name: web-search-with-perplexity
description: >-
  Web search via Perplexity AI CLI (perplexity-cli). Use for any web
  research, fact-finding, "look this up", "search the web", or
  AI-grounded answer with citations. Three commands: search (raw URLs),
  ask (AI answer + citations), chat (streaming AI answer). Supports
  PERPLEXITY_API_KEY primary backend with OPENROUTER_API_KEY fallback.
origin: local
metadata:
  repo: perplexity-cli
  version: "1.1.0"
allowed-tools:
  - Read
  - Bash
---

# web-search-with-perplexity

CLI wrapper for Perplexity AI API. Three commands: `search`, `ask`, `chat`.

---

## ⚠️ #1 Agent Mistake — Global Flags Come BEFORE the Subcommand

```bash
# ✅ CORRECT
perplexity-cli --text ask "What is Rust?"
perplexity-cli --pretty search "AI news"
perplexity-cli --api-key sk-xxx ask "question"

# ❌ WRONG — typer silently ignores trailing global flags
perplexity-cli ask "What is Rust?" --text
perplexity-cli search "AI news" --pretty
```

`--text`, `--pretty`, `--api-key` belong to **root command**, not subcommand. Must precede `search`, `ask`, `chat`.

---

## Commands at a Glance

| Command  | Purpose                              | Streams | Default output |
|----------|--------------------------------------|---------|----------------|
| `search` | Raw URLs + snippets, no AI answer    | No      | Compact JSON   |
| `ask`    | AI answer + citations, full wait     | No      | Compact JSON   |
| `chat`   | AI answer, tokens stream in real time| Yes     | JSON/text      |

**Default compact JSON** — best for agents piping to `jq`.

---

## Output Format Flags (global — must precede subcommand)

| Flag       | Output                                     | Best for           |
|------------|--------------------------------------------|--------------------|
| *(none)*   | Compact JSON on stdout                     | Agents, `jq` pipes |
| `--pretty` | Indented JSON on stdout                    | Human inspection   |
| `--text`   | Plain text; `chat` streams tokens to stdout| Interactive use    |

---

## Quick Examples

```bash
# Search
perplexity-cli search "Python 3.13 features"
perplexity-cli --text search "best Python ORMs"

# Ask (non-streaming)
perplexity-cli ask "What is quantum computing?"
perplexity-cli --text ask "Latest Rust release" --recency month
perplexity-cli ask "Compare React vs Vue" --model sonar-pro

# Chat (streaming)
perplexity-cli --text chat "Explain monads"
perplexity-cli chat "AI news" --model sonar-pro 2>/dev/null  # final JSON only

# jq extraction
perplexity-cli ask "What is TLS?" | jq -r '.content'
perplexity-cli ask "Python packaging" | jq '.citations[]'
```

---

## Detailed References

Load when need full option tables, schemas, patterns:

- **Full command syntax + all flags** → [commands/SKILL.md](commands/SKILL.md)
- **JSON input/output schemas** → [schemas/SKILL.md](schemas/SKILL.md)
- **Agent recipes + piping patterns** → [patterns/SKILL.md](patterns/SKILL.md)
- **Model selection guide** → [models/SKILL.md](models/SKILL.md)

---

## Setup

```bash
export PERPLEXITY_API_KEY="pplx-..."   # required; or pass --api-key globally
```

Exit codes: `0` success · `2` auth/usage error · `3` rate limit · `4` validation · `5+` server error