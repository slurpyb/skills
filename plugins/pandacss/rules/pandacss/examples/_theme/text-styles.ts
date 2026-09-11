import { defineTextStyles } from "@pandacss/dev"

// Typography lives here once — never restated per component.
// Names follow semantic intent (heading.h3, body.sm), not visual size.
export const textStyles = defineTextStyles({
  "heading.h2":  { value: { fontFamily: "heading", fontWeight: "semibold", fontSize: "xl", lineHeight: "1.2" } },
  "heading.h3":  { value: { fontFamily: "heading", fontWeight: "semibold", fontSize: "lg", lineHeight: "1.2" } },
  "body.md":     { value: { fontFamily: "body", fontSize: "md", lineHeight: "1.5" } },
  "body.sm":     { value: { fontFamily: "body", fontSize: "sm", lineHeight: "1.5" } },
  "label.upper": { value: { fontSize: "xs", fontWeight: "medium", letterSpacing: "0.08em", textTransform: "uppercase" } },
})
