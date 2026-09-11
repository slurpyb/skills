import { defineParts, defineRecipe } from "@pandacss/dev"

// defineParts: a multi-part component styled through ONE className with parts
// targeted by [data-part] descendant selectors. No createStyleContext, no
// per-slot class splitting. Pairs well with a single DOM subtree.
const parts = defineParts({
  root:   { selector: "&[data-part='root']" },   // matches the recipe element itself
  header: { selector: "& [data-part='header']" }, // descendants
  main:   { selector: "& [data-part='main']" },
})

export const inlineNotice = defineRecipe({
  className: "inline-notice",
  description: "Inline status message with a leading icon",
  base: parts({
    root:   { display: "grid", gridTemplateColumns: "auto 1fr", gap: "3",
              alignItems: "start", padding: "3", rounded: "md", textStyle: "body.sm" },
    header: { display: "grid", placeItems: "center", "& svg": { boxSize: "4" } },
    main:   { "& p": { margin: "0" } },
  }),
  variants: {
    tone: {
      confirmation: parts({ root: { bg: "green.100", color: "green.800" }, header: { color: "green.700" } }),
      warning:      parts({ root: { bg: "amber.100", color: "amber.800" }, header: { color: "amber.700" } }),
      error:        parts({ root: { bg: "red.100",   color: "red.800"   }, header: { color: "red.700"   } }),
    },
  },
  defaultVariants: { tone: "confirmation" },
})
