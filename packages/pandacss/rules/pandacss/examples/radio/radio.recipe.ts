import { defineParts, defineRecipe } from "@pandacss/dev"

// Native radio owns behavior; the facade is decoration reading the input's
// :checked / :focus-visible via sibling selectors. Input stays single source of truth.
const parts = defineParts({
  root:    { selector: "&[data-part='root']" },
  control: { selector: "& [data-part='control']" },
  label:   { selector: "& [data-part='label']" },
})

export const radio = defineRecipe({
  className: "radio",
  description: "Native radio with an SVG facade",
  base: parts({
    root:    { display: "flex", alignItems: "center", gap: "2", cursor: "pointer" },
    control: {
      boxSize: "5", rounded: "full", borderWidth: "1px", borderColor: "border.default", bg: "bg.surface",
      transition: "all", transitionDuration: "fast", _motionReduce: { transition: "none" },
      "input:checked + &":       { borderColor: "accent.500", borderWidth: "5px" },
      "input:focus-visible + &": { focusRing: "outside" },
      "input:disabled + &":      { bg: "bg.muted", borderColor: "border.subtle" },
    },
    label:   { textStyle: "body.sm", color: "fg.default" },
  }),
})
