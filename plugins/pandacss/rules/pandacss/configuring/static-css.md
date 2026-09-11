---
description: PandaCSS staticCss — apply when styles must exist for markup Panda's extractor does not scan (plain HTML, templated/server-rendered output, runtime-assembled class names) or for values not known at build time
paths:
  - "**/panda.config.ts"
  - "**/*.recipe.ts"
  - "**/recipes/**/*.ts"
  - "**/slot-recipes/**/*.ts"
---

# PandaCSS — Static CSS (`staticCss`)

Panda's generator is usage-driven: it emits CSS for the utilities, recipes, and
variants it finds while scanning your `include` globs. Anything it cannot see
gets no CSS — and the failure is silent (correct class name, no rule behind it).

`staticCss` is the contract that pre-generates CSS independent of scanning. Reach
for it whenever the class names are produced where the extractor can't follow:

- markup outside the scanned source (plain HTML, server-rendered or templated output)
- class names assembled at runtime from data, or chosen from a variable
- a recipe consumed without a scannable call site

## Config form

```ts
// panda.config.ts
export default defineConfig({
  staticCss: {
    css: [
      // utilities: which properties × which values × which conditions
      { properties: { display: ["none", "flex", "grid"] }, responsive: true },
      { properties: { color: ["fg.default", "fg.muted"] }, conditions: ["hover", "focus"] },
    ],
    recipes: {
      button: [{ size: ["*"], variant: ["*"] }],   // every size × variant
      dialog: ["*"],                                  // every variant
    },
    themes: ["dark"],                                 // theme variants, if used
  },
})
```

Recipe-local form keeps the contract next to the recipe:

```ts
defineRecipe({
  className: "button",
  // ...
  staticCss: [{ size: ["*"], variant: ["*"] }],
})
```

`["*"]` means every value/variant; an explicit array narrows it.

## Cost

Pre-generating trades away Panda's lean, usage-based output — every requested
combination ships whether used or not. Keep it scoped:

- Pin explicit values over `["*"]` when the set is large.
- Apply `responsive: true` only to properties that actually vary by breakpoint.
- Reserve wildcards for small recipes / token sets.

## Rules

- Use `staticCss` as the emission contract for any class name Panda's extractor can't see — it turns the silent "class with no rule" failure into a guarantee.
- Prefer recipe-local `staticCss` for component variants (the contract lives with the recipe); use config `staticCss.css` for raw utilities a non-scanned surface needs.
- Scope it: pin values, limit `responsive`, and keep `["*"]` for small sets — broad wildcards forfeit usage-based leanness.
- Pair with `panda cssgen` to emit the result as a standalone stylesheet (see [CSS output](css-output.md)).

## See also

- [CSS output & shipping](css-output.md)
- [Recipes](../composing/recipes.md)
