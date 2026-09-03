import { definePattern } from "@pandacss/dev"

// CSS multi-column masonry. Intrinsic: column count derives from `min` width, not
// breakpoints. Logical properties throughout (columnGap, marginBlockEnd).
export const masonry = definePattern({
  description: "Column-flow masonry; tracks derive from min column width",
  jsxName: "Masonry",
  jsxElement: "div",
  properties: {
    min: { type: "token", value: "sizes" },
    gap: { type: "token", value: "spacing" },
  },
  defaultValues: { min: "16rem", gap: "4" },
  transform(props) {
    const { min, gap, ...rest } = props
    return {
      columnWidth: min,
      columnGap: gap,
      "& > *": { breakInside: "avoid", marginBlockEnd: gap },
      ...rest,
    }
  },
})
