# Cross-platform compatibility audit

Snapshot produced by `bun run marketplace:audit`. Regenerate to inspect the current repository.

**Release status: blocked.** The scanner reports 42 findings: 9 stable, 23 WIP, and 10 deprecated.

## How to interpret this audit

This is a static audit, not 42 reproduced runtime failures. The 22 native-component findings flag behavior that needs a platform adapter or verification; the scanner flags the presence of these components without executing them. The 11 frontmatter findings identify parse or metadata problems. Seven MCP findings identify environment interpolation that the portable configuration cannot perform. Two plugins have no discoverable portable skills, which requires checking whether another portable capability supplies their purpose.

Passing packaging tests does not establish behavioral parity. Codex catalog registration and sample installations were tested separately. Cursor runtime behavior has not been verified.

| Finding | Count |
| --- | ---: |
| `mcp-credentials` | 5 |
| `mcp-environment` | 2 |
| `native-agents` | 12 |
| `native-commands` | 7 |
| `native-hooks` | 2 |
| `native-rules` | 1 |
| `no-portable-skills` | 2 |
| `skill-frontmatter` | 11 |

## Stable — 9 findings

### ai-engineer

Plugin: [plugins/ai-engineer](../plugins/ai-engineer/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **native-commands:** instructions needs a Codex/Cursor behavior adapter and contract test.
- **mcp-credentials:** exa: portable HTTP configuration cannot interpolate environment variables.

### pandacss

Plugin: [plugins/pandacss](../plugins/pandacss/plugin.json)

- **native-rules:** rules needs a Codex/Cursor behavior adapter and contract test.

### pi

Plugin: [plugins/pi](../plugins/pi/plugin.json)

- **native-commands:** prompts needs a Codex/Cursor behavior adapter and contract test.

### react

Plugin: [plugins/react](../plugins/react/plugin.json)

- **skill-frontmatter:** composition-patterns: Name must match directory and description must be nonempty
- **skill-frontmatter:** react-best-practices: Name must match directory and description must be nonempty

### slurpyb-skills

Plugin: [plugins/repository-skills](../plugins/repository-skills/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **native-commands:** instructions needs a Codex/Cursor behavior adapter and contract test.


## Wip — 23 findings

### capture

Plugin: [wip/plugins/capture](../wip/plugins/capture/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **native-commands:** commands needs a Codex/Cursor behavior adapter and contract test.

### core

Plugin: [wip/plugins/core](../wip/plugins/core/plugin.json)

- **skill-frontmatter:** research-based-solutions: Nested mappings are not allowed in compact mappings at line 2, column 14: description: Runs an approval-gated research-to-execution process: offers paral… ^
- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **mcp-environment:** context7: nonportable environment interpolation.
- **mcp-credentials:** exa: portable HTTP configuration cannot interpolate environment variables.
- **mcp-credentials:** jina: portable HTTP configuration cannot interpolate environment variables.
- **mcp-environment:** perplexity: nonportable environment interpolation.
- **mcp-credentials:** firecrawl: portable HTTP configuration cannot interpolate environment variables.

### design-system

Plugin: [wip/plugins/design-system](../wip/plugins/design-system/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

### i-have-adhd

Plugin: [wip/plugins/i-have-adhd](../wip/plugins/i-have-adhd/plugin.json)

- **native-hooks:** Hook event, input, output, and lifecycle behavior need a tested Cursor adapter.

### openspec

Plugin: [wip/plugins/openspec](../wip/plugins/openspec/plugin.json)

- **native-commands:** prompts needs a Codex/Cursor behavior adapter and contract test.

### refactor

Plugin: [wip/plugins/refactor](../wip/plugins/refactor/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

### review-and-refactor

Plugin: [wip/plugins/review-and-refactor](../wip/plugins/review-and-refactor/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

### storm

Plugin: [wip/plugins/storm](../wip/plugins/storm/plugin.json)

- **skill-frontmatter:** engine: Name must match directory and description must be nonempty
- **skill-frontmatter:** generate: Name must match directory and description must be nonempty
- **skill-frontmatter:** outline: Name must match directory and description must be nonempty
- **skill-frontmatter:** polish: Name must match directory and description must be nonempty
- **skill-frontmatter:** research: Name must match directory and description must be nonempty
- **skill-frontmatter:** write: Name must match directory and description must be nonempty
- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

### unocss

Plugin: [wip/plugins/unocss](../wip/plugins/unocss/plugin.json)

- **skill-frontmatter:** unocss-astro: Nested mappings are not allowed in compact mappings at line 2, column 14: description: Exhaustive UnoCSS (v66) reference for building with the instant at… ^
- **skill-frontmatter:** unocss-astro-configuration: Nested mappings are not allowed in compact mappings at line 2, column 14: description: Wires UnoCSS (v66) into Astro (v6) — setup reference. Covers @unoc… ^


## Deprecated — 10 findings

### autoresearch

Plugin: [deprecated/plugins/autoresearch](../deprecated/plugins/autoresearch/plugin.json)

- **no-portable-skills:** No discoverable skills; verify this plugin has a tested portable runtime capability.
- **native-commands:** commands needs a Codex/Cursor behavior adapter and contract test.
- **native-hooks:** Hook event, input, output, and lifecycle behavior need a tested Cursor adapter.

### code-context

Plugin: [deprecated/plugins/code-context](../deprecated/plugins/code-context/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **mcp-credentials:** exa-code-context: portable HTTP configuration cannot interpolate environment variables.

### fuse-prompt-engineer

Plugin: [deprecated/plugins/fuse-prompt-engineer](../deprecated/plugins/fuse-prompt-engineer/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.
- **native-commands:** commands needs a Codex/Cursor behavior adapter and contract test.

### plugin-optimizer

Plugin: [deprecated/plugins/plugin-optimizer](../deprecated/plugins/plugin-optimizer/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

### research

Plugin: [deprecated/plugins/research](../deprecated/plugins/research/plugin.json)

- **no-portable-skills:** No discoverable skills; verify this plugin has a tested portable runtime capability.

### sbx-agent

Plugin: [deprecated/plugins/sbx-agent](../deprecated/plugins/sbx-agent/plugin.json)

- **native-agents:** agents needs a Codex/Cursor behavior adapter and contract test.

## Verification limits

- Findings are scoped to the checks implemented in `scripts/marketplace/lib.mjs`; absence of findings is not proof that every skill, dependency, or runtime integration works.
- Native commands, agents, rules, and hooks require tests of their intended behavior, not just matching component names or file counts.
- The release gate includes all channels. Opt-in status currently does not exempt WIP or deprecated findings.
- The full machine-readable findings are in [compatibility-audit.json](compatibility-audit.json).
