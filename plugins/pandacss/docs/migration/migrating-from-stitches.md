---
title: "Migrating from Stitches"
---

Migrate your project from Stitches to Panda.

This guide helps you migrate from Stitches to Panda and understand the design differences between the libraries.

> **Disclaimer:** This isn't about comparing which one is best. Panda and Stitches are two different CSS-in-JS solutions
> with design decisions.

Here are some similarities between the two libraries.

- Panda uses the object literal syntax to define styles. It also supports the shorthand syntax for the `margin` and
  `padding` properties.
- Panda supports the `variants`, `defaultVariants` and `compoundVariants` APIs.
- Panda supports design tokens and themes.
- Panda supports all the variants of nested selectors (attribute, class, pseudo, descendant, child, sibling selectors
  and more). It also requires the use of the `&` to chain selectors.

Below are some of the differences between the two libraries.