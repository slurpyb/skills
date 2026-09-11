import { definePattern } from "@pandacss/dev"
import { grid } from "styled-system/patterns"

// EXTENSION TECHNIQUE 2 — compose via .raw(). Reuse the built-in `grid` pattern's
// logic (minChildWidth → repeat(auto-fit, minmax)) instead of re-deriving it, then
// add the edge-case fix the source SKILL calls out (children must be able to shrink).
// Intrinsic responsive: tracks adapt to the container, no breakpoints.
export const cardGrid = definePattern({
  description: "Auto-fitting card grid that reflows by available width",
  jsxName: "CardGrid",
  jsxElement: "div",
  properties: {
    min: { type: "token", value: "sizes" },
  },
  defaultValues: { min: "16rem" },
  transform(props) {
    const { min, ...rest } = props
    return {
      ...grid.raw({ minChildWidth: min, gap: "6" }),
      "& > *": { minWidth: "0" },           // prevent track blowout from long content
      ...rest,
    }
  },
})
