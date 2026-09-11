import { StickyTop } from "styled-system/jsx"

// JSX with style props composed on top of the pattern's own props.
export function StickyHeaderDemo() {
  return (
    <StickyTop offset="0" bg="bg.surface/80" backdropFilter="blur(8px)"
               borderBlockEndWidth="1px" borderColor="border.subtle" paddingBlock="3" paddingInline="4">
      Navigation
    </StickyTop>
  )
}

// sticky sidebar below a 5rem header — block-size fills the remaining viewport:
// <StickyTop offset="20" blockSize="calc(100dvh - 5rem)" overflowY="auto">…</StickyTop>
