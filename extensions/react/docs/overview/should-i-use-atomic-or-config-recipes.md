---
title: "Should I use atomic or config recipes ?"
---

[Config recipes](/docs/concepts/recipes#config-recipe) are generated just in time, meaning that only the recipes and
variants you use will exist in the generated CSS, regardless of the number of recipes in the config.

This contrasts with [Atomic recipes](/docs/concepts/recipes#atomic-recipe) (cva), which generates all of the variants
regardless of what was used in your code. The reason for this difference is that all `config.recipes` are known at the
start of the panda process when we evaluate your config. In contrast, the CVA recipes are scattered throughout your
code. To get all of them and find their usage across your code, we would need to scan your app code multiple times,
which would not be ideal performance-wise.

When dealing with simple use cases, or if you need code colocation, or even avoiding dynamic styling, atomic recipes
shine by providing all style variants. Config recipes are preferred for design system components, delivering leaner CSS
with only the styles used. Choose according to your component needs.