---
title: "Slot Recipes"
---

Learn how to style multiple parts components with slot recipes.

When using `cva` or `defineRecipe` might be enough for simple cases, slot recipes are a better fit for more complex
cases.

A slot recipe consists of these properties:

- `slots`: An array of component parts to style
- `base`: The base styles per slot
- `variants`: The different visual styles for each slot
- `defaultVariants`: The default variant for the component
- `compoundVariants`: The compound variant combination and style overrides for each slot.

> **Credit:** This API was inspired by multipart components in
> [Chakra UI](https://chakra-ui.com/docs/styled-system/component-style) and slot variants in
> [Tailwind Variants](https://tailwind-variants.org)

[See the comparison table between atomic recipes (`cva`) and `config recipes` here.](/docs/concepts/recipes#should-i-use-atomic-or-config-recipes-)
The same comparison applies to `sva` and `slot recipes`.