---
title: "How do I get a type with each recipe properties?"
---

You can get a [`config recipe`](/docs/concepts/recipes#config-recipe) properties types by using `XXXVariantProps`. Let's
say you have a `config recipe` named `button`, you can import its type like this:

```ts
import { button, type ButtonVariantProps } from '../styled-system/recipes'
```