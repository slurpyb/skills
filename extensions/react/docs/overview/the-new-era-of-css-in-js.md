---
title: "The new era of CSS-in-JS"
---

Panda is a new CSS-in-JS engine that aims to solve the challenges of CSS-in-JS in the server-first era. It provides
styling primitives to create, organize, and manage CSS styles in a type-safe and readable manner.

- **Static Analysis:** Panda uses static analysis to parse and analyze your styles at build time, and generate CSS files
  that can be used in any JavaScript framework.

- **PostCSS:** After static analysis, Panda uses a set of PostCSS plugins to convert the parsed data to atomic css at
  build time. **This makes Panda compatible with any framework that supports PostCSS.**

- **Codegen:** Panda generates a lightweight runtime JS code that is used to author styles. **Think of it as an
  optimized function that joins key-value pairs of an object**. It doesn't generate styles in the browser nor inject
  styles in the `<head>`.

- **Type-Safety:** Panda combines `csstype` and auto-generated typings to provide type-safety for css properties and
  design tokens.

- **Performance:** Panda uses a unique approach to generate atomic CSS files that are optimized for performance and
  readability.

- **Developer Experience:** Panda provides a great developer experience with a rich set of features like recipes,
  patterns, design tokens, JSX style props, and more.

- **Modern CSS**: Panda uses modern CSS features like cascade layers, css variables, modern selectors like `:where` and
  `:is` in generated styles.