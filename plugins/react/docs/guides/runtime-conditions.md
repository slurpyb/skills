---
title: "Runtime conditions"
---

Even though we recommend that you first look for better alternatives (such as using
[recipe variants](/docs/concepts/recipes)), you may still occasionally need runtime conditions.

When encountering a runtime condition, Panda will first try to resolve it statically. If it can't, it will fallback to
the generating the corresponding CSS for each possible branches.

```tsx
import { useState } from 'react'
import { css } from '../styled-system/css'
import { Stack } from '../styled-system/jsx'

const App = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Stack
      color={isHovered ? { _hover: 'red.100' } : 'red.200'}
      _hover={{
        color: { base: 'red.300', md: isHovered ? 'red.400' : undefined }
      }}
    >
      <div className={css({ color: isHovered ? 'red.500' : 'red.600' })} />
    </Stack>
  )
}
```

Since none of the conditions above are statically extractable, Panda will generate css for all possible code path,
resulting in a css that looks like this:

```css
/* ... */
@layer utilities {
  .hover\:text_red\.100:where(:hover, [data-hover]) {
    color: var(--colors-red-100);
  }

  .text_red\.200 {
    color: var(--colors-red-200);
  }

  .hover\:text_red\.300:where(:hover, [data-hover]) {
    color: var(--colors-red-300);
  }

  @media screen and (min-width: 768px) {
    .hover\:md\:text_red\.400:where(:hover, [data-hover]) {
      color: var(--colors-red-400);
    }
  }

  .text_red\.500 {
    color: var(--colors-red-500);
  }

  .text_red\.600 {
    color: var(--colors-red-600);
  }
}
/* ... */
```