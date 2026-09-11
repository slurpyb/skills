import { defineTokens } from "@pandacss/dev"

// THE CORRECTION carried over from the Tailwind SKILL: it managed stacking with
// `@utility z-modal` + `@theme` vars (one class per layer). In Panda this is a
// TOKEN CATEGORY — define the scale once, then `zIndex: "modal"` everywhere
// (recipes, patterns, css). Single source of truth; no per-layer utility classes.
//
// Wire under theme.extend.tokens in panda.config.ts. Components in this library
// already reference these (combobox overlay → "dropdown", tooltip → "tooltip",
// stickyTop → "sticky", dialog backdrop/window → "modal").
export const zIndexTokens = defineTokens.zIndex({
  hide:     { value: -1 },
  base:     { value: 0 },
  dropdown: { value: 1000 },
  sticky:   { value: 1100 },
  overlay:  { value: 1200 },
  modal:    { value: 1300 },
  popover:  { value: 1400 },
  tooltip:  { value: 1500 },
  toast:    { value: 1600 },
})
