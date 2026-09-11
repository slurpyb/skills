import { styled } from "styled-system/jsx"
import { inlineNotice } from "styled-system/recipes"

// Single-className recipe bound to styled. `tone` is a prop; no recipe call.
// data-part="root" goes on this same element (the recipe's root selector matches it).
const NoticeRoot = styled("div", inlineNotice)

export function InlineNotice({ tone, icon, children, live }: {
  tone?: "confirmation" | "warning" | "error"
  icon: string
  children: React.ReactNode
  live?: boolean
}) {
  const notice = (
    <NoticeRoot tone={tone} data-part="root">
      <span data-part="header" aria-hidden="true"><svg><use href={icon} /></svg></span>
      <span data-part="main">{children}</span>
    </NoticeRoot>
  )
  return live ? <div aria-live="polite" role="status">{notice}</div> : notice
}

// usage:
// <InlineNotice tone="error" icon="#icon-error" live><p>Payment failed.</p></InlineNotice>
