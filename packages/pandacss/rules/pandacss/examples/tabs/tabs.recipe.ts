import { defineParts, defineRecipe } from "@pandacss/dev"

// Tabs via defineParts (no createStyleContext). Selected state reads the
// platform's own aria-selected — the single source of truth. JS owns roving
// tabindex + aria-selected; the recipe owns appearance only.
const parts = defineParts({
  root:  { selector: "&[data-part='root']" },
  list:  { selector: "& [data-part='list']" },
  tab:   { selector: "& [data-part='tab']" },
  panel: { selector: "& [data-part='panel']" },
})

export const tabs = defineRecipe({
  className: "tabs",
  description: "Client-side tab panels",
  base: parts({
    root:  { display: "flex", flexDirection: "column", gap: "4" },
    list:  { display: "flex", gap: "1", borderBlockEndWidth: "1px", borderColor: "border.default" },
    tab:   { paddingInline: "4", paddingBlock: "2", color: "fg.muted", cursor: "pointer",
             bg: "transparent", borderWidth: "0",
             _focusVisible: { focusRing: "inside" },
             "&[aria-selected=true]": { color: "fg.default",
               boxShadow: "inset 0 -2px 0 token(colors.accent.500)" } },
    panel: { _focusVisible: { focusRing: "outside" } },
  }),
})
