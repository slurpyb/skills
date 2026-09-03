import { definePattern } from "@pandacss/dev"

// Sticky header/sidebar. Logical inset (insetBlockStart, not `top`). z-index is a
// TOKEN (`zIndex: "sticky"`), never a magic number or per-layer utility class.
export const stickyTop = definePattern({
  description: "Sticky to the block-start edge with a token offset + z layer",
  jsxName: "StickyTop",
  jsxElement: "div",
  properties: {
    offset: { type: "token", value: "spacing" },
  },
  defaultValues: { offset: "0" },
  transform(props) {
    const { offset, ...rest } = props
    return {
      position: "sticky",
      insetBlockStart: offset,
      zIndex: "sticky",
      ...rest,
    }
  },
})
