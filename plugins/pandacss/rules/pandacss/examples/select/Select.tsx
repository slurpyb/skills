import { sva } from "styled-system/css"
import { createStyleContext } from "../lib/createStyleContext"

// sva: atomic slot recipe (genuine slots — the indicator is a SIBLING of <select>,
// not a descendant, so per-slot classes beat defineParts here). Consumed via
// createStyleContext so NO recipe() call appears in render; variant props live on
// the provider.
const select = sva({
  slots: ["root", "control", "indicator"],
  base: {
    root:      { position: "relative", display: "inline-grid", alignItems: "center" },
    control:   { appearance: "none", paddingInline: "3", paddingBlock: "2", paddingInlineEnd: "8",
                 rounded: "md", borderWidth: "1px", borderColor: "border.default",
                 bg: "bg.surface", color: "fg.default",
                 _focusVisible: { focusRing: "outside" } },
    indicator: { position: "absolute", insetInlineEnd: "3", pointerEvents: "none",
                 color: "fg.muted", boxSize: "2" },
  },
  variants: { size: { sm: { control: { paddingBlock: "1", fontSize: "sm" } }, md: {} } },
  defaultVariants: { size: "md" },
})

const { withProvider, withContext } = createStyleContext(select)
const SelectRoot      = withProvider("span", "root")
const SelectControl   = withContext("select", "control")
const SelectIndicator = withContext("svg", "indicator")

export function Select({ size, name, children }: {
  size?: "sm" | "md"
  name: string
  children: React.ReactNode
}) {
  return (
    <SelectRoot size={size}>
      <SelectControl name={name}>{children}</SelectControl>
      <SelectIndicator aria-hidden="true"><use href="#icon-chevron-down" /></SelectIndicator>
    </SelectRoot>
  )
}

// usage:
// <Select name="sort" size="sm"><option>Newest</option><option>Oldest</option></Select>
