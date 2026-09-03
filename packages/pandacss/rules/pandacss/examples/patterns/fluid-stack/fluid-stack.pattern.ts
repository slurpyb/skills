import { definePattern } from "@pandacss/dev"

// Fluid section padding via clamp() between two spacing TOKENS — no breakpoints,
// no raw px. Logical padding (paddingBlock/paddingInline). The block padding
// scales with viewport between the token bounds.
export const fluidSection = definePattern({
  description: "Section with fluid block/inline padding clamped between token bounds",
  jsxName: "FluidSection",
  jsxElement: "section",
  properties: {
    min: { type: "token", value: "spacing" },
    max: { type: "token", value: "spacing" },
  },
  defaultValues: { min: "4", max: "8" },
  transform(props) {
    const { min, max, ...rest } = props
    return {
      paddingBlock:  `clamp(token(spacing.${min}), 5vw, token(spacing.${max}))`,
      paddingInline: `clamp(token(spacing.${min}), 3vw, token(spacing.${max}))`,
      ...rest,
    }
  },
})
