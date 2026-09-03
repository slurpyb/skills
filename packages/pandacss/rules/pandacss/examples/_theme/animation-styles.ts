import { defineAnimationStyles } from "@pandacss/dev"

// animationName + duration + easing bundled into a named token.
// Keyframes (below) must stay in sync with the animationName referenced here.
export const animationStyles = defineAnimationStyles({
  "fade-in": {
    value: {
      animationName: "fade-in",
      animationDuration: "fast",
      animationTimingFunction: "ease-out",
      animationFillMode: "both",
    },
  },
  "fade-in-up": {
    value: {
      animationName: "fade-in-up",
      animationDuration: "fast",
      animationTimingFunction: "ease-out",
      animationFillMode: "both",
    },
  },
})

export const keyframes = {
  "fade-in":    { from: { opacity: 0 }, to: { opacity: 1 } },
  "fade-in-up": {
    from: { opacity: 0, translate: "0 4px" },
    to:   { opacity: 1, translate: "0 0" },
  },
}
