import { styled } from "styled-system/jsx"
import { pageNotice } from "styled-system/recipes"

// styled-bind: tone + emphasis are props, no recipe() call. role="status" makes
// it a live region for dynamic page messages.
const NoticeRoot = styled("section", pageNotice)

export function PageNotice({ tone, emphasis, icon, title, children, cta }: {
  tone?: "info" | "success" | "warning" | "error"
  emphasis?: "subtle" | "solid"
  icon: string
  title: string
  children: React.ReactNode
  cta?: { href: string; label: string }
}) {
  return (
    <NoticeRoot tone={tone} emphasis={emphasis} data-part="root" role="status" aria-label={title}>
      <span data-part="icon" aria-hidden="true"><svg><use href={icon} /></svg></span>
      <div data-part="body">
        <h2 data-part="title">{title}</h2>
        <p>{children}</p>
        {cta && <a data-part="cta" href={cta.href}>{cta.label}</a>}
      </div>
    </NoticeRoot>
  )
}

// usage:
// <PageNotice tone="success" emphasis="solid" icon="#icon-check" title="Saved"
//             cta={{ href: "/changes", label: "View changes" }}>Your changes are live.</PageNotice>
