import { cva } from "styled-system/css"
import { styled } from "styled-system/jsx"

// Atomic recipe (cva) — colocated, eager. Hoisted to module scope (NEVER created
// inside a component body). Bound to a `styled()` factory so `size` becomes a
// typed prop and the ref forwards automatically.
const switchRecipe = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "2",
    cursor: "pointer",
    "& [data-part=track]": {
      inlineSize: "9", blockSize: "5", rounded: "full", bg: "border.default",
      padding: "0.5", transition: "background", transitionDuration: "fast",
      _motionReduce: { transition: "none" },
    },
    "& [data-part=thumb]": {
      boxSize: "4", rounded: "full", bg: "bg.surface",
      transition: "translate", transitionDuration: "fast",
      _motionReduce: { transition: "none" },
    },
    // state from the platform attribute (aria-checked), not an invented flag
    "&[aria-checked=true] [data-part=track]": { bg: "accent.500" },
    "&[aria-checked=true] [data-part=thumb]": { translate: "1rem 0" },
    _focusVisible: { focusRing: "outside" },
  },
  variants: {
    size: {
      sm: { "& [data-part=track]": { inlineSize: "7", blockSize: "4" }, "& [data-part=thumb]": { boxSize: "3" } },
      md: {},
    },
  },
  defaultVariants: { size: "md" },
})

export const Switch = styled("label", switchRecipe)

// usage — control owns aria-checked; the styled label owns appearance.
// <Switch size="sm" aria-checked={on}>
//   <input type="checkbox" role="switch" aria-checked={on} className={css({ srOnly: true })} />
//   <span data-part="track"><span data-part="thumb" /></span>
//   <span>Free shipping</span>
// </Switch>
