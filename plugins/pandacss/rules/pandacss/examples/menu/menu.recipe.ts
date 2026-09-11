import { defineParts, defineRecipe } from "@pandacss/dev"

// ARIA menu = JS command execution (NOT navigation). If items navigate to URLs,
// it's a nav list and needs no recipe — classify before authoring.
const parts = defineParts({
  root:      { selector: "&[data-part='root']" },
  menu:      { selector: "& [data-part='menu']" },
  item:      { selector: "& [data-part='item']" },
  separator: { selector: "& [data-part='separator']" },
})

export const menu = defineRecipe({
  className: "menu",
  description: "ARIA menu popover for commands",
  base: parts({
    root:      { position: "relative" },
    menu:      { layerStyle: "surface.overlay", minInlineSize: "12rem", padding: "1",
                 display: "flex", flexDirection: "column" },
    item:      { display: "flex", alignItems: "center", gap: "2",
                 paddingInline: "3", paddingBlock: "2", rounded: "sm", cursor: "pointer",
                 color: "fg.default",
                 _hover: { bg: "bg.muted" },
                 "&[aria-disabled=true]": { color: "fg.muted", cursor: "not-allowed" } },
    separator: { blockSize: "1px", bg: "border.subtle", marginBlock: "1" },
  }),
})
