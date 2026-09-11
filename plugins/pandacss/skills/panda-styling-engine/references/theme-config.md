# Theme and Configuration

Load when changing preset internals, theme domains, config functions, conditions, named styles, or the shared styling language. For the complete project config shape, start with [configuration-baseline.md](./configuration-baseline.md).

## Theme

Register tokens, semantic tokens, recipes, slot recipes, text styles, layer styles, animation styles, keyframes, breakpoints, containers, and related theme data under `theme.extend`. Keep the `extend` object explicit so consumer configs can deep-merge focused overrides.

## Presets

A preset packages reusable Panda configuration. Give it one stable name, export its constituent domains from focused modules, and assemble them in one preset factory. Later presets override earlier values at matching keys.

## Config Functions

Use Panda's `define*` functions to preserve typing and static analysis:

- `defineConfig` for an application or build surface;
- `definePreset` for reusable configuration;
- `defineRecipe` and `defineSlotRecipe` for component presentation;
- `definePattern` for layout transforms;
- token and named-style helpers for theme vocabulary;
- `defineGlobalStyles` for document-wide rules.

## Conditional Styles

Use the project's named conditions for interaction, component data state, responsive behavior, color mode, contrast, and motion. Add a custom condition only when the selector recurs and has stable semantics.

## Config Styles

- `globalCss` owns the intrinsic document and typography baseline.
- `staticCss` pre-generates the package's recipe and theme distribution contract plus finite values extraction cannot see.
- `globalFontface` owns shared variable-font declarations.
- Named styles live under the theme and are consumed through their generated props.

Load [typography-foundation.md](./typography-foundation.md) for the global variable, font, semantic role, and text-style foundation.

## Static emission

Emit every project recipe and the primary accent theme as the baseline distribution contract. Add finite runtime-selected patterns, conditions, or themes when their values are outside static extraction.

After config changes, run clean codegen, inspect the resolved config, typecheck generated imports, and verify emitted CSS.

Next, load the specific [patterns.md](./patterns.md), [recipes.md](./recipes.md), [slot-recipes.md](./slot-recipes.md), [tokens.md](./tokens.md), or [utilities.md](./utilities.md) branch being configured.
