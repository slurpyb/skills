import { defineParts, defineRecipe } from "@pandacss/dev"

const parts = defineParts({
  root:    { selector: "&[data-part='root']" },
  control: { selector: "& [data-part='control']" },
  input:   { selector: "& [data-part='input']" },
  trigger: { selector: "& [data-part='trigger']" },
  overlay: { selector: "& [data-part='overlay']" },
  listbox: { selector: "& [data-part='listbox']" },
  option:  { selector: "& [data-part='option']" },
  empty:   { selector: "& [data-part='empty']" },
})

export const combobox = defineRecipe({
  className: "combobox",
  description: "Text input with a filtered listbox overlay",
  base: parts({
    // root carries the single state attribute; cross-part show/hide is expressed
    // here (in the recipe, root-scoped) — never in markup.
    root: {
      position: "relative", display: "block",
      "&[data-state=expanded] [data-part='overlay']": { display: "block" },
      "&[data-state=expanded] [data-part='trigger'] svg": { rotate: "180deg" },
    },
    control: {
      display: "flex", alignItems: "center",
      borderWidth: "1px", borderColor: "border.default", rounded: "md", bg: "bg.surface",
      _focusWithin: { focusRing: "outside" },   // ring on the wrapper while input focuses
    },
    input: {
      flex: "1", minInlineSize: "0",
      paddingInline: "3", paddingBlock: "2", bg: "transparent", color: "fg.default",
      _placeholder: { color: "fg.muted" },
      _focusVisible: { outline: "none" },
    },
    trigger: {
      display: "grid", placeItems: "center", boxSize: "8", color: "fg.muted", cursor: "pointer",
      "& svg": { transition: "rotate", transitionDuration: "fast", _motionReduce: { transition: "none" } },
    },
    overlay: {
      layerStyle: "surface.overlay",
      position: "absolute", insetBlockStart: "calc(100% + 4px)", insetInline: "0",
      zIndex: "dropdown", display: "none",
    },
    listbox: { maxBlockSize: "16rem", overflowY: "auto", paddingBlock: "1" },
    option: {
      paddingInline: "3", paddingBlock: "2", cursor: "pointer", color: "fg.default",
      _hover: { bg: "bg.muted" },
      "&[aria-selected=true]": { bg: "bg.muted", fontWeight: "medium" },
    },
    empty: { paddingInline: "3", paddingBlock: "2", color: "fg.muted", textStyle: "body.sm" },
  }),
  variants: {
    size: {
      sm: parts({ input: { paddingBlock: "1", fontSize: "sm" }, trigger: { boxSize: "7" } }),
      md: parts({}),
    },
  },
  defaultVariants: { size: "md" },
})
