---
title: "Referenced values"
---

Although you should have your styles inlined most of the time, maybe you want to store a value in a variable and re-use
in multiple places. This should be fine as long as you keep it statically analyzable.

Here's a short list of things to avoid:

- Variables that are not defined in the same file
- Variables resulting from a function call (e.g. `const color = getColor()`)

> If you don't know what value a variable holds with a quick glance, Panda won't be able to either.

```tsx
import { css } from '../styled-system/css'

// ✅ Good: All values are statically extractable
const mainColor = 'red.300'
const sizes = { sm: '12px', md: '16px', '2xl': '42px' }

const App = () => {
  return (
    <div
      className={css({
        color: mainColor,
        fontSize: sizes.md,
        width: sizes['2xl']
      })}
    />
  )
}
```

### Runtime reference on known objects

Using a more complex but still common example :

```tsx
import { useState } from 'react'
import { css } from '../styled-system/css'

const colorByType = {
  primary: 'red.300',
  secondary: 'blue.300',
  tertiary: 'green.300'
}

const Section = () => {
  const [type, setType] = useState('primary')

  // ❌ Avoid: since only "gray.100" is statically extractable here
  // This will not work as expected, the color CSS won't be generated
  return <section className={css({ color: colorByType[type] ?? 'gray.100' })}>❌ Will not be extracted</section>
}
```

Even though `colorByType` is statically analyzable, Panda does not _yet_ support this kind of automatic extraction
fallback. This is the perfect opportunity to use the [recipes](/docs/concepts/recipes).

```tsx
import { useState } from 'react'
import { cva } from '../styled-system/cva'

const sectionRecipe = cva({
  base: { color: 'gray.100' },
  variants: {
    type: {
      primary: { color: 'red.300' },
      secondary: { color: 'blue.300' },
      tertiary: { color: 'green.300' }
    }
  }
})

const Section = () => {
  const [type, setType] = useState('primary')

  // ✅ Good: This will work as expected
  return <section className={sectionRecipe({ type })}>✅ With a recipe</section>
}
```

Not only did you get the same end result, but you also got a more readable and maintainable code !

You can now :

- add more variants to your recipe
- add more properties
- use a shorthand or a condition

All of this with complete type-safety and without having to make drastic changes to the component.

> Note that you can also [integrate this recipe directly into your theme](/docs/concepts/recipes) if you want to only
> generate the CSS that you use, among other things