import { definePattern } from "@pandacss/dev"

// EXTENSION TECHNIQUE 1 — override a built-in's defaults by redefining its key in
// patterns.extend. Every <Container> / container() in the app now carries these
// gutters + max-width, with no per-call config. Project-wide consistency for free.
//
// (Wire this under patterns.extend.container in panda.config.ts — see patterns.config.ts.)
export const container = definePattern({
  description: "Project container — centered, gutters, reading-width default",
  jsxName: "Container",
  jsxElement: "div",
  properties: {
    size: { type: "token", value: "sizes" },
  },
  defaultValues: { size: "measure" },       // semantic ch-based reading measure (DEFAULT)
  transform(props) {
    const { size, ...rest } = props
    return {
      maxWidth: size,
      marginInline: "auto",
      paddingInline: { base: "4", md: "8" },
      ...rest,
    }
  },
})

// usage (JSX): <Container>…</Container>  or  <Container size="6xl">…wide…</Container>
