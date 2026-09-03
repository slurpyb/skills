---
title: "Start your build process"
---

Run the following command to start your development server.

<Tabs items={['pnpm', 'npm', 'yarn', 'bun']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
    ```bash
    pnpm dev
    ```
  </Tab>
  <Tab>
    ```bash
    npm run dev
    ```
  </Tab>
  <Tab>
    ```bash
    yarn dev
    ```
  </Tab>
  <Tab>
    ```bash
    bun dev
    ```
  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>

### Start using Panda

Now you can start using Panda CSS in your project. Here is the snippet of code that you can use in your `src/App.vue`
file.

```vue-html filename="src/App.vue"
<script setup lang="ts">
import { css } from "../styled-system/css";
</script>

<template>
  <div :class="css({ fontSize: '5xl', fontWeight: 'bold' })">Hello 🐼!</div>
</template>
```

</Steps>