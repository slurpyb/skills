---
title: "Creating a condition"
---

To create a condition, you can use the conditions property in the config. Let's say we want to create a `groupHover`
pseudo condition that applies styles to an element when a parent container with the `group` role is hovered.

```ts filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  conditions: {
    extend: {
      groupHover: '[role=group]:where(:hover, [data-hover]) &'
    }
  }
})
```

> ⚠️ The `&` character is mandatory, it is a placeholder for the current selector. It will be replaced with the actual
> selector when the condition is used. It has to be used either at the beginning or at the end of the condition.

Then you can run the following command to generate the conditions JS code:

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

Now, we can use the `groupHover` condition in our components.

```jsx
import { css } from '../styled-system/css'

function App() {
  return (
    <div role="group">
      <span
        className={css({
          color: { base: 'blue.400', _groupHover: 'blue.600' }
        })}
      />
    </div>
  )
}
```