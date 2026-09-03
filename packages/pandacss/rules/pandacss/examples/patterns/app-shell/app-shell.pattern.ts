import { definePattern } from "@pandacss/dev"

// EXTENSION TECHNIQUE 3 — wrap a built-in (grid) and add structure (template areas).
// Typed props become typed JSX props: <AppShell sidebar="14rem" aside="18rem" />.
// `aside="0"` collapses to a 2-column shell — branch in transform, not in markup.
export const appShell = definePattern({
  description: "Holy-grail app shell: header / (nav · main · aside) / footer",
  jsxName: "AppShell",          // generates <AppShell> in styled-system/jsx
  jsxElement: "div",
  properties: {
    sidebar: { type: "token", value: "sizes" },
    aside:   { type: "token", value: "sizes" },
  },
  defaultValues: { sidebar: "16rem", aside: "0" },
  transform(props) {
    const { sidebar, aside, ...rest } = props
    const hasAside = aside && aside !== "0"
    return {
      display: "grid",
      minBlockSize: "100dvh",
      gridTemplateRows: "auto 1fr auto",
      gridTemplateColumns: hasAside ? `${sidebar} 1fr ${aside}` : `${sidebar} 1fr`,
      gridTemplateAreas: hasAside
        ? '"header header header" "nav main aside" "footer footer footer"'
        : '"header header" "nav main" "footer footer"',
      ...rest,
    }
  },
})
