---
title: "Global vars"
---

You can use the `globalVars` property to define global
[CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) or custom CSS
[`@property`](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) definitions.

Panda will automatically generate the corresponding CSS variables and suggest them in your style objects.

> They will be generated in the [`cssVarRoot`](/docs/references/config#cssvarroot) near your tokens.

This can be especially useful when using a 3rd party library that provides custom CSS variables, like a popper library
that exposes a `--popper-reference-width`.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  globalVars: {
    '--popper-reference-width': '4px',
    // you can also generate a CSS @property
    '--button-color': {
      syntax: '<color>',
      inherits: false,
      initialValue: 'blue'
    }
  }
})
```

> Note: Keys defined in `globalVars` will be available as a value for _every_ utilities, as they're not bound to token
> categories.

```ts
import { css } from '../styled-system/css'

const className = css({
  '--button-color': 'colors.red.300',
  // ^^^^^^^^^^^^  will be suggested

  backgroundColor: 'var(--button-color)'
  //                ^^^^^^^^^^^^^^^^^^  will be suggested
})
```