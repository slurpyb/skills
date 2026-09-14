---
title: "Layer CSS"
---

The generated CSS in Panda is organized into layers. This allows you to define styles in a modular way, using CSS rules
that are scoped to specific components or elements.

Here's what the first line of the generated CSS looks like:

```css
@layer reset, base, tokens, recipes, utilities;
```

Adding this line to the top of your CSS file will determine the order in which the layers are applied. This is the most
exciting feature of CSS cascade layers.