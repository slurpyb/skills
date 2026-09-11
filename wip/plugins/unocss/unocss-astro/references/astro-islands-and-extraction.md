# Utilities Across `.astro` + Framework Islands

UnoCSS generates CSS by **statically scanning your source for class names** at build time (see
[core-extracting](core-extracting.md)). In Astro this matters because markup lives in several
places — `.astro` files, Markdown/MDX, and hydrated framework **islands** (React, Vue, Svelte,
Solid, Preact, Lit). Every utility you use must appear, as a literal string, somewhere the
extractor looks.

## What gets scanned by default

The Astro integration adds `src/components/**/*` to UnoCSS `content.filesystem`, and Astro's Vite
pipeline feeds `.astro`/`.md`/`.mdx` and bundled island modules through the plugin. In practice
that covers utilities written in:

```astro [src/pages/index.astro]
---
import Counter from '../components/Counter.tsx'
---
<main class="mx-auto max-w-3xl p-8 grid gap-4">
  <h1 class="text-4xl font-bold tracking-tight">Astro + UnoCSS</h1>
  <Counter client:visible />
</main>
```

```tsx [src/components/Counter.tsx]
import { useState } from 'react'
export default function Counter() {
  const [n, setN] = useState(0)
  // utilities inside an island are scanned because the file lives in src/components/**
  return <button class="px-3 py-1 rounded bg-emerald-600 text-white" onClick={() => setN(n + 1)}>{n}</button>
}
```

> React note: in React islands the prop is `className`, but UnoCSS scans the raw source text either
> way — `class` or `className`, both extract. Use whichever your framework requires.

## The `client:only` gotcha

A `client:only` island is **not server-rendered**, so Astro skips its server pass. If such a
component lives **outside `src/components/`**, its classes may never be scanned and the CSS goes
missing in production. Two fixes:

```ts [uno.config.ts — fix 1: widen the scan]
import { defineConfig } from 'unocss'
export default defineConfig({
  content: { filesystem: ['src/**/*.{astro,tsx,jsx,vue,svelte}'] },
})
```

```text [fix 2: keep hydrated components under src/components/]
src/components/  ← integration auto-adds this to content.filesystem
```

The official integration note: *`client:only` components must be in `src/components` or added to
UnoCSS `content` to be processed.* Prefer fix 2 (convention) and reach for fix 1 only when islands
genuinely live elsewhere.

## Dynamic class names don't extract

The static extractor cannot evaluate expressions. A constructed class is invisible:

```astro [✗ won't generate]
---
const tone = 'emerald' // text-emerald-600 never appears literally
---
<p class={`text-${tone}-600`}>missing</p>
```

```astro [✓ full strings or a safelist]
---
const cls = { ok: 'text-emerald-600', bad: 'text-rose-600' }
const tone = 'ok'
---
<p class:list={[cls[tone]]}>present</p>
```

For genuinely runtime-dynamic values, add a `safelist` (see [core-safelist](core-safelist.md)):

```ts [uno.config.ts]
export default defineConfig({
  safelist: ['text-emerald-600', 'text-rose-600', ...['sm','md','lg'].map(s => `p-${s === 'sm' ? 2 : 4}`)],
})
```

Use Astro's [`class:list`](https://docs.astro.build/en/reference/directives-reference/#classlist)
directive rather than hand-concatenating strings — it keeps each utility a literal token.

## Attributify inside JSX islands

`presetAttributify` lets you spread utilities across HTML attributes. In JSX/TSX islands, valueless
attributes (`<div bg-blue-400 />`) aren't valid JSX, so add the `transformerAttributifyJsx`
transformer (see [transformer-attributify-jsx](transformer-attributify-jsx.md)):

```ts [uno.config.ts]
import { defineConfig, presetWind4, presetAttributify, transformerAttributifyJsx } from 'unocss'
export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  transformers: [transformerAttributifyJsx()],
})
```

```tsx [src/components/Badge.tsx]
export default () => <span text="sm white" bg="emerald-600" px-2 py-0.5 rounded>New</span>
```

In `.astro` and Vue/Svelte templates valueless attributify works without the JSX transformer.

## Scoped `<style>` vs utilities

Astro scopes component `<style>` by default. UnoCSS utilities are **global** atomic classes — they
are not scoped, which is the point (one `.p-4` shared everywhere). Mix them deliberately:

- Utilities (`class="p-4 flex"`) for layout/spacing/colour from the token scale.
- Scoped `<style>` only for genuinely component-local CSS that no utility expresses.
- `@apply`/`theme()` inside scoped `<style>` work via `transformerDirectives()` — see
  [transformer-directives](transformer-directives.md).

```astro [src/components/Card.astro]
<article class="rounded-lg border p-4"><slot /></article>
<style>
  article { /* component-local rule that no utility covers */
    @apply shadow-sm hover:shadow-md transition-shadow;
  }
</style>
```

## Build vs dev

- **Dev** (`astro dev`): utilities are generated on demand with HMR; a class you just typed appears
  after the module re-scans. The [Inspector](tooling-inspector-ide.md) is at `/__unocss`.
- **Build** (`astro build`): only what was extracted at build time ships. This is where the dynamic
  class and `client:only` gotchas bite — verify the built CSS, not just the dev server.

See [gotchas-and-pitfalls](gotchas-and-pitfalls.md) for the full list.
