---
title: "The extend keyword"
---

What is and how to to use the extend keyword

The `extend` keyword allows you to extend the default Panda configuration. It is useful when you want to add your own
customizations to Panda, without erasing the default `presets` values (`conditions`, `tokens`, `utilities`, etc).

It will (deeply) merge your customizations with the default ones, instead of replacing them.

The `extend` keyword allows you to extend the following parts of Panda:

- [conditions](/docs/customization/conditions)
- [theme](/docs/customization/theme)
- [recipes](/docs/concepts/recipes) (included in theme)
- [patterns](/docs/customization/patterns)
- [utilities](/docs/customization/utilities)
- [globalCss](/docs/concepts/writing-styles#global-styles)
- [staticCss](/docs/guides/static)

> These keys are all allowed in [presets](/docs/customization/presets).