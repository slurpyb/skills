---
title: "CSS variables"
---

The generated CSS variables will be scoped using the `cssVarRoot` selector defined in the config.

```js
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  cssVarRoot: ':where(:root, :host)'
  // ...
})
```

This will generate a CSS file similar to the following:

```css
:where(:root, :host) {
  --colors-primary: #0fee0f;
  --colors-secondary: #ee0f0f;
  /* ... */
}
```

You can also define type-safe CSS variables using [globalVars](/docs/concepts/writing-styles#property-conflicts).