---
name: unocss-core-architecture
description: The UnoCSS engine pipeline, core abstractions, the createGenerator API, and the monorepo package map
---

# UnoCSS Core Architecture

UnoCSS is an isomorphic, **on-demand atomic-CSS engine with no built-in utilities** — everything (rules, variants, theme) is supplied by presets. The same `@unocss/core` engine runs at build time, at runtime (CDN), and in the editor. In an Astro project the `@unocss/astro` integration is a thin wrapper over this engine plus Vite/HMR glue.

## The engine pipeline: source → CSS

`createGenerator()` resolves your config + presets, then `generate(input)` turns source into CSS in four stages:

1. **Extraction** — extractors scan each source file and return a `Set` of candidate tokens.
2. **Matching** — per token, variants peel prefixes (`hover:`, `md:`, `dark:`) down to a base utility, which is matched against the ordered rules (static string or dynamic RegExp).
3. **CSS construction** — the matched rule returns a `CSSObject`/`CSSEntries`; variant handlers rewrite the selector (pseudo-classes, `@media`/at-rule parents).
4. **Assembly** — output is grouped into cascade layers, merged/deduped and cached.

Only tokens that actually appear in source are generated — this is the **on-demand** property.

```ts [generator.ts]
// packages-engine/core/src/generator.ts
export async function createGenerator<Theme extends object = object>(
  config?: UserConfig<Theme>,
  defaults?: UserConfigDefaults<Theme>,
): Promise<UnoGenerator<Theme>>

// UnoGenerator core method:
async generate(
  input: string | Set<string> | CountableSet<string> | string[],
  options: GenerateOptions<boolean> = {},
): Promise<GenerateResult<unknown>>
// GenerateResult => { css, matched, layers, getLayer, getLayers, ... }
// GenerateOptions => { id?, scope?, preflights=true, safelist=true, minify=false, extendedInfo=false }
```

## createGenerator / the @unocss/core API

`createGenerator(config, defaults)` builds the engine from config + presets. `new UnoGenerator()` is deprecated in favour of `createGenerator()`. Every build-tool and runtime integration wraps this same generator.

```ts
import { createGenerator } from '@unocss/core'
import presetWind4 from '@unocss/preset-wind4'

const uno = await createGenerator({ presets: [presetWind4()] })
const { css } = await uno.generate('<div class="m-1 text-red-500 hover:underline" />')
```

Install the bare engine (no presets) when embedding UnoCSS directly:

```bash
bun add -d @unocss/core
```

### RuleContext (matcher context)

Every dynamic rule/shortcut matcher receives `(match, context)`. The context exposes the live generator, the resolved `theme`, the matched variant handlers, and helpers — this is how a rule resolves values from the theme and emits scoped CSS.

```ts [types.ts]
export interface RuleContext<Theme extends object = object> {
  rawSelector: string                 // unprocessed selector from user input
  currentSelector: string             // current selector for rule matching
  generator: UnoGenerator<Theme>      // the engine instance
  symbols: ControlSymbols
  theme: Theme                        // the resolved theme object
  variantHandlers: VariantHandler[]   // matched variant handlers for this rule
  variantMatch: VariantMatchedResult<Theme>
  // ...constructCSS(body, overrideSelector?) and more
}
```

## Core abstractions

These six interfaces (all from `packages-engine/core/src/types.ts`) are the entire engine. Presets are just bundles of them.

### Rule — the atom

`Rule = DynamicRule | StaticRule`. Maps a utility selector to CSS by exact string or RegExp. Rules are matched in order; a dynamic matcher may return `undefined` to fall through. `RuleMeta` carries `layer`, `sort`, `prefix`, `autocomplete`, `noMerge`, `noScope`, `internal`, `custom`.

```ts [types.ts]
export type DynamicMatcher<Theme extends object = object>
  = (match: RegExpMatchArray, context: Readonly<RuleContext<Theme>>) =>
    | Awaitable<CSSValueInput | string | (CSSValueInput | string)[] | undefined>
    | Generator<CSSValueInput | string | undefined>
    | AsyncGenerator<CSSValueInput | string | undefined>

export type DynamicRule<Theme extends object = object> = [RegExp, DynamicMatcher<Theme>, RuleMeta?]
export type StaticRule = [string, CSSObject | CSSEntries | (CSSValueInput | string)[], RuleMeta?]
export type Rule<Theme extends object = object> = DynamicRule<Theme> | StaticRule

export interface RuleMeta {
  layer?: string          // @default 'default'
  noMerge?: boolean       // do not merge even if body is identical. @default false
  noScope?: boolean       // do not apply scope to this selector. @default false
  sort?: number           // fine tune sort
  autocomplete?: Arrayable<AutoCompleteTemplate>
  prefix?: string | string[]
  internal?: boolean      // only match for shortcuts, not user code. @default false
  custom?: Record<string, any>
}
```

### Variant — the modifier

`Variant = VariantFunction | VariantObject`. Recognises a prefix and returns a `VariantHandler` that rewrites the output: `matcher` (remaining utility), `selector`, `body`, `parent` (`@media`/`@supports`), `layer`, `sort`, `order`. `multiPass` lets one variant apply repeatedly. This is the mechanism behind `hover:`, `md:`, `dark:`.

```ts [types.ts]
export interface VariantHandler {
  matcher?: string                                                    // rewritten selector for next match round
  order?: number
  selector?: (input: string, body: CSSEntries) => string | undefined // append pseudo/parents
  body?: (body: CSSEntries) => CSSEntries | undefined                // rewrite css body
  parent?: string | [string, number] | undefined                    // e.g. media query
  sort?: number
  layer?: string | undefined
}

export type VariantFunction<Theme extends object = object>
  = (matcher: string, context: Readonly<VariantContext<Theme>>) =>
    Awaitable<string | VariantHandler | VariantHandler[] | undefined>

export interface VariantObject<Theme extends object = object> {
  name?: string
  match: VariantFunction<Theme>   // entry: match & rewrite the selector
  order?: number
  multiPass?: boolean             // allow re-using the variant. @default false
  autocomplete?: Arrayable<AutoCompleteFunction | AutoCompleteTemplate>
}
export type Variant<Theme extends object = object> = VariantFunction<Theme> | VariantObject<Theme>
```

### Shortcut — the alias

`Shortcut = StaticShortcut | DynamicShortcut`. Expands to a set of existing utilities (emitted into the `shortcuts` layer) and can compose other shortcuts. Unlike `@apply`, shortcuts need **no transformer** — they are a first-class engine concept.

```ts [types.ts]
export type ShortcutValue = string | CSSValue
export type StaticShortcut = [string, string | ShortcutValue[], RuleMeta?]
export type DynamicShortcutMatcher<Theme extends object = object>
  = (match: RegExpMatchArray, context: Readonly<RuleContext<Theme>>) => (string | ShortcutValue[] | undefined)
export type DynamicShortcut<Theme extends object = object> = [RegExp, DynamicShortcutMatcher<Theme>, RuleMeta?]
export type Shortcut<Theme extends object = object> = StaticShortcut | DynamicShortcut<Theme>
```

### Preset — the bundle

`Preset extends ConfigBase`, so it can contain rules, variants, shortcuts, theme, `extendTheme`, preflights, extractors, transformers, layers, and nested `presets`. `enforce: 'pre' | 'post'` controls ordering; `prefix`/`layer` scope all of a preset's output. A `PresetFactory` is `(options?) => Preset` for parameterised init.

```ts [types.ts]
export interface Preset<Theme extends object = object> extends ConfigBase<Theme> {
  name: string
  enforce?: 'pre' | 'post'    // apply before/after other presets
  options?: PresetOptions
  prefix?: string | string[]  // prefix all utilities + shortcuts
  layer?: string              // layer for all utilities + shortcuts
  api?: any                   // cross-preset communication endpoint
  meta?: Record<string, any>
}
export type PresetFactory<Theme extends object = object, PresetOptions extends object | undefined = undefined>
  = (options?: PresetOptions) => Preset<Theme>
```

### Extractor — the scanner

`Extractor.extract(ctx)` returns a `Set`/array of selectors (or `undefined` to skip). Extractors define what the generator even *sees*. See `core-extractors.md` for the default extractor and the Pug/Svelte/MDC/arbitrary-variants extractors.

```ts [types.ts]
export interface Extractor {
  name: string
  order?: number
  /** Extract the code and return a list of selectors. Return `undefined` to skip. */
  extract?: (ctx: ExtractorContext) => Awaitable<Set<string> | CountableSet<string> | string[] | undefined | void>
}
```

### Preflight — global CSS

`Preflight.getCSS(ctx)` returns a CSS string emitted into its `layer` (default `preflights`), independent of any utility. Presets use preflights for base styles, CSS variables and resets. Distinct from `@unocss/reset` (importable reset stylesheets) and `safelist` (utilities always generated).

```ts [types.ts]
export interface Preflight<Theme extends object = object> {
  getCSS: (context: PreflightContext<Theme>) => Promise<string | undefined> | string | undefined
  layer?: string  // @default 'preflights'
}
```

## Monorepo package map

UnoCSS is a monorepo. Three package groups matter:

| Group | Key packages | Role |
| --- | --- | --- |
| **packages-engine** | `@unocss/core`, `@unocss/cli`, `@unocss/config`, `@unocss/autocomplete` | The isomorphic engine (generator, types, config resolution, default extractor), the standalone `unocss` CLI, `uno.config.*` discovery, and editor suggestions. |
| **packages-presets** | `preset-mini`, `preset-wind3`, `preset-wind4`, `preset-icons`, `preset-attributify`, `preset-typography`, `preset-web-fonts`, `preset-tagify`, `preset-rem-to-px`, `preset-legacy-compat`; transformers (`directives`, `variant-group`, `compile-class`, `attributify-jsx`); extractors (`pug`, `mdc`, `svelte`, `arbitrary-variants`); plus `@unocss/reset` and `@unocss/rule-utils`. | All official presets, transformers, extractors and helpers. |
| **packages-integrations** | `@unocss/vite`, `@unocss/webpack`, `@unocss/postcss`, `@unocss/nuxt`, **`@unocss/astro`**, `@unocss/svelte-scoped`, `@unocss/runtime`, `@unocss/eslint-plugin`, `@unocss/language-server`, `@unocss/inspector` | Build tools, frameworks, runtime/CDN, and IDE/quality tooling. Each is a thin wrapper over `createGenerator` plus environment glue. |

The `unocss` meta package re-exports core + `preset-wind3` + common transformers. `@unocss/preset-uno` and `@unocss/preset-wind` (in `packages-deprecated`) are deprecated aliases of `@unocss/preset-wind4`.

> **Astro note:** `import UnoCSS from 'unocss/astro'` wires the engine into Astro's Vite pipeline. `client:only` islands are **not** scanned by the Vite transform automatically — place them in `src/components/` or add their path to UnoCSS's `content` config so their classes are extracted. See `core-extractors.md`.

<!--
Source references:
- packages-engine/core/src/generator.ts (v66.7.0)
- packages-engine/core/src/types.ts (v66.7.0)
- https://github.com/unocss/unocss
-->
