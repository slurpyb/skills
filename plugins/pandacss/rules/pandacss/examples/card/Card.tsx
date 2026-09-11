import { css } from "styled-system/css"
import { styled } from "styled-system/jsx"

// Container query: the card declares a containment context; its body reflows on
// the CARD's width, not the viewport. Intrinsic over breakpoints — the same card
// lays out correctly in a narrow sidebar or a wide main column with no @media.
const Card = styled("article", {
  base: {
    containerType: "inline-size",          // establish the query container
    layerStyle: "surface.raised",
    padding: "4",
  },
})

const cardBody = css({
  display: "grid",
  gap: "4",
  // stacks by default; becomes media-row once the CARD (not the page) is wide enough
  "@container (min-width: 28rem)": {
    gridTemplateColumns: "8rem 1fr",
    alignItems: "center",
  },
})

export function ProductCard({ image, title, children }: {
  image: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <div className={cardBody}>
        <img src={image} alt="" className={css({ inlineSize: "full", rounded: "md" })} />
        <div>
          <h3 className={css({ textStyle: "heading.h3" })}>{title}</h3>
          <p className={css({ textStyle: "body.sm", color: "fg.muted" })}>{children}</p>
        </div>
      </div>
    </Card>
  )
}
