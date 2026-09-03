---
description: PandaCSS styled-system codegen folder — apply when importing from styled-system/*, adding it to .gitignore, or wiring panda codegen into the build
paths:
  - "**/styled-system/**"
  - "**/panda.config.ts"
  - "**/.gitignore"
  - "**/package.json"
  - "**/tsconfig.json"
---

# PandaCSS — styled-system (generated)

`styled-system/` is **generated output** from `panda codegen`. It contains the runtime, types, recipe class maps, and token references tailored to your config.

## Import surface

| Import path | Contents |
|-------------|----------|
| `styled-system/css` | `css`, `cva`, `sva`, `cx`, `css.raw` |
| `styled-system/jsx` | `styled.*` elements + pattern components (when `jsxFramework` set) |
| `styled-system/patterns` | `stack`, `flex`, `grid`, `container`, custom patterns |
| `styled-system/recipes` | All config recipes + slot recipes |
| `styled-system/tokens` | Token resolver: `token('colors.red.500')` |
| `styled-system/styles.css` | Aggregated stylesheet (or use `panda --watch` artifacts) |

## Rules

- Add the generated output to `.gitignore` — it's regenerated, not committed. **Nuance for the shared `@repo/styled-system` package:** its `package.json` manifest IS committed (it's a real workspace package consumers resolve); only the generated `dist/` is gitignored. In an app, the whole `styled-system/` is ignored.
- Wire `panda codegen` (or `panda --watch`) **before** typechecking and the framework dev server start in `package.json` scripts.
- Run `panda codegen` after any change to `panda.config.ts`, recipes, tokens, or breakpoints — types go stale otherwise.
- **Import prefix by layer.** Apps and standalone projects author `styled-system/*` (the config's `importMap` rewrites it to the real output). **Shared / source-distributed packages** (e.g. `@repo/react`, `@repo/react-components`) import `@repo/styled-system/*` — they have no own `panda.config`, never emit, and consume the shared package directly. Don't use a private `@/styled-system/*` alias in a package consumers can't replicate.
- Never edit files inside `styled-system/` — they will be overwritten.

## Typical script setup

```json
{
  "scripts": {
    "predev": "panda codegen",
    "dev": "astro dev",
    "prebuild": "panda codegen",
    "build": "astro build"
  }
}
```

## See also

- [Writing styles](../styling/css.md)
- [Tokens](../theming/tokens.md)
- [Architecture flow](../debugging/architecture.md)
