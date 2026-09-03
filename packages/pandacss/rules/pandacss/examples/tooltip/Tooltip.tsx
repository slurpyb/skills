import { useId } from "react"
import { css, cva } from "styled-system/css"
import { styled } from "styled-system/jsx"

// cva (atomic, hoisted to module scope) bound to styled. Visibility is driven by
// the HOST's state via group conditions — no JS for the common case. Entrance via
// animationStyle, paired with _motionReduce. The open state is NOT aria-expanded
// (reserved for popovers); the tooltip describes the host via aria-describedby.
const tooltipPanel = cva({
  base: {
    position: "absolute", insetBlockEnd: "calc(100% + 6px)", insetInlineStart: "50%",
    translate: "-50% 0", zIndex: "tooltip",
    paddingInline: "2", paddingBlock: "1", rounded: "sm",
    bg: "fg.default", color: "bg.surface", textStyle: "body.sm", whiteSpace: "nowrap",
    pointerEvents: "none", opacity: 0, visibility: "hidden",
    _groupHover:        { opacity: 1, visibility: "visible", animationStyle: "fade-in-up" },
    _groupFocusVisible: { opacity: 1, visibility: "visible", animationStyle: "fade-in-up" },
    _motionReduce: { animation: "none" },
  },
})

const TooltipPanel = styled("span", tooltipPanel)

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const id = useId()
  return (
    <span className={css({ position: "relative", display: "inline-flex" })}>
      {/* host carries the `group` marker + aria-describedby; native element owns behavior */}
      <span className="group" aria-describedby={id} tabIndex={0}>{children}</span>
      <TooltipPanel id={id} role="tooltip">{label}</TooltipPanel>
    </span>
  )
}
