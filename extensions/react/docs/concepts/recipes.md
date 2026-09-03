---
title: "Recipes"
---

Panda provides a way to write CSS-in-JS with better performance, developer experience, and composability.

Recipes are a way to create multi-variant styles with a type-safe runtime API.

A recipe consists of four properties:

- `base`: The base styles for the component
- `variants`: The different visual styles for the component
- `compoundVariants`: The different combinations of variants for the component
- `defaultVariants`: The default variant values for the component

> **Credit:** This API was inspired by [Stitches](https://stitches.dev/),
> [Vanilla Extract](https://vanilla-extract.style/), and [Class Variance Authority](https://cva.style/).

[Comparison table between the different types of recipes here: "Should I use atomic or config recipes ?"](/docs/concepts/recipes#should-i-use-atomic-or-config-recipes-)