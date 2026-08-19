# Docs

Operator notes for marketplace plugins. In-tree names go to the operator page. Upstream names go to GitHub — those clones are not in this repo.

## slurpyb

| Plugin | What it is | Env |
|---|---|---|
| [sbx-agent](https://github.com/slurpyb/sbx-agent) | Docker Sandboxes (`sbx`) | none |
| [core](./plugins/core/) | Always-on MCP | Context7, Exa, Jina, Perplexity, Firecrawl, Octocode |
| [astro-agent](./plugins/astro-agent/) | Astro skills and docs MCP | none |
| [research](./plugins/research/) | Research plugin stub | none |

## Local

In-tree copies, not authored here.

| Plugin | What it is | Env |
|---|---|---|
| [autoresearch](./plugins/autoresearch/) | Goal → score loop via Stop hook | `CLAUDE_CODE_STOP_HOOK_BLOCK_CAP` |
| [capture](./plugins/capture/) | Brain-dump organizer | none |
| [code-context](./plugins/code-context/) | DeepWiki, Context7, Exa, clone, fetch | `EXA_API_KEY` |
| [plugin-optimizer](./plugins/plugin-optimizer/) | Plugin structure and practice checks | none |
| [refactor](./plugins/refactor/) | Simplifier agent and language practices | none |
| [storm](./plugins/storm/) | Multi-perspective cited articles | none |

## Upstream

| Plugin | What it is | Env |
|---|---|---|
| [simple-english](https://github.com/AminBlg/SimpleEnglish) | ASD-STE100 technical writing | none |
| [i-have-adhd](https://github.com/ayghri/i-have-adhd) | Action-first replies | none |
| [design-eng-skills](https://github.com/segunadebayo/design-eng-skills) | State machines, changesets, component APIs | none |
| [shopify-plugin](https://github.com/Shopify/Shopify-AI-Toolkit) | Shopify docs and validators | `OPT_OUT_INSTRUMENTATION` |
| [mattpocock-skills](https://github.com/mattpocock/skills) | Grilling, specs, TDD, review | none |
| [davidondrej-skills](https://github.com/davidondrej/skills) | Orchestration, research, ops | `DEEPAPI_API_KEY`, `FIREFLIES_API_KEY`, `OPENROUTER_API_KEY` |
| [fuse-prompt-engineer](https://github.com/fusengine/agents/tree/main/plugins/prompt-engineer) | Prompt engineering | none |

## Agents

Every `agents/*.md` in a registered plugin. Description is the frontmatter `description` field.

| Plugin | Agent | Description |
|---|---|---|
| [sbx-agent](https://github.com/slurpyb/sbx-agent) | [sbx-assistant](https://github.com/slurpyb/sbx-agent/blob/main/agents/sbx-assistant.md) | Docker Sandbox specialist. Builds and fixes sbx templates, kits and policy, and works out why a sandbox cannot reach, build or keep something. Use when a task involves spec.yaml, docker/sandbox-templates, or an sbx command. |
| [astro-agent](./plugins/astro-agent/) | [astro-engineer](../plugins/astro-agent/agents/astro-engineer.md) | Specialist for Astro sites — pages, Content Collections, islands, adapters, integrations, Starlight, and astro.config. Invoke when the work is primarily Astro, Starlight, or an Astro adapter/integration. |
| [capture](./plugins/capture/) | [cs-capture](../plugins/capture/agents/cs-capture.md) | Brain-dump organizer persona. Catches unstructured streams of mixed thoughts/tasks/ideas and transforms them into a 4-section actionable system with zero information loss. Refuses to fabricate workspace connections. Refuses to corporate-ify the user's voice. Refuses to act on dump items without explicit pick. Asks at most ONE mid-organization clarifying question per dump. |
| [code-context](./plugins/code-context/) | [context-researcher](../plugins/code-context/agents/context-researcher.md) | Use this agent when you need to research a library, repository, or code pattern without polluting the main conversation context. Spawns an isolated lookup using DeepWiki, Context7, Exa, git clone, and Web Search+Fetch, then returns concise findings. |
| [plugin-optimizer](./plugins/plugin-optimizer/) | [plugin-optimizer](../plugins/plugin-optimizer/agents/plugin-optimizer.md) | Use this agent when validating plugin structure, analyzing documentation redundancy, or executing optimization workflows. Trigger when user asks to "validate plugin", "check for redundancy", "optimize plugin", or when launched by /optimize-plugin command. Examples: |
| [refactor](./plugins/refactor/) | [code-simplifier](../plugins/refactor/agents/code-simplifier.md) | Use this agent when the user asks to refactor code, simplify complex logic, remove dead or legacy code, apply framework-specific performance patterns, or run `/refactor` and `/refactor-project` workflows while preserving behavior.<br><br>&lt;example&gt;<br>Context: User wants to refactor specific files for clarity<br>user: "/refactor src/auth/login.ts"<br>assistant: "I'll launch the code-simplifier agent to refactor the specified file, load the refactor:best-practices skill with relevant references, apply minimal behavior-preserving improvements, and summarize changes."<br>&lt;commentary&gt;<br>The request is scoped to specific file paths and fits a behavior-preserving refactor workflow.<br>&lt;/commentary&gt;<br>&lt;/example&gt;<br><br>&lt;example&gt;<br>Context: User wants to clean up unused code and simplify logic<br>user: "Clean up unused code and simplify the complex logic in this module"<br>assistant: "I'll launch the code-simplifier agent to identify dead code, remove unused imports/exports/variables, simplify complex patterns while preserving behavior, and provide a summary of improvements."<br>&lt;commentary&gt;<br>Request combines dead code removal with logic simplification, requires aggressive cleanup mode.<br>&lt;/commentary&gt;<br>&lt;/example&gt;<br><br>&lt;example&gt;<br>Context: User wants to apply framework-specific performance optimizations<br>user: "Apply Next.js performance best practices to this component"<br>assistant: "I'll launch the code-simplifier agent to detect the Next.js framework, load relevant performance references from refactor:best-practices, apply only applicable optimizations (waterfalls, bundle impact, hydration), and summarize changes."<br>&lt;commentary&gt;<br>Framework-specific request requires detection and selective application of Next.js rules.<br>&lt;/commentary&gt;<br>&lt;/example&gt;<br><br>&lt;example&gt;<br>Context: User wants project-wide refactoring for consistency<br>user: "/refactor-project"<br>assistant: "I'll launch the code-simplifier agent with project-wide scope to scan the entire codebase, prioritize cross-file duplication reduction and pattern standardization, and summarize changes with suggested tests."<br>&lt;commentary&gt;<br>Project-wide scope requires consistent cross-file application and duplication detection.<br>&lt;/commentary&gt;<br>&lt;/example&gt; |
| [storm](./plugins/storm/) | [storm-researcher](../plugins/storm/agents/storm-researcher.md) | Use this agent to run ONE persona's simulated conversation in the STORM research phase. Spawned in parallel by /storm:research — one agent per persona. The agent conducts a multi-turn WikiWriter↔TopicExpert dialogue grounded in retrieval and returns a structured conversation log. Do not spawn for general research; only for the STORM persona-conversation subprocess. &lt;example&gt;Context: /storm:research is running for topic "transformer architectures" with 3 personas. user: "research transformer architectures from multiple perspectives for a storm article" assistant: "I'll spawn one storm-researcher per persona in parallel to run the simulated conversations." &lt;commentary&gt;One agent per persona, launched in a single message for parallelism.&lt;/commentary&gt;&lt;/example&gt; &lt;example&gt;Context: /storm:research discovered a "Historical context" persona. user: "run the historical-context persona conversation for the transformer article" assistant: "I'll launch a storm-researcher with that persona definition and max_turns=3." &lt;commentary&gt;Single persona subprocess; returns a JSON conversation log.&lt;/commentary&gt;&lt;/example&gt; &lt;example&gt;Context: user wants general research, not STORM. user: "research the history of RLHF" assistant: "I'll research that directly with WebSearch — storm-researcher is only for STORM persona subprocesses." &lt;commentary&gt;Do not spawn this agent for non-STORM research.&lt;/commentary&gt;&lt;/example&gt; |
| [fuse-prompt-engineer](https://github.com/fusengine/agents/tree/main/plugins/prompt-engineer) | [prompt-engineer](https://github.com/fusengine/agents/blob/main/plugins/prompt-engineer/agents/prompt-engineer.md) | Use when: creating new prompts, optimizing existing prompts, reviewing prompt quality, designing agents or skills. Do NOT use for: code implementation (use domain expert), non-prompt tasks. |
