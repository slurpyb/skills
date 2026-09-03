---
title: "Static expressions"
---

Panda supports static expressions in your styles, as long as they are statically analyzable.

### Static Composition

You can compose different style objects together using the `css.raw()` function.

```tsx filename="App.tsx"
import { css } from 'styled-system/css'

const paragraphSpacingStyle = css.raw({
  '& p': { marginBlockEnd: '1em' }
})

export const proseCss = css.raw({
  '& h1': paragraphSpacingStyle
})
```

This will result in the following CSS:

```css
/* ... */
@layer utilities {
  .\[\&_p\]\:mb_1em p,
  .\[\&_h1\]\:\[\&_p\]\:mb_1em h1 p {
    margin-block-end: 1em;
  }
}
```

### Static Expressions

Panda supports the use of functions to generate the style objects as long they are statically analyzable.

You can only use functions that are defined in the ECMAScript spec such as `Math`, `Object`, `Array`, etc, to support
the evaluation of basic expressions like this:

```ts
import { cva } from '.panda/css'

const getVariants = () => {
  const spacingTokens = Object.entries({
    sm: 'token(spacing.1)',
    md: 'token(spacing.2)'
  })

  // Generate variants programmatically
  const variants = spacingTokens.map(([variant, token]) => [variant, { paddingX: token }])
  return Object.fromEntries(variants)
}

const baseStyle = cva({
  variants: {
    variant: getVariants()
  }
})
```

This will generate the following variants object:

```json
{
  "sm": { "paddingX": "token(spacing.1)" },
  "md": { "paddingX": "token(spacing.2)" }
}
```

And the following CSS

```css
@layer utilities {
  .px_token\(spacing\.1\) {
    padding-inline: var(--spacing-1);
  }

  .px_token\(spacing\.2\) {
    padding-inline: var(--spacing-2);
  }
}
```