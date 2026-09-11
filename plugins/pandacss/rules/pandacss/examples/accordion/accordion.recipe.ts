import { defineSlotRecipe } from "@pandacss/dev"

// Config slot recipe. Demonstrates the slots API (per-slot class map). Built on
// native <details>/<summary> so open/close behavior is the platform's, not JS's.
// Open-state styling keys off the native [open] attribute on the host.
export const accordion = defineSlotRecipe({
  className: "accordion",
  description: "Disclosure list on native <details>",
  slots: ["root", "item", "summary", "panel"],
  base: {
    root:    { display: "flex", flexDirection: "column" },
    item:    { borderBlockEndWidth: "1px", borderColor: "border.default" },
    summary: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      paddingBlock: "3", cursor: "pointer", textStyle: "label.upper", listStyle: "none",
      "&::-webkit-details-marker": { display: "none" },
      _focusVisible: { focusRing: "inside" },
      "& svg": { transition: "rotate", transitionDuration: "fast", _motionReduce: { transition: "none" } },
      // react to the platform's own open state
      "[open] > &": { "& svg": { rotate: "180deg" } },
    },
    panel:   { paddingBlockEnd: "4", color: "fg.muted" },
  },
  variants: {
    size: {
      sm: { summary: { paddingBlock: "2", fontSize: "sm" }, panel: { paddingBlockEnd: "3" } },
      md: {},
    },
  },
  defaultVariants: { size: "md" },
})
