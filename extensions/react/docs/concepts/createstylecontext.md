---
title: "createStyleContext"
---

This function is a factory function that returns three functions: `withRootProvider`, `withProvider`, and `withContext`.

### withRootProvider

Creates the root component that provides the style context. Use this when the root component **does not render an
underlying DOM element**.

```tsx
import { Dialog } from '@ark-ui/react'

//...

const DialogRoot = withRootProvider(Dialog.Root)
```

### withProvider

Creates a component that both provides context and applies the root slot styles. Use this when the root component
**renders an underlying DOM element**.

> **Note:** It requires the root `slot` parameter to be passed.

```tsx
import { Avatar } from '@ark-ui/react'

//...

const AvatarRoot = withProvider(Avatar.Root, 'root')
```

### withContext

Creates a component that consumes the style context and applies slot styles. It does not accept variant props directly,
but gets them from context.

```tsx
import { Avatar } from '@ark-ui/react'

//...

const AvatarImage = withContext(Avatar.Image, 'image')
const AvatarFallback = withContext(Avatar.Fallback, 'fallback')
```

### unstyled prop

Every component created with `createStyleContext` supports the `unstyled` prop to disable styling. It is useful when you
want to opt-out of the recipe styles.

- When applied the root component, will disable all styles
- When applied to a child component, will disable the styles for that specific slot

```tsx
// Removes all styles
<AvatarRoot unstyled>
  <AvatarImage />
  <AvatarFallback />
</AvatarRoot>

// Removes only the styles for the image slot
<AvatarRoot>
  <AvatarImage unstyled css={{ bg: 'red' }} />
  <AvatarFallback />
</AvatarRoot>
```