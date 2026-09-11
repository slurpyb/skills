# PandaCSS examples

Worked components that demonstrate the rules in `../` against real widget markup
(adapted from BONES standards-HTML patterns). Each widget is a vertical slice:
recipe (where applicable) + component + usage. Shared theme lives in `_theme/`.

## Two consumption idioms — bind, never call

A recipe is **never executed in a component body** (`recipe({...})` in render
defeats static extraction and re-runs per render). Consume one of two ways:

| Recipe kind | Consume with | Example |
|-------------|--------------|---------|
| Single className — `defineRecipe`, `defineParts`, `cva` | `styled(el, recipe)` — variants become props | IconButton, InlineNotice, Combobox, Tabs, Menu, PageNotice, Checkbox, Tooltip |
| Slots — `defineSlotRecipe`, `sva` | `createStyleContext` — slots distributed via context | Select, Accordion, Dialog |
| Custom component needing extra logic | `recipe.splitVariantProps(props)` (the one blessed in-body call) | Badge |

## Widget → what it demonstrates

| Widget | Recipe API | Notable Panda features |
|--------|-----------|------------------------|
| `icon-button` | `defineRecipe` | styled-bind, custom `focusRing` utility, `_motionReduce` |
| `switch` | `cva` | `styled(label, recipe)`, platform `aria-checked` state |
| `inline-notice` | `defineParts` | single-className parts, tone variants, live region |
| `select` | `sva` | true slots (sibling indicator), `createStyleContext` |
| `combobox` | `defineParts` | root-scoped cross-part state, `layerStyle`, full a11y ownership |
| `menu` | `defineParts` | ARIA menu vs nav classification |
| `toast` | `cva` | live region, `animationStyle`, non-modal |
| `radio` | `defineParts` | native sibling-state selectors, `Stack` pattern at call site |
| `tabs` | `defineParts` | stateful classify, roving tabindex, styled-bind |
| `accordion` | `defineSlotRecipe` | native `<details>`, `createStyleContext` compound API |
| `accordion-compound` | `sva` | `createStyleContext` with an atomic slot recipe |
| `dialog` | `defineSlotRecipe` | one anatomy → alert/confirm variants, `layerStyle` + `textStyle` |
| `page-notice` | `defineParts` | **`colorPalette`** virtual color, **`compoundVariants`**, opacity modifier |
| `tooltip` | `cva` | **group/peer conditions**, `animationStyle`, describes-host a11y |
| `checkbox` | `defineParts` | native `:checked`/`:indeterminate` facade, opacity modifier |
| `badge` | `cva` | **`splitVariantProps`** escape hatch, `cx` merge |
| `card` | inline recipe | **container query** (`containerType` + `@container`) — intrinsic, no `@media` |
| `primitives` | — | built-in patterns (Stack/Flex/Box), `styled.x`, polymorphic `as` |
| `define-utility` | — | custom `focusRing` utility (single token-aware prop) |

## Principles every widget holds

- **Tokens are the single source** — components read semantic tokens; raw tokens
  and literals never appear at call sites.
- **One owner per attribute** — the platform (native element) owns behavior;
  JS owns dynamic ARIA/`data-state`; the recipe owns appearance only.
- **State on the root** — `data-state` / native attributes set once; descendants
  react via selectors or conditions, no prop-drilling.
- **Compose, don't conflate** — arrangement is a pattern (outside), identity is a
  recipe/styled element (inside); patterns never carry state.
- **Intrinsic over breakpoints** — container queries and auto-fit, not viewport
  `@media`, for component-level responsiveness.

## Note on file layout

For review, each widget colocates its recipe next to its component. In a real
project, `defineRecipe`/`defineSlotRecipe`/`defineParts` recipes live under
`theme/preset/recipes/*` and are wired into `panda.config.ts` (see `_theme/`);
`cva`/`sva` stay colocated as shown.
