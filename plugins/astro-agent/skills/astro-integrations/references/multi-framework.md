# More than one JSX framework

This file is the gotchas, not the API.

## Scope by folder

`include` is required once two JSX renderers are installed and unnecessary with one. `exclude` is the optional carve-out.

Give each JSX framework its own components folder, then point `include` at it:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';

export default defineConfig({
  integrations: [
    preact({ include: ['**/preact/*'] }),
    react({ include: ['**/react/*'] }),
    solid({ include: ['**/solid/*'] }),
    vue(),
    svelte(),
  ],
});
```

A JSX component pulled from `node_modules` sits outside those folders and needs its own entry — Solid's SUID, for example, is `include: ['**/solid/*', '**/node_modules/@suid/material/**']`.

## TypeScript follows separately

`include` routes the build; `tsconfig.json` routes the editor, and it holds one `jsxImportSource` for the whole project. Set it to the framework you write most (`react`, `preact`, or `solid-js`), then open every file of the other frameworks with a pragma:

```tsx
/** @jsxImportSource solid-js */
```

Solid also wants `"jsx": "preserve"` where React and Preact want `"jsx": "react-jsx"` — another reason the pragma, not the config, carries the minority framework.

## Cheaper than two runtimes

Two JSX frameworks means two client runtimes in the bundle. If the goal is running React components in a Preact project, `preact({ compat: true })` renders them on Preact's runtime instead, no React integration installed. It covers React libraries published as ESM.
