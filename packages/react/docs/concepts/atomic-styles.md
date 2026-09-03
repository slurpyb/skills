---
title: "Atomic Styles"
---

When you write styles in Panda, it generates a modern atomic stylesheet that is automatically scoped to the
`@layer utilities` cascade layer.

The atomic stylesheets approach offers several advantages, such as improved code maintainability and reusability, as
well as a smaller overall CSS footprint.

Panda exposes a `css` function that can be used to author styles. It accepts a style object and returns a className
string.

```jsx
import { css } from '../styled-system/css'

const styles = css({
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',
  fontSize: '13px',
  padding: '10px 15px'
})

// Generated className:
// --> bg_gainsboro rounded_9999px fs_13px p_10px_15px

<div className={styles}>
  <p>Hello World</p>
</div>
```

The styles generated at build time end up like this:

```css
@layer utilities {
  .bg_gainsboro {
    background-color: gainsboro;
  }

  .rounded_9999px {
    border-radius: 9999px;
  }

  .fs_13px {
    font-size: 13px;
  }

  .p_10px_15px {
    padding: 10px 15px;
  }
}
```

### Shorthand Properties

Panda provides shorthands for common css properties to help improve the speed of development and reduce the visual
density of your style declarations.

Properties like `borderRadius`, `backgroundColor`, and `padding` can be swapped to their shorthand equivalent `rounded`,
`bg`, and `p`.

```jsx
import { css } from '../styled-system/css'

// BEFORE - Good
const styles = css({
  backgroundColor: 'gainsboro',
  borderRadius: '9999px',
  fontSize: '13px',
  padding: '10px 15px'
})

// AFTER - Better
const styles = css({
  bg: 'gainsboro',
  rounded: '9999px',
  fontSize: '13px',
  p: '10px 15px'
})
```

> Shorthands are documented alongside their respective properties in the [utilities](/docs/utilities/background)
> section.

### Type safety

Panda is built with TypeScript and provides type safety for all style properties and shorthands. Most of the style
properties are connected to either the native CSS properties or their respective token value defined as defined in the
`theme` object.

```ts
import { css } from '../styled-system/css'

//                       ⤵ you'll get autocomplete for colors
const styles = css({ bg: '|' })
```

> You can also enable the `strictTokens: true` setting in the Panda configuration. This allows only token values and
> prevents the use of custom or raw CSS values.

- `config.strictTokens` will only affect properties that have config tokens, such as `color`, `bg`, `borderColor`, etc.
- `config.strictPropertyValues` will throw for properties that do not have config tokens, such as `display`, `content`,
  `willChange`, etc. when the value is not a predefined CSS value.

> In both cases, you can use the `[xxx]` escape-hatch syntax to use custom or raw CSS values without TypeScript errors.

#### strictTokens

With `config.strictTokens` enabled, you can only use token values in your styles. This prevents the use of custom or raw
CSS values.

```ts filename="panda.config.ts"
import { css } from '../styled-system/css'

css({ bg: 'red' }) // ❌ Error: "red" is not a valid token value
css({ fontSize: '123px' }) // ❌ Error: "123px" is not a valid token value

css({ bg: 'red.400' }) // ✅ Valid
css({ fontSize: '[123px]' }) // ✅ Valid, since `[123px]` is using the escape-hatch syntax
css({ content: 'abc' }) // ✅ Valid, since `content` isn't bound to a config token
```

For one-off styles, you can always use the escape-hatch syntax `[xxx]` to use custom or raw CSS values without
TypeScript errors.

```ts filename="panda.config.ts"
import { css } from '../styled-system/css'

css({ bg: '[red]' }) // ✅ Valid, since `[red]` is using the escape-hatch syntax
css({ fontSize: '[123px]' }) // ✅ Valid, since `[123px]` is using the escape-hatch syntax
```

#### strictPropertyValues

With `config.strictPropertyValues` enabled, you can only use valid CSS values for properties that do have a predefined
list of values in your styles. This prevents the use of custom or raw CSS values.

```ts filename="panda.config.ts"
css({ display: 'flex' }) // ✅ Valid
css({ display: 'block' }) // ✅ Valid

css({ display: 'abc' }) // ❌ will throw since 'abc' is not part of predefined values of 'display'
css({ pos: 'absolute123' }) // ❌ will throw since 'absolute123' is not part of predefined values of 'position'
css({ display: '[var(--btn-display)]' }) // ✅ Valid, since `[var(--btn-display)]` is using the escape-hatch syntax

css({ content: '""' }) // ✅ Valid, since `content` does not have a predefined list of values
css({ flex: '0 1' }) // ✅ Valid, since `flex` does not have a predefined list of values
```

The `config.strictPropertyValues` option will only be applied to this exhaustive list of properties:

```ts
type StrictableProps =
  | 'alignContent'
  | 'alignItems'
  | 'alignSelf'
  | 'all'
  | 'animationComposition'
  | 'animationDirection'
  | 'animationFillMode'
  | 'appearance'
  | 'backfaceVisibility'
  | 'backgroundAttachment'
  | 'backgroundClip'
  | 'borderCollapse'
  | 'border'
  | 'borderBlock'
  | 'borderBlockEnd'
  | 'borderBlockStart'
  | 'borderBottom'
  | 'borderInline'
  | 'borderInlineEnd'
  | 'borderInlineStart'
  | 'borderLeft'
  | 'borderRight'
  | 'borderTop'
  | 'borderBlockEndStyle'
  | 'borderBlockStartStyle'
  | 'borderBlockStyle'
  | 'borderBottomStyle'
  | 'borderInlineEndStyle'
  | 'borderInlineStartStyle'
  | 'borderInlineStyle'
  | 'borderLeftStyle'
  | 'borderRightStyle'
  | 'borderTopStyle'
  | 'boxDecorationBreak'
  | 'boxSizing'
  | 'breakAfter'
  | 'breakBefore'
  | 'breakInside'
  | 'captionSide'
  | 'clear'
  | 'columnFill'
  | 'columnRuleStyle'
  | 'contentVisibility'
  | 'direction'
  | 'display'
  | 'emptyCells'
  | 'flexDirection'
  | 'flexWrap'
  | 'float'
  | 'fontKerning'
  | 'forcedColorAdjust'
  | 'isolation'
  | 'lineBreak'
  | 'mixBlendMode'
  | 'objectFit'
  | 'outlineStyle'
  | 'overflow'
  | 'overflowX'
  | 'overflowY'
  | 'overflowBlock'
  | 'overflowInline'
  | 'overflowWrap'
  | 'pointerEvents'
  | 'position'
  | 'resize'
  | 'scrollBehavior'
  | 'touchAction'
  | 'transformBox'
  | 'transformStyle'
  | 'userSelect'
  | 'visibility'
  | 'wordBreak'
  | 'writingMode'
```