---
title: "Configuring Dark Mode"
---

To enable dark mode in Storybook, you can use the `@storybook/addon-themes` package.

```bash
pnpm add -D @storybook/addon-themes
```

Then, update your `.storybook/preview.ts` file to include the following:

```ts filename=".storybook/preview.ts"
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview, ReactRenderer } from '@storybook/react'

const preview: Preview = {
  // ...
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: '',
        dark: 'dark'
      },
      defaultTheme: 'light'
    })
  ]
}

export default preview
```

With that in place, you should see the light/dark switcher in Storybook's toolbar.