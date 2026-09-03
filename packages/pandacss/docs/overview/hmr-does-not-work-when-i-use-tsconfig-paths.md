---
title: "HMR does not work when I use tsconfig paths?"
---

Panda tries to automatically infer and read the custom paths defined in `tsconfig.json` file. However, there might be
scenarios where the hot module replacement doesn't work.

To fix this add the `importMap` option to your `panda.config.js` file, setting it's value to the specified `paths` in
your `tsconfig.json` file.

```json
// tsconfig.json

{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@my-path/*": ["./styled-system/*"]
    }
  }
}
```

```js
// panda.config.js

module.exports = {
  importMap: '@my-path'
}
```

This will ensure that the paths are resolved correctly, and HMR works as expected.