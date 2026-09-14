---
title: "Making your own styled components"
---

To make a custom JSX component that accepts style props, Use the `splitCssProps` function to split style props from
other component props.

> For this to work correctly, set the `jsxFramework` to the framework you're using in your panda config.

```tsx
import { splitCssProps } from '../styled-system/jsx'
import type { HTMLStyledProps } from '../styled-system/types'

export function Component(props: HTMLStyledProps<'div'>) {
  const [cssProps, restProps] = splitCssProps(props)
  const { css: cssProp, ...styleProps } = cssProps

  const className = css({ display: 'flex', height: '20', width: '20' }, styleProps, cssProp)

  return <div {...restProps} className={className} />
}

// Usage
function App() {
  return <Component w="2">Click me</Component>
}
```