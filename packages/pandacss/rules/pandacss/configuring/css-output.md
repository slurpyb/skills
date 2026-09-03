---
description: PandaCSS output & consumption outside the build-time JSX runtime — apply when shipping generated CSS as a standalone artifact, consuming styles as plain class names, sharing tokens across surfaces, or distributing a Panda-based system
paths:
  - "**/panda.config.ts"
  - "**/package.json"
---

# PandaCSS — CSS Output & Consuming Outside the Runtime

Panda's JSX factory (`styled(...)`) and the build-time extractor are conveniences,
not requirements. The generated output is plain CSS plus functions that return
class-name **strings** — usable in any environment that can link a stylesheet and
put a class on an element. Nothing about Panda is bound to a JS framework runtime.

Two pieces cross into a non-runtime surface; the runtime itself does not need to:

1. **The generated CSS** — emitted as a standalone file.
2. **The class names** — recipe/pattern calls return strings you place in markup.

Tokens ride along automatically: they live in `@layer tokens` as CSS custom
properties on the var root, and custom properties inherit, so any element resolves
them — no import, no runtime.

## Emit CSS as a standalone artifact — `panda cssgen`

`panda cssgen` writes the generated CSS to a file. It takes an optional **type**
to emit just one slice: `tokens`, `static`, `preflight`, `global`, `keyframes`.

```bash
panda cssgen tokens  -o dist/tokens.css     # only the design tokens (CSS variables)
panda cssgen static  -o dist/static.css     # only the staticCss-generated rules
panda cssgen         -o dist/styles.css     # the full stylesheet
panda cssgen --splitting                    # per-layer + per-recipe files
panda cssgen --minimal                      # skip tokens/preflight/keyframes/static/global
```

Then any surface links it:

```html
<link rel="stylesheet" href="dist/styles.css">
```

- `tokens` alone is the **shared design contract** — one file of CSS variables every
  surface can consume, framework or not.
- `--splitting` emits an individual file per recipe, so a consumer can load only the
  CSS a given component needs.
- Class names produced outside scanned source need `staticCss` first, or `cssgen`
  has nothing to emit for them (see [Static CSS](static-css.md)).

## Consume as class-name strings

Recipes and patterns are class-name generators. Call them in plain TS/JS and drop
the result into any markup:

```ts
import { button } from "styled-system/recipes"
import { stack } from "styled-system/patterns"

button({ variant: "primary", size: "md" })   // → "button button--variant_primary button--size_md"
stack({ gap: "4" })                            // → "stack ..."
```

The factory binding (`styled(el, recipe)`) is one way to apply these in a JS
framework; the underlying string works everywhere without it.

## Tokens for value consumers

For surfaces that need token **values** rather than CSS (e.g. emitting to another
format), use `emitTokensOnly` (or `panda cssgen tokens`) and the `token()` helper:

```ts
import { token } from "styled-system/tokens"
token("colors.fg.default")        // resolved value
token.var("colors.fg.default")    // var(--...) reference
```

## Distribute a Panda-based system

- **Static CSS** — publish the `cssgen` output; consumers link it.
- **Build info** — `panda ship --outfile dist/panda.buildinfo.json`; consumers add it
  to `include` and set `importMap` to your package, so their build merges your styles.
- **Standalone package** — `panda emit-pkg` writes a `package.json` with entrypoints
  for a dedicated styled-system package.

## Introspect the system to automate class names

For surfaces that assemble class names by hand, derive them from the system's own
metadata rather than hard-coding strings:

- `panda spec` — emits spec files describing the theme, recipes, slots, and parts.
- `panda ship --outfile dist/panda.buildinfo.json` — emits the extract/build info,
  including recipe + slot/part structure.

Feed that output into codegen (a template helper, a Liquid/JSON map, a typed map of
recipe → variants → class strings) so a non-runtime surface stays in sync with the
recipes automatically — change a variant, regenerate, no hand-editing.

## Scope when several systems share a page

`prefix` namespaces generated class names and variables; `cssVarRoot` moves the
token variables off `:root` onto a chosen selector, so independent systems coexist
without collisions.

## Rules

- Treat Panda output as plain CSS + class-name strings; the JSX factory is optional sugar, not a dependency. Don't ship the build-time runtime into a surface that only needs CSS.
- Emit the design tokens once with `panda cssgen tokens` and share that file as the cross-surface contract — tokens inherit through CSS variables, so every consumer resolves them with no runtime.
- For markup Panda can't scan, pair `staticCss` (emit) with `panda cssgen` (ship); apply the resulting class names directly.
- Use `--splitting` to ship per-recipe CSS, `--minimal` to drop the base/token layers when a consumer already has them.
- Distribute via static CSS, `ship` build info + `importMap`, or `emit-pkg` — pick by how much the consumer's own build should merge.
- Namespace shared pages with `prefix` + `cssVarRoot` to avoid class/variable collisions.
- Generate hand-applied class names from `panda spec` / `panda ship` metadata instead of hard-coding them — the recipe/slot/part structure stays the source of truth.

## See also

- [Static CSS](static-css.md)
- [Using tokens](../styling/using-tokens.md)
- [Tokens](../theming/tokens.md)
