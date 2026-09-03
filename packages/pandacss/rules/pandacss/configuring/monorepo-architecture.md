---
description: How PandaCSS is wired in THIS monorepo — the layered preset stack, eject mandate, shared styled-system, and per-client theming. Read before adding a preset, wiring a panda.config, or theming a client.
---

# PandaCSS — fullsnack monorepo architecture

The other Panda rules teach generic Panda. This one is the repo-specific contract:
how the presets layer, why `eject` is mandatory, how the shared `styled-system`
package works, and how a client theme composes. All load-bearing — deviating
breaks the build (often as an opaque TS2590).

## The layered preset stack

```
@repo/preset-base   → ejected @pandacss/preset-base + preset-panda (split, editable defineX files)
@repo/preset-core   → tokens, semantic tokens, accent colorPalette, fluid font-sizes, 31 Radix palettes
@repo/preset-ui     → PURE RECIPE MIXIN — 16 cva + 52 sva Park-UI recipes, NOTHING else
```

- `preset-core` composes `preset-base` (`presets: [base({ omit: ['colors'] })]`) with
  `theme: { extend: {...} }`.
- **`preset-ui` is decoupled from core** — it does NOT `presets: [core]`. Bundling core
  would re-apply a static core *after* a client's configured one (later-preset-wins),
  silently resetting the accent. `preset-ui`'s recipes are token-path strings that
  resolve at the **consumer's** codegen, where core is present. `@repo/preset-core` is a
  `peerDependency` of `preset-ui`.
- **The consumer composes the foundation and the recipes SEPARATELY:**
  `presets: [createPreset({ accent }), presetUi]`.

## `eject: true` is mandatory

Set `eject: true` in any config that composes `@repo/preset-base` (or a preset built on
it — i.e. every config here).

**Why:** Panda auto-includes its built-in `@pandacss/preset-base` unless `eject` is set.
Our `@repo/preset-base` is the *ejected copy* of that. Without `eject`, both apply → every
token/condition/utility doubles → the union becomes "too complex to represent" → **TS2590**.
The error surfaces in unrelated component source (checkbox/close-button), so it reads like a
component bug — it isn't. Confirm dedup with `panda debug` (presets list) / `panda spec`.

## The shared `@repo/styled-system` (monorepo dev env)

ONE output package, consumed everywhere:

- Apps spread the shared config, then set `importMap: "@repo/styled-system"` +
  `outdir: ".../packages/styled-system/dist"` (the `/dist` matters — it matches the
  package's `exports` map).
- **The package manifest (`package.json`) IS committed** — it's a real workspace package
  consumers resolve. Only the generated `dist/` is gitignored.
- **Component libraries are pure consumers**: no own `panda.config`, they NEVER emit, and
  they import `@repo/styled-system/{css,jsx,recipes,types}`. Apps author bare
  `styled-system/*` (the `importMap` rewrites it); shared/source-distributed packages
  import `@repo/styled-system/*` directly. See [styled-system](styled-system.md).
- Never import `styled-system/styles.css` — the PostCSS plugin injects the CSS.

## Per-client theming

`@repo/preset-core` exports `createPreset({ name, accent, fluid })` and re-exports all
**31 Radix palettes** for the `accent` slot. A client picks its accent + fluid type and
composes `preset-ui` on top. The canonical client `panda.config.ts`:

```ts
import { defineConfig } from "@pandacss/dev"
import { createPreset, crimson } from "@repo/preset-core"
import presetUi from "@repo/preset-ui"

export default defineConfig({
  eject: true,
  presets: [
    createPreset({ name: "acme", accent: crimson /*, fluid: {...} */ }),
    presetUi,
  ],
  theme: { extend: { recipes: { /* ad-hoc client overrides */ } } },
  importMap: "@acme/styled-system",
  outdir: "styled-system/dist",
})
```

Clients run their OWN Panda (Decision B) and own their OWN styled-system — the
shared model above is the monorepo dev/component-dev env, not client projects.

> **Standalone exception — `apps/retractthat-com`.** Its preset
> (`@repo/preset-retractthat`) is a self-contained hand-conversion-from-Next theme; it
> does NOT build on `preset-core`/`preset-ui`. It is NOT the template — the core+ui
> composition above is. Don't derive conventions from retractthat.

## Override model

- **Project-wide:** override a UI recipe via `theme.extend.recipes.<name>` in the client
  config. `extend` adds/overrides a variant; it **cannot delete** one.
- **Per-instance:** ad-hoc `css()` at the call site wins over the recipe — the `utilities`
  layer beats the `recipes` layer. This is why clients run their own Panda runtime.

## Conventions that ride on this architecture

- **Config recipes are the default.** Author `defineRecipe`/`defineSlotRecipe` in the
  preset, not `cva`/`sva` at the call site (those are throwaway-only). See
  [recipes](../composing/recipes.md).
- **`createStyleContext` is UI-library-only.** Compound components are assembled in
  `@repo/react`; app code consumes them. See [JSX style context](../composing/style-context.md).
- **No private `@/` aliases** in source-distributed packages — relative imports only.

## See also

- [styled-system (generated)](styled-system.md)
- [The extend keyword](extend.md)
- [Recipes](../composing/recipes.md) · [Slot recipes](../composing/slot-recipes.md)
- [Choosing primitives](../refactoring/choosing-primitives.md)
