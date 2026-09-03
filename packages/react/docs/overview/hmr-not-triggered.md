---
title: "HMR not triggered"
---

If you are having issues with HMR not being triggered after a `panda.config.ts` change (or one of its
[dependencies](/docs/references/config#dependencies)), you can manually specify the files that should trigger a rebuild
by adding the following to your `panda.config.ts`:

```js filename="panda.config.ts"
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // ...
  dependencies: ['path/to/files/**.ts']
})
```