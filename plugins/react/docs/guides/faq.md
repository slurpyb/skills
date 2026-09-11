---
title: "FAQ"
---

### Why are my styles not applied?

Check that the [`@layer` rules](/docs/concepts/cascade-layers#layer-css) are set and the corresponding `.css` file is
included. [If you're not using `postcss`](/docs/installation/cli), ensure that `styled-system/styles.css` is imported
and that the `panda` command has been run (or is running with `--watch`).

### Some CSS is missing when using absolute imports

This can happen when `tsconfig` (with `paths` or `baseUrl`) or with package.json
[`#imports`](https://nodejs.org/api/packages.html#subpath-imports). Panda tries to automatically infer and read the
custom paths defined in `tsconfig.json` file. However, there might be scenarios that won't work.

To fix this add the `importMap` option to your `panda.config.js` file, setting it's value to match the way you import
the `outdir` modules.

```app.tsx
// app.tsx

import { css } from "~/styled-system/css"
// tsconfig.json paths
// -> importMap: "~/styled-system"

import { css } from "styled-system/css"
// tsconfig.json baseUrl
// -> importMap: "styled-system"

import { css } from "@my-monorepo/ui-kit/css"
// monorepo workspace package
// -> importMap: "@my-monorepo/ui-kit"

import { css } from "#styled-system/css"
// package.json#imports
// -> importMap: "#styled-system

```

```js
// panda.config.js

export default defineConfig({
  importMap: '~/styled-system'
})
```

This will ensure that the paths are resolved correctly, and HMR works as expected.