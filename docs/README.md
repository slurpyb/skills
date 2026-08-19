# Docs

Operator notes for marketplace plugins. Env vars live on the plugin page.

## slurpyb

| Plugin | What it is | Env |
|---|---|---|
| [sbx-agent](plugins/sbx-agent/) | Docker Sandboxes (`sbx`) | none |
| [core](plugins/core/) | Always-on MCP | Context7, Exa, Jina, Perplexity, Firecrawl, Octocode |
| [astro-agent](plugins/astro-agent/) | Astro skills and docs MCP | none |
| [research](plugins/research/) | Research plugin stub | none |

## Local

In-tree copies, not authored here.

| Plugin | What it is | Env |
|---|---|---|
| [autoresearch](plugins/autoresearch/) | Goal → score loop via Stop hook | `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` |
| [capture](plugins/capture/) | Brain-dump organizer | none |
| [code-context](plugins/code-context/) | DeepWiki, Context7, Exa, clone, fetch | `EXA_API_KEY` |
| [plugin-optimizer](plugins/plugin-optimizer/) | Plugin structure and practice checks | none |
| [refactor](plugins/refactor/) | Simplifier agent and language practices | none |
| [storm](plugins/storm/) | Multi-perspective cited articles | none |

## Upstream

| Plugin | What it is | Env |
|---|---|---|
| [simple-english](plugins/simple-english/) | ASD-STE100 technical writing | none |
| [i-have-adhd](plugins/i-have-adhd/) | Action-first replies | none |
| [design-eng-skills](plugins/design-eng-skills/) | State machines, changesets, component APIs | none |
| [shopify-plugin](plugins/shopify-plugin/) | Shopify docs and validators | `OPT_OUT_INSTRUMENTATION` |
| [mattpocock-skills](plugins/mattpocock-skills/) | Grilling, specs, TDD, review | none |
| [davidondrej-skills](plugins/davidondrej-skills/) | Orchestration, research, ops | DeepAPI, Fireflies, OpenRouter |
| [fuse-prompt-engineer](plugins/fuse-prompt-engineer/) | Prompt engineering | none |
