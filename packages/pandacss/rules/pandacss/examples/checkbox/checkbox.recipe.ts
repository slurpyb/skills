import { defineParts, defineRecipe } from "@pandacss/dev"

// Native checkbox owns behavior; the SVG facade is decoration that reads the
// input's :checked / :indeterminate / :focus-visible via sibling selectors —
// input stays the single source of truth.
const parts = defineParts({
  root:    { selector: "&[data-part='root']" },
  control: { selector: "& [data-part='control']" },   // the real <input>, visually hidden
  facade:  { selector: "& [data-part='facade']" },
  label:   { selector: "& [data-part='label']" },
})

export const checkbox = defineRecipe({
  className: "checkbox",
  description: "Native checkbox with an SVG facade",
  base: parts({
    root:    { display: "inline-flex", alignItems: "center", gap: "2", cursor: "pointer" },
    control: { position: "absolute", opacity: 0, boxSize: "0" },   // hidden, still focusable/announced
    facade:  {
      display: "grid", placeItems: "center", boxSize: "5", rounded: "sm",
      borderWidth: "1px", borderColor: "border.default", bg: "bg.surface", color: "transparent",
      transition: "all", transitionDuration: "fast", _motionReduce: { transition: "none" },
      "& svg": { boxSize: "3.5" },
      "input:checked + &":       { bg: "accent.500", borderColor: "accent.500", color: "white" },
      "input:indeterminate + &": { bg: "accent.500/70", borderColor: "accent.500", color: "white" },
      "input:focus-visible + &": { focusRing: "outside" },
      "input:disabled + &":      { bg: "bg.muted", borderColor: "border.subtle" },
    },
    label:   { textStyle: "body.sm", color: "fg.default" },
  }),
})
