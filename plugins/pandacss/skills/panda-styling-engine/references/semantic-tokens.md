# Semantic Tokens

Load when a value expresses product meaning, changes by condition, or should remain stable while the underlying theme changes.

## Defining Semantic Tokens

Use `defineSemanticTokens` and name values by intent, for example:

- foreground roles;
- canvas and surface roles;
- border roles;
- focus or status roles;
- semantic spacing, sizing, elevation, or motion roles.

Each leaf has `{ value: ... }`. The value may reference fixed tokens and may map configured conditions such as base, dark mode, high contrast, or component state.

## Using Semantic Tokens

Components, recipes, slot recipes, patterns, and named styles consume semantic names. A theme can then replace their underlying fixed references without changing component source.

## Decision test

- If callers care about the exact scale value, use a fixed token.
- If callers care about meaning, use a semantic token.
- If the same intent changes by color mode or context, use one conditional semantic token rather than branching every consumer.
- If a concept is already semantic, avoid creating a second fixed token with the same name solely for indirection.

Keep the semantic tree coherent: nearby roles use a shared naming grammar, and component-specific tokens live under a clear component or domain branch.

After changes, regenerate types and survey the resulting semantic token through Panda MCP when available.

Next, load [color.md](./color.md) for palette semantics or [tokens.md](./tokens.md) to define underlying values.
