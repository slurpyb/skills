---
title: "css function"
---

In Stitches, the `css` function is used to author both regular style objects and variant style objects.

```tsx
import { css } from '@stitches/react'

// definition
const styles = css({
  border: 'solid 1px red',
  backgroundColor: 'transparent',

  variants: {
    variant: {
      // ...
    }
  }
})

// usage
<button className={styles({ variant: 'primary' })} />
```

In Panda, the `css` function is only used to author atomic styles, and the `cva` function to create variant style
objects.

**The css function**

```tsx
import { css } from '../styled-system/css'

// definition
const styles = css({
  border: 'solid 1px red',
  backgroundColor: 'transparent'
})

// usage
<button className={styles} />
```

**The cva function**

```tsx
import { cva } from '../styled-system/css'

// definition
const styles = cva({
  base: {
    border: 'solid 1px red',
    backgroundColor: 'transparent'
  },
  variants: {
    variant: {
      // ...
    }
  }
})

// usage
<button className={styles({ variant: 'primary' })} />
```