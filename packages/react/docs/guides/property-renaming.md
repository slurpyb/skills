---
title: "Property Renaming"
---

Due to the static nature of Panda, you can't rename properties at runtime.

```tsx filename="App.tsx"
import { Circle, CircleProps } from '../styled-system/jsx'

type Props = {
  circleSize?: CircleProps['size']
}

const CustomCircle = (props: Props) => {
  const { circleSize = '3' } = props
  return (
    <Circle
      // ❌ Avoid: Panda can't determine the value of circleSize at build-time
      size={circleSize}
    />
  )
}
```

In this case, you need to use the `size` prop.

### Alternative

As of v0.8, we added a new `{fn}.raw()` method to css, patterns and recipes. This function is an identity function and
only serves as a hint for the compiler to extract the css.

It can be useful, for example, in Storybook args or custom react props.

```tsx filename="App.tsx"
// mark the object as valid css for the extractor
<Button rootProps={css.raw({ bg: 'red.400' })} />
```

```tsx
export const Funky: Story = {
  // mark this as a button recipe usage
  args: button.raw({
    visual: 'funky',
    shape: 'circle',
    size: 'sm'
  })
}
```

### Enhanced `css.raw` spreading

> **Added in v1.6.1**

You can also spread `css.raw` objects within nested selectors and conditions for better style composition:

```tsx filename="App.tsx"
import { css } from '../styled-system/css'

const baseStyles = css.raw({ margin: 0, padding: 0 })
const interactive = css.raw({ cursor: 'pointer', transition: 'all 0.2s' })

const component = css({
  // Spreading in child selectors
  '& p': { ...baseStyles, fontSize: '1rem' },

  // Spreading in nested conditions
  _hover: {
    ...interactive,
    _dark: { ...interactive, color: 'white' }
  }
})
```