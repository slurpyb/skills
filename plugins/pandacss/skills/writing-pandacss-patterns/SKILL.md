---
name: writing-pandacss-patterns
description: Authors and extends portable Panda CSS patterns with typed properties, token-aware transforms, responsive behavior, preset registration, and behavioral tests. Use when creating, modifying, reviewing, or debugging patterns in any Panda project or preset.
---

# Writing Panda CSS Patterns

## Bundled guidance

Read these before editing:

- [`references/pattern-rules.md`](references/pattern-rules.md) — authoring and compatibility rules
- [`references/panda-contract.md`](references/panda-contract.md) — Panda pattern and preset mechanics
- [`references/testing.md`](references/testing.md) — behavioral verification strategy
- [`assets/pattern.ts`](assets/pattern.ts) — implementation template

These files are the complete authoring contract. External documentation and installed package source are optional evidence for version-specific behavior.

Register patterns by extending the inherited collection:

```ts
patterns: { extend: { ...patterns } }
```

## Workflow

1. **Locate** — **Complete when:** the owning config or preset, pattern registry, installed Panda version, and verification commands are known.
   - Discover paths from configuration, imports, and package manifests; assume no fixed repository layout.
   - Inspect the resolved or installed base preset when extending a built-in pattern.

2. **Classify** — **Complete when:** built-in extension versus custom-pattern ownership is explicit.
   - Extend a built-in when Panda already owns the public concept.
   - Create a custom pattern for a distinct reusable styling abstraction.
   - State which existing behavior must remain compatible.

3. **Design** — **Complete when:** every prop has a type, default policy, CSS effect, responsive policy, and precedence rule.
   - Keep the semantic API smaller than the CSS it produces.
   - Reuse Panda property and token categories before inventing aliases.
   - Preserve built-in properties and defaults unless the request explicitly replaces them.

4. **Implement** — **Complete when:** the owning config exposes the pattern and semantic props do not leak into output.
   - Use one module per pattern and the structure in `assets/pattern.ts`.
   - Destructure semantic props, emit system style properties, and spread unrelated style props last.
   - Register additions and overrides under `patterns.extend`.

5. **Prove** — **Complete when:** compatibility and new behavior pass deterministic checks.
   - Follow `references/testing.md` for transform, default, token, responsive, and passthrough coverage.
   - Run the repository's formatter, build, typecheck, lint, tests, and boundary checks.
   - Inspect generated pattern types or code when the repository supports Panda codegen.

## Output

Report classification, public props, precedence decisions, changed files, generated artifacts, verification results, and remaining compatibility limits.
