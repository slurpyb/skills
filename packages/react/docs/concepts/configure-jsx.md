---
title: "Configure JSX"
---

Using JSX style props is turned off by default in Panda, but you can opt-in to this feature by using the `jsxFramework`
property in the panda config.

> ⚠️ Panda will not extract style props from JSX elements if you don't set the `jsxFramework` property. This is to avoid
> unnecessary work for projects that don't use JSX.

### Choose Framework

JSX is a JavaScript syntax extension that allows you to write HTML-like code directly within your JavaScript code and is
supported by most popular frameworks. Panda supports JSX style props in React, Preact, Vue 3, Qwik and Solid.js.

```js filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  jsxFramework: 'react'
})
```

### Generate JSX runtime

Next, you need to run `panda codegen` to generate the JSX runtime for your framework.

<Tabs items={['pnpm', 'npm', 'yarn', 'bun']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
  ```bash
  pnpm panda codegen --clean
  ```
  </Tab>
  <Tab>
  ```bash
  npm panda codegen --clean
  ```
  </Tab>
  <Tab>
  ```bash
  yarn panda codegen --clean
  ```
  </Tab>
  <Tab>
  ```bash
  bun panda codegen --clean
  ```
  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>

That's it! You can now use JSX style props in your components.