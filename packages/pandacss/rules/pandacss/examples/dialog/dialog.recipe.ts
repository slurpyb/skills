import { defineSlotRecipe } from "@pandacss/dev"

// Dialog family: one anatomy reused by alert/confirm/panel variants — they change
// only what differs, never redraw the parts. Window surface = a layerStyle; title
// = a textStyle. State (open) lives on the root as data-state; parts react.
export const dialog = defineSlotRecipe({
  className: "dialog",
  description: "Modal dialog; base for alert/confirm",
  slots: ["backdrop", "window", "header", "title", "main", "footer"],
  base: {
    backdrop: {
      position: "fixed", inset: "0", bg: "ink/50", display: "none",
      "[data-state=open] > &, &[data-state=open]": { display: "block" },
    },
    window: {
      layerStyle: "surface.raised",
      position: "fixed", insetBlockStart: "50%", insetInlineStart: "50%", translate: "-50% -50%",
      inlineSize: "min(90vw, 32rem)", display: "flex", flexDirection: "column", gap: "4", padding: "6",
      animationStyle: "fade-in-up", _motionReduce: { animation: "none" },
    },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    title:  { textStyle: "heading.h3" },
    main:   { color: "fg.muted", textStyle: "body.md" },
    footer: { display: "flex", justifyContent: "flex-end", gap: "2" },
  },
  variants: {
    tone: {
      neutral: {},
      danger:  { title: { color: "fg.danger" } },
    },
  },
  defaultVariants: { tone: "neutral" },
})
