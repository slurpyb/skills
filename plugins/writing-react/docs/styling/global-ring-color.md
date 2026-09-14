---
title: "Global Ring Color"
---

You can set a global focus ring color by defining the CSS custom property:

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  globalCss: {
    html: {
      '--global-color-focus-ring': '#3b82f6'
    }
  }
})
```

### Ring Width

To change the focus ring width for a specific component, use the `focusRingWidth` prop:

```jsx
<button className={css({ focusRing: 'outside', focusRingWidth: '4px' })}>Thick focus ring</button>
```

### Ring Style

To change the focus ring style for a specific component, use the `focusRingStyle` prop:

```jsx
<button className={css({ focusRing: 'outside', focusRingStyle: 'dashed' })}>Dashed focus ring</button>
```

This color will be used as the default for all focus rings unless overridden by the `focusRingColor` prop.