import { definePattern } from "@pandacss/dev"

// Enum prop → typed JSX prop with a fixed value set: <Subgrid axis="both" />.
// Inherits the parent grid's tracks so nested children align to the outer grid.
export const subgrid = definePattern({
  description: "Adopt the parent grid's tracks (subgrid)",
  jsxName: "Subgrid",
  jsxElement: "div",
  properties: {
    axis: { type: "enum", value: ["columns", "rows", "both"] },
  },
  defaultValues: { axis: "columns" },
  transform(props) {
    const { axis, ...rest } = props
    return {
      display: "grid",
      gridTemplateColumns: axis === "columns" || axis === "both" ? "subgrid" : undefined,
      gridTemplateRows:    axis === "rows"    || axis === "both" ? "subgrid" : undefined,
      ...rest,
    }
  },
})
