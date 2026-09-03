---
title: "Imported Image is not working in Vite App"
---

This is a known limitation of Panda due to our static extraction approach.

> Think of it this way: there's no way for the compiler to know what the final asset URL will be since Vite controls it.

We recommend moving the imported `backgroundImage` to the `style` attribute.

```jsx
import myImageBackground from './my-image.png'

const Demo = () => {
  return (
    <p
      className={css({ bg: 'red.300', backgroundRepeat: 'repeat' })}
      style={{ backgroundImage: `url("${myImageBackground}")` }}
    >
      Hello World
    </p>
  )
}
```