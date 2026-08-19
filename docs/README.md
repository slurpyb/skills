# Docs

Operator notes for marketplace plugins. Env vars live on the plugin page. Upstream names go to GitHub — those trees are not in this repo.

## slurpyb

| Plugin | What it is | Env |
|---|---|---|
| [sbx-agent](https://github.com/slurpyb/sbx-agent) | Docker Sandboxes (`sbx`) | none |
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
| [simple-english](https://github.com/AminBlg/SimpleEnglish) | ASD-STE100 technical writing | none |
| [i-have-adhd](https://github.com/ayghri/i-have-adhd) | Action-first replies | none |
| [design-eng-skills](https://github.com/segunadebayo/design-eng-skills) | State machines, changesets, component APIs | none |
| [shopify-plugin](https://github.com/Shopify/Shopify-AI-Toolkit) | Shopify docs and validators | [`OPT_OUT_INSTRUMENTATION`](plugins/shopify-plugin/) |
| [mattpocock-skills](https://github.com/mattpocock/skills) | Grilling, specs, TDD, review | none |
| [davidondrej-skills](https://github.com/davidondrej/skills) | Orchestration, research, ops | [DeepAPI, Fireflies, OpenRouter](plugins/davidondrej-skills/) |
| [fuse-prompt-engineer](https://github.com/fusengine/agents/tree/main/plugins/prompt-engineer) | Prompt engineering | none |
