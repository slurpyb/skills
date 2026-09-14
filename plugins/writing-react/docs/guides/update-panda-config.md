---
title: "Update Panda Config"
---

```js
export default defineConfig({
  theme: {
    extend: {
      tokens: {
        fonts: {
          fira: { value: 'var(--font-fira-code), Menlo, monospace' },
          mona: { value: 'var(--font-mona-sans), sans-serif' }
        }
      }
    }
  }
})
```