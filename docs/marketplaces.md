# Marketplace portability

The repository root is the stable marketplace. `wip/` and `deprecated/` are separate, opt-in marketplace roots. Each contains its own Codex, Cursor, and Claude catalog. Stable entries resolve directly to active content; the legacy `packages/` aliases do not determine membership.

## Source of truth

Edit `marketplace.config.json` for membership, identity, presentation metadata, and component locations. Edit skill content at its original source. Run `bun run marketplace:generate`, then commit the generated files with the source change. The generated file inventory records ownership and detects stale copies. Retiring an edited generated file requires preserving or relocating the edit first.

Portable plugins have a root `plugin.json` and discoverable `skills/<name>/SKILL.md` files. Native manifests are compatibility adapters. Existing plugin identities, including `writing-code` in `plugins/writing-typescript`, remain stable.

The dependency-only `simple-english` and `design-eng-skills` packages receive copies of their **currently installed** skills from `.agents/skills`. Other installed skills go into `community-skills`. Root skills and workflows are distributed through `plugins/repository-skills`, so installing them does not copy the entire repository or its opt-in channels. `skills-lock.json` retains upstream provenance. These copies are a distributable snapshot, not a claim to contain every skill in the upstream repositories. Root-layout WIP skills are also copied into discoverable locations. Supporting files are copied with each skill.

## Install and export

Codex accepts a local marketplace root:

```sh
codex plugin marketplace add /absolute/path/to/skills
codex plugin marketplace add /absolute/path/to/skills/wip
codex plugin marketplace add /absolute/path/to/skills/deprecated
```

Only add the channels you want. All entries are available for explicit installation; none is force-installed.

For a standalone opt-in distribution:

```sh
bun scripts/marketplace/cli.mjs export wip /tmp/slurpyb-wip-marketplace
```

The destination must be new. The export contains its catalog and plugin payloads, preserves executable permissions, and rejects symlinks. It can be relocated or published as a separate repository root. Cursor's Git marketplace import expects a catalog at the repository root; a nested GitHub directory is not assumed to be an independently installable marketplace. Publishing these exports is a separate action. No remote marketplace was published here.

## Verification and release

`bun run test:marketplace` checks discovery contracts, schemas, source coverage, drift, channel separation, unsafe paths, and relocation. `bun run marketplace:check` checks generated artifacts. `bun run marketplace:audit` prints unresolved compatibility issues. `bun run marketplace:release` fails while any issue remains, across all channels.

Set `CODEX_BIN` to a Codex executable and run `bun test tests/codex-marketplace.test.mjs` for real catalog registration, enumeration, and a sample plugin installation from each channel in a temporary profile. The test checks installed skill discovery and removes its profile afterward. It does not exercise model behavior or tools. Without that executable, the integration test is explicitly skipped. Cursor loading and runtime behavior still need client verification.

Packaging tests are not proof of behavioral parity. The initial audit identifies native agents, commands, rules, hooks, invalid frontmatter, and environment-dependent MCP configuration. Native features require adapters and tests for their invocation, inputs, outputs, and lifecycle. Matching counts or translating event names is insufficient. Cursor hook activation is disabled in generated adapters where only an unverified Claude-style hook exists. Those plugins remain release-blocked. Preserve native source files while implementing and testing the appropriate adapters.

## Platform contracts

Both clients document the Agent Plugins format for skills and MCP. Codex also supports its compatibility manifest and OpenAI extensions. Cursor's native format adds components beyond the shared standard. The precedence and execution of mixed native/portable manifests must be checked in each client before asserting richer feature parity. [Codex packaging](https://developers.openai.com/plugins/build/plugins), [Cursor reference](https://cursor.com/docs/reference/plugins).

The shared standard fixes skill discovery and MCP filenames. Its HTTP configuration does not interpolate credential placeholders. Use its schema plus semantic checks; do not treat a legacy scaffold validator as the current specification. [Agent Plugins specification](https://agent-plugins.org/specification).

Official schemas are pinned under `schemas/` so tests do not depend on live documentation or networking. Review schema updates and adapter changes together.
