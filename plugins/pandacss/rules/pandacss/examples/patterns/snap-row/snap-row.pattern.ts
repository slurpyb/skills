import { definePattern } from "@pandacss/dev"
import { flex } from "styled-system/patterns"

// Compose on built-in `flex` (.raw) + add scroll-snap. Logical scroll padding
// (scrollPaddingInline). Children opt into snap alignment via the `& > *` rule.
export const snapRow = definePattern({
  description: "Horizontal scroll-snap carousel row",
  jsxName: "SnapRow",
  jsxElement: "div",
  properties: {
    gap:    { type: "token", value: "spacing" },
    inset:  { type: "token", value: "spacing" },   // scroll padding at the start edge
  },
  defaultValues: { gap: "4", inset: "6" },
  transform(props) {
    const { gap, inset, ...rest } = props
    return {
      ...flex.raw({ gap }),
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      scrollPaddingInline: inset,
      "& > *": { scrollSnapAlign: "start", flexShrink: "0" },
      ...rest,
    }
  },
})
