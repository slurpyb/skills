---
description: PandaCSS internals — apply when debugging why styles aren't extracted, why a token() call resolves differently than expected, or when writing a Panda hook/plugin that taps into the build pipeline
---

# PandaCSS — Architecture & Build Flow

Internal mental model for debugging extraction misses, `token()` vs `token.var()` confusion, and hook authoring.

## Packages

| Package | Role |
|---------|------|
| `@pandacss/parser` | AST analysis via `ts-morph` — finds `css(...)`, `cva(...)`, JSX style props |
| `@pandacss/extractor` | Static evaluation of style objects (walks AST, resolves literals) |
| `@pandacss/generator` | Emits `styled-system/` artifacts (CSS, runtime, types) |

## Build flow

1. **Setup** — load `panda.config.ts`, merge presets, resolve tokens/conditions/breakpoints.
2. **Emit** — write baseline runtime and types to `outdir` (default `styled-system/`).
3. **Extract** — scan source files via `fast-glob`, parse AST, walk known call sites, statically evaluate style objects.
4. **Generate** — produce final CSS + JS/JSX artifacts (atomic classes, recipe class maps).
5. **Optimize** — minify via PostCSS or LightningCSS.

## Token resolution — two modes

| Mode | Form | When | What Panda does |
|------|------|------|-----------------|
| CallExpression | `token('colors.red.500')` | At a style site or in a JS expression | Evaluates to raw value (or CSS variable) at build time |
| String pattern | `'1px solid token(colors.red.500)'` | Inside string values (borders, shadows, gradients) | Post-parse expansion to CSS variable reference |

Use `token.var('...')` to force CSS variable form regardless of position.

## Common pitfalls

- **TypeScript version drift** — `ts-morph` version must match the project's TS version; mismatches silently break extraction. Pin both.
- **Codegen lag** — every config / token / recipe change requires `panda codegen` before TS sees the new keys.
- **Dynamic values** — anything that isn't a literal at parse time won't extract. `bg={isActive ? "a" : "b"}` extracts both classes; `bg={someComputed}` extracts neither.
- **Hook ordering** — `parser:before` runs per-file; `tokens:created` runs once. Don't try to mutate per-file state in `tokens:created`.

## Debugging extraction

1. Run `panda --watch --verbose` and look for parse warnings.
2. Confirm the file matches `include` globs in `panda.config.ts`.
3. Check the call site uses a recognized import (`styled-system/css`, configured `cva`/`sva` paths).
4. Replace dynamic expressions with literals and confirm extraction recovers.

## See also

- [Styled system](../configuring/styled-system.md)
- [Panda integration hooks](../configuring/hooks.md)
- [Writing styles](../styling/css.md)
