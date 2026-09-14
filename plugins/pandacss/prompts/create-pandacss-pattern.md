---
description: Create or extend a typed Panda CSS pattern with compatibility and behavioral verification
argument-hint: "<pattern-name> [requirements]"
---

Create or extend the Panda CSS pattern named `$1`.

Additional requirements: `${@:2}`

Load and follow the `writing-pandacss-patterns` skill before editing.

## Required process

1. Discover the owning Panda config or preset, existing pattern registry, installed Panda version, token contract, and repository verification commands.
2. Determine whether `$1` extends a built-in Panda pattern or defines a distinct custom pattern.
3. Inspect the installed base-preset definition when extending a built-in.
4. State the compatibility contract, semantic props, defaults, responsive behavior, and precedence before implementation.
5. Implement the typed pattern and register it under `patterns.extend` without replacing inherited patterns.
6. Add behavioral tests for configuration, transformed output, token and literal handling, conditional values, precedence, and passthrough props.
7. Run Panda codegen when configured, followed by the repository's formatter, build, typecheck, lint, and tests.

## Completion report

Report classification, public props, compatibility decisions, files changed, generated artifacts, verification results, and remaining limitations.
