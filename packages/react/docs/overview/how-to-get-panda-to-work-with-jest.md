---
title: "How to get Panda to work with Jest?"
---

If you run into error messages like `SyntaxError: Unexpected token 'export'` when running Jest tests. Here's what you
can:

In your tsconfig, add

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

In your Jest configuration, add the `ts-jest` transformer:

```ts
export default {
  // ...
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest'
  }
}
```

In your Panda config, set the `outExtension` to `js`:

```ts
export default defineConfig({
  // ...
  outExtension: 'js'
})
```