---
title: "Getting started"
---

To use template literals, you need to set the `syntax` option in your `panda.config.ts` file to `templateLiteral`:

```ts
// panda.config.ts
export default defineConfig({
  // ...
  syntax: 'template-literal', // required
  jsxFramework: 'react' // required for JSX utilities, e.g. `styled`
})
```

Then run the codegen command to generate the functions:

```sh
panda codegen --clean
```