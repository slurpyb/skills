import { cva } from "styled-system/css"

// Non-modal transient notification. role="status" on the outer live region;
// toggling `hidden` on the inner aside triggers the announcement. Must not steal
// focus (aria-modal="false"). Single element styling → cva (hoisted).
const toast = cva({
  base: {
    display: "grid", gridTemplateColumns: "1fr auto", gap: "3", alignItems: "start",
    layerStyle: "surface.raised", padding: "4", maxInlineSize: "24rem",
    animationStyle: "fade-in-up",
    _motionReduce: { animation: "none" },
    "&[hidden]": { display: "none" },
  },
  variants: {
    tone: {
      info:    {},
      success: { borderColor: "green.500" },
      error:   { borderColor: "red.500" },
    },
  },
  defaultVariants: { tone: "info" },
})

export function Toast({ tone, open, children }: {
  tone?: "info" | "success" | "error"
  open: boolean
  children: React.ReactNode
}) {
  return (
    <div role="status" aria-live="polite">
      <aside className={toast({ tone })} role="dialog" aria-modal="false"
             aria-label="Notification" hidden={!open}>
        {children}
      </aside>
    </div>
  )
}
