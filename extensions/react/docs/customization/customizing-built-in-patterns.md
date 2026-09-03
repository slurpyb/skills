---
title: "Customizing Built-in Patterns"
---

You can extend the [default patterns](/docs/concepts/patterns#predefined-patterns) by using the `patterns.extend`
property in the config.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  patterns: {
    extend: {
      // Extend the default `flex` pattern
      flex: {
        properties: {
          // only allow row and column
          direction: { type: 'enum', value: ['row', 'column'] },
          jsx: ['Flex', 'CustomFlex'] // 👈 match the `CustomFlex` component to this pattern
        }
      }
    }
  }
})
```

Then you can run the following command to update the pattern JS code:

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