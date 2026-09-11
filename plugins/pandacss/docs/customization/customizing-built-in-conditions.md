---
title: "Customizing Built-in Conditions"
---

You can extend the [default conditions](/docs/concepts/conditional-styles#reference) by using the `conditions.extend`
property in the config.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  conditions: {
    extend: {
      // Extend the default `dark` condition
      dark: '.dark &, [data-theme="dark"] &'
    }
  }
})
```

Then you can run the following command to update the conditions JS code:

<Tabs items={['pnpm', 'npm', 'yarn', 'bun']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
    ```bash
    pnpm panda codegen
    ```
  </Tab>
  <Tab>
    ```bash
    npm panda codegen
    ```
  </Tab>
  <Tab>
    ```bash
    yarn panda codegen
    ```
  </Tab>
  <Tab>
    ```bash
    bun panda codegen
    ```
  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>