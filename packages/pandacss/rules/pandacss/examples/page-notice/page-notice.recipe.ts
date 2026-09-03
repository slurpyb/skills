import { defineParts, defineRecipe } from "@pandacss/dev"

// colorPalette showcase: `tone` ONLY swaps the palette scope; `emphasis` picks
// shades generically via colorPalette.<shade>. 4 tones × 2 emphases = 8 looks
// without an M×N variant explosion. compoundVariants fixes the single low-contrast case.
const parts = defineParts({
  root:  { selector: "&[data-part='root']" },
  icon:  { selector: "& [data-part='icon']" },
  title: { selector: "& [data-part='title']" },
  body:  { selector: "& [data-part='body']" },
  cta:   { selector: "& [data-part='cta']" },
})

export const pageNotice = defineRecipe({
  className: "page-notice",
  description: "Prominent page-level message",
  base: parts({
    root:  { display: "grid", gridTemplateColumns: "auto 1fr", gap: "4", alignItems: "start",
             padding: "4", rounded: "lg", borderWidth: "1px" },
    icon:  { display: "grid", placeItems: "center", boxSize: "6", "& svg": { boxSize: "6" } },
    title: { textStyle: "heading.h3", marginBlockEnd: "1" },
    body:  { textStyle: "body.sm" },
    cta:   { marginBlockStart: "2", fontWeight: "medium", color: "colorPalette.700",
             textDecoration: "underline", _hover: { color: "colorPalette.800" } },
  }),
  variants: {
    tone: {
      info:    parts({ root: { colorPalette: "accent" } }),
      success: parts({ root: { colorPalette: "green" } }),
      warning: parts({ root: { colorPalette: "amber" } }),
      error:   parts({ root: { colorPalette: "red" } }),
    },
    emphasis: {
      subtle: parts({
        root: { bg: "colorPalette.100", borderColor: "colorPalette.200", color: "colorPalette.800" },
        icon: { color: "colorPalette.700" },
      }),
      solid: parts({
        root: { bg: "colorPalette.500", borderColor: "colorPalette.600", color: "white" },
        icon: { color: "white" },
        cta:  { color: "white/90", _hover: { color: "white" } },   // opacity modifier
      }),
    },
  },
  compoundVariants: [
    // amber.500 solid is too light for white text — bump contrast for this combo only
    { tone: "warning", emphasis: "solid", css: parts({ root: { color: "amber.950" }, cta: { color: "amber.950" } }) },
  ],
  defaultVariants: { tone: "info", emphasis: "subtle" },
})
