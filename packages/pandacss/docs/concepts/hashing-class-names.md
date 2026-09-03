---
title: "Hashing class names"
---

In some cases, it might be useful to shorten the class names by hashing them. Set the `hash: true` option in your
`panda.config.ts` file to enable this. This will generate shorter class names but will make it harder to debug.

To achieve this, set the `hash` option in your `panda.config.ts` file to `true`:

```ts
// panda.config.ts

export default defineConfig({
  // ...
  hash: true // optional
})
```

> Run the `codegen` command to regenerate the functions with hashing enabled.

When hashing is enabled, the class names will go from this:

```css
.font-size_16px {
  font-size: 16px;
}

.font-weight_bold {
  font-weight: bold;
}
```

To a unique six character hash regardless of the length of the selector or the number of declarations:

```css
.adfg5r {
  font-size: 16px;
}

.bsdf35 {
  font-weight: bold;
}
```