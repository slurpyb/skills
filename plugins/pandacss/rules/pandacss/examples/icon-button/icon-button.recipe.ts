import { defineRecipe } from "@pandacss/dev"

// Single-element component with variants → config recipe (defineRecipe).
// The recipe owns ONLY appearance. Behavior stays on the native <button>/<a>.
export const iconButton = defineRecipe({
  className: "icon-btn",
  description: "Square icon-only button or link",
  base: {
    display: "inline-grid",
    placeItems: "center",
    rounded: "md",
    color: "fg.default",
    cursor: "pointer",
    transition: "background",
    transitionDuration: "fast",
    _motionReduce: { transition: "none" },
    _hover: { bg: "bg.muted" },
    _focusVisible: { focusRing: "outside" },     // custom utility, keyboard ring only
    _disabled: { opacity: 0.5, cursor: "not-allowed" },
  },
  variants: {
    tone: {
      neutral: { color: "fg.default" },
      danger:  { color: "fg.danger" },
    },
    size: {
      sm: { boxSize: "8",  "& svg": { boxSize: "4" } },
      md: { boxSize: "10", "& svg": { boxSize: "5" } },
    },
  },
  defaultVariants: { tone: "neutral", size: "md" },
})
