---
title: "Ship a Static CSS File"
---

This approach involves extracting the static css of your library at build time. Then you can import the CSS file in your
app code.

**Library code**

```tsx filename="src/index.tsx"
import { css } from '../styled-system/css'

export function Button({ children }) {
  return (
    <button type="button" className={css({ bg: 'red.300', px: '2', py: '3' })}>
      {children}
    </button>
  )
}
```

Then you can build the library code and generate the static CSS file:

```bash
# build the library code
tsup src/index.tsx

# generate the static CSS file
panda cssgen --outfile dist/styles.css
```

Finally, don't forget to include the [cascade layers](/docs/concepts/cascade-layers) as well in your app code:

**App code**

```tsx filename="src/App.tsx"
import { Button } from '@acme-org/design-system'
import './main.css'

export function App() {
  return <Button>Click me</Button>
}
```

**main.css**

```css filename="src/main.css"
@layer reset, base, tokens, recipes, utilities;
@import url('@acme-org/design-system/dist/styles.css');

/* Your own styles here */
```

This approach comes with a few downsides:

- You can't customize the styles since the css is already generated
- You might need add the [prefix](/docs/references/config#prefix) option to avoid className conflicts

  ```tsx filename="panda.config.ts"
  import { defineConfig } from '@pandacss/dev'

  export default defineConfig({
    //...
    prefix: 'acme'
  })
  ```

- You might have duplicate CSS classes when using multiple atomic css libraries