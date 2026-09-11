---
title: "Arbitrary selectors"
---

What if you need a one-off selector that is not defined in your config's conditions? You can use the `css` function to
generate classes for arbitrary selectors:

```tsx
import { css } from '../styled-system/css'

const App = () => {
  return (
    <div
      className={css({
        '&[data-state=closed]': { color: 'red.300' },
        '& > *': { margin: '2' }
      })}
    />
  )
}
```

This also works with the supported at-rules (`@media`, `@layer`, `@container`, `@supports`, and `@page`):

```tsx
import { css } from '../styled-system/css'

const App = () => {
  return (
    <div className={css({ display: 'flex', containerType: 'size' })}>
      <div
        className={css({
          '@media (min-width: 768px)': {
            color: 'red.300'
          },
          '@container (min-width: 10px)': {
            color: 'green.300'
          },
          '@supports (display: flex)': {
            fontSize: '3xl',
            color: 'blue.300'
          }
        })}
      />
    </div>
  )
}
```