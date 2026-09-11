import { defineLayerStyles } from "@pandacss/dev"

// Appearance-only surface presets. NOT layout, NOT typography (those are
// patterns and textStyles). A layerStyle answers "what does this surface look like".
export const layerStyles = defineLayerStyles({
  "surface.overlay": {
    description: "Floating surface for dropdowns, menus, popovers",
    value: {
      bg: "bg.surface",
      borderWidth: "1px",
      borderColor: "border.subtle",
      rounded: "md",
      shadow: "lg",
    },
  },
  "surface.raised": {
    description: "Dialog window / card surface",
    value: {
      bg: "bg.surface",
      borderWidth: "1px",
      borderColor: "border.subtle",
      rounded: "lg",
      shadow: "xl",
    },
  },
})
