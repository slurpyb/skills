import { defineSemanticTokens } from "@pandacss/dev"

// Semantic tokens — intent-named references. Components consume THESE.
// Conditional values (base/_dark) give theme switching for free.
export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: {
      surface: { value: { base: "{colors.paper}", _dark: "{colors.ink}" } },
      muted:   { value: "{colors.ink/5}" },
    },
    fg: {
      default: { value: { base: "{colors.ink}", _dark: "{colors.paper}" } },
      muted:   { value: "{colors.ink/60}" },
      danger:  { value: "{colors.red.700}" },
    },
    border: {
      default: { value: "{colors.ink/15}" },
      subtle:  { value: "{colors.ink/10}" },
    },
  },
  sizes: {
    // Reading measure (ch-based, born semantic). DEFAULT is the bare name —
    // `maxW: "measure"` → 65ch, `maxW: "measure.narrow"` → 48ch.
    measure: {
      DEFAULT: { value: "65ch" },   // full reading width
      narrow:  { value: "48ch" },   // single text column
    },
  },
})
