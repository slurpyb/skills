import { definePattern } from "@pandacss/dev"

// Newspaper text columns. `min` sets column width → browser fits as many as the
// container allows (intrinsic, no breakpoints). Reading measure stays controlled.
export const textColumns = definePattern({
  description: "Flowing text columns sized by min column width",
  jsxName: "TextColumns",
  jsxElement: "div",
  properties: {
    min: { type: "token", value: "sizes" },
    gap: { type: "token", value: "spacing" },
  },
  defaultValues: { min: "measure.narrow", gap: "8" },   // semantic ch measure, not a px/rem width
  transform(props) {
    const { min, gap, ...rest } = props
    return {
      columnWidth: min,
      columnGap: gap,
      "& > * + *": { marginBlockStart: "0" },   // columns handle rhythm; no owl needed inside
      ...rest,
    }
  },
})
