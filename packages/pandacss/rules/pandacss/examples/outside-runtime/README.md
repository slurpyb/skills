# Outside the runtime — cssgen + manual class application

No JS framework, no `styled()`, no extractor scanning these files. Just generated
CSS linked into a page, and class names written by hand. This is what the recipe /
slot-recipe / parts-recipe systems look like when consumed as plain CSS.

## Build step (once)

Recipes only emit variants Panda *sees*. Hand-written markup isn't scanned, so the
variants are declared up front with `staticCss`, then emitted to a file:

```ts
// panda.config.ts
staticCss: {
  recipes: {
    "icon-btn": [{ tone: ["*"], size: ["*"] }],   // recipe
    dialog:     ["*"],                              // slot recipe — every variant
    combobox:   ["*"],                              // defineParts recipe
  },
}
```

```bash
panda cssgen -o dist/styles.css        # full stylesheet (tokens + recipes + ...)
# or slice it:
panda cssgen tokens -o dist/tokens.css # just the CSS variables
panda cssgen --splitting               # per-recipe files under styles/recipes/
```

```html
<link rel="stylesheet" href="dist/styles.css">
```

Tokens resolve through inherited CSS variables — no import needed on any element.

## The three apply-shapes (generated class-name patterns)

| Recipe kind | Class pattern | Applied as |
|---|---|---|
| `defineRecipe` | `name`, `name--key-value` | several classes on one element — `recipe.html` |
| `defineSlotRecipe` | `name__slot`, `name__slot--key-value` | a class set per slot, across elements — `slot-recipe.html` |
| `defineParts` | `name` + `[data-part]` | one class on the root, parts marked by attribute — `recipe-parts.html` |

The recipe/pattern functions still exist (`iconButton({ tone })` returns the same
string) — these files just show the literal output so the markup is runtime-free.

## Automate the class names

Don't hand-maintain these strings at scale. `panda spec` and `panda ship` emit the
recipe / slot / part structure as machine-readable metadata — generate the class
maps from that, so the markup tracks the recipes automatically. See
`automate-classnames.ts` for builders (recipe / slot recipe / parts) that reproduce
the exact strings the `.html` files hardcode, fed from that metadata.

`defineParts` selectors are also arbitrary — `[data-part]` is the convention here,
but a part can target any selector you choose to match existing markup.
