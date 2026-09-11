---
name: unocss-gotchas-and-pitfalls
description: The common UnoCSS traps in Astro projects — each as mistake → fix with a minimal example
---

# Gotchas and Pitfalls (UnoCSS in Astro)

UnoCSS generates CSS by **statically scanning source text** at build time. Almost every
surprise traces back to that one fact. Each gotcha below is the mistake, then the fix.

## 1. Dynamically constructed class names are invisible

**Mistake:** the extractor reads files as text and only sees *complete* utility tokens.
A class assembled at runtime never appears as a whole string, so its CSS is never generated.
This is the #1 "works in dev, broken in prod" bug.

```ts
// WRONG — extractor never sees 'bg-blue-500'
const cls = `bg-${color}-500`;
```

**Fix:** make the full token literal — an explicit lookup map — or `safelist` it.

```ts
// RIGHT (1): full strings visible in source
const bgMap: Record<string, string> = {
  primary: 'bg-blue-500',
  danger: 'bg-red-500',
  success: 'bg-green-500',
};

// RIGHT (2): safelist function derives from the theme at build time
// uno.config.ts
export default defineConfig({
  safelist: [(ctx) => Object.keys(ctx.theme.colors ?? {}).map((c) => `bg-${c}-500`)],
});
```

Do **not** try to fix this by adding the classes to a CSS file — they must appear as
complete strings in scanned source or in `safelist`.

## 2. Astro islands / `client:only` components not extracted

**Mistake:** a `.tsx`/`.vue`/`.svelte` island hydrated with `client:only` (or any component
living outside the scanned globs) has its classes missed. The shell renders styled; the
island renders unstyled.

**Fix:** ensure every island file is inside UnoCSS's `content` globs. The Astro integration
scans `src/` by default, but verify framework extensions and any out-of-tree component
directories are covered.

```ts
// uno.config.ts
export default defineConfig({
  content: {
    filesystem: [
      './src/**/*.{astro,ts,tsx,vue,svelte,js,jsx,md,mdx}',
      // any island / component dir outside src:
      './packages/ui/src/**/*.{tsx,vue}',
    ],
  },
});
```

Keep islands in `src/components` (or another globbed path) so the build-time scan sees them.

## 3. Preset and rule order — later wins

**Mistake:** UnoCSS resolves conflicts by **definition order: later rules win**. A broad
catch-all rule (or a community preset) placed after a specific one silently overrides it.
The utility *is* generated — it just loses the cascade, which looks identical to an
extraction miss.

```ts
// RIGHT — specific static rule BEFORE the broad dynamic one
export default defineConfig({
  presets: [presetWind4(), presetScrollbar()], // community preset after base so it can override
  rules: [
    ['text-brand', { color: '#2563eb' }],       // specific — defined first
    [/^text-(.+)$/, ([, c], { theme }) =>        // broad — last; would clobber if reversed
      theme.colors[c] ? { color: theme.colors[c] } : undefined],
  ],
});
```

**Fix:** order intentionally — base presets first, overriding presets last; specific rules
before broad ones. If both selectors appear in the inspector, it's an ordering conflict, not
an extraction miss.

## 4. Cascade-layer ordering can invert specificity

**Mistake:** UnoCSS emits into named CSS `@layer`s. If your global CSS explicitly orders
layers (`@layer reset, components, utilities`) and UnoCSS's output lands in an unexpected
layer, an *earlier* layer can override utilities despite appearing later in the file.

**Fix:** let UnoCSS manage layer order unless you have a deliberate reason to reorder; if you
must, control the emitted layer with `outputToCssLayers`.

```ts
export default defineConfig({
  outputToCssLayers: { cssLayerName: (layer) => (layer === 'default' ? 'utilities' : layer) },
});
```

## 5. Dev/HMR sees a class that the build does not

**Mistake:** a class lives in a file UnoCSS isn't watching — a dynamically imported
component, a string in a JSON config, or a class injected by a third-party library. It may
appear during dev (via HMR scanning of touched files) yet vanish from the production build.

**Fix:** add the file pattern to `content.filesystem`, or `safelist` the classes.

```ts
export default defineConfig({
  content: {
    filesystem: [
      './src/**/*.{astro,ts,tsx,vue,svelte,html,md,mdx}',
      './node_modules/@myorg/ui/dist/**/*.js', // lib that injects UnoCSS classes
    ],
  },
});
```

## 6. SSR + runtime generation = flash of unstyled content

**Mistake:** `@unocss/runtime` generates CSS in the browser *after* JS runs (via a
`MutationObserver`). In an SSR framework like Astro, the HTML arrives with class names but no
CSS, so you get a visible FOUC until JS executes.

**Fix:** for Astro (and Nuxt/SvelteKit/Next), always use **build-time extraction**
(`unocss/astro`), which ships pre-generated CSS in the initial HTML. Reserve the runtime for
no-build / fully client-rendered contexts.

```ts
// astro.config.ts — build-time, no FOUC
import UnoCSS from 'unocss/astro';
export default defineConfig({ integrations: [UnoCSS()] });
```

Hybrid: build-time for the app shell, plus `initUnocssRuntime({ defaults })` scoped to a
zone of CMS-injected HTML whose classes can't be known at build time.

## 7. Arbitrary-value syntax pitfalls

**Mistake:** spaces inside brackets break extraction, and a missing extractor silently drops
arbitrary *variants*.

**Fix:** use underscores for spaces (the extractor converts them back), and register the
arbitrary-variants extractor.

```html
<!-- spaces → underscores -->
<div class="grid-cols-[1fr_2fr_1fr] bg-[url(/hero.png)] text-[var(--brand)]"></div>
```

```ts
// arbitrary VARIANTS ([&>*]:, [&[open]]:) need this extractor
import extractorArbitraryVariants from '@unocss/extractor-arbitrary-variants';
export default defineConfig({ extractors: [extractorArbitraryVariants()] });
```

```html
<!-- now recognised: & = the generated class selector -->
<ul class="[&>*]:py-1 [&>*]:border-b"></ul>
<details class="[&[open]]:bg-blue-50 [&[open]>summary]:font-bold"><summary>Toggle</summary></details>
```

If an arbitrary value generates nothing, check the inspector REPL — a rule that finds no
theme token re-tries with the raw value, and if that also fails the class is silently skipped.

## 8. Dark-mode strategy: class vs media

**Mistake:** picking the wrong strategy, or expecting `dark:` to follow OS preference when
it's configured as `class` (the default). `dark:` is preset-controlled, not global.

**Fix:** choose deliberately. `class` compiles to `.dark .dark\:…` (JS toggle); `media`
compiles to `@media (prefers-color-scheme: dark)` (OS preference). `@dark:` (note the `@`)
**always** uses the media query regardless of config — an escape hatch for individual
utilities.

```ts
presetWind4({
  dark: 'class', // toggle via document.documentElement.classList.toggle('dark')
  // dark: 'media',                                            // follow OS
  // dark: { dark: '[data-theme="dark"]', light: '[data-theme="light"]' }, // custom selector
});
```

```html
<div class="bg-white dark:bg-gray-900">class strategy — needs .dark on an ancestor</div>
<div class="bg-white @dark:bg-gray-900">always prefers-color-scheme, regardless of config</div>
```

For Astro, the `class` strategy pairs with a tiny inline `<head>` script that reads
`localStorage` / `prefers-color-scheme` and sets `.dark` **before first paint** to avoid a
theme flash (CSP: allow via hash, not `unsafe-inline`).

## Debugging toolbelt

- **`/__unocss` inspector** (Vite/Astro dev, e.g. `http://localhost:4321/__unocss`):
  the **Modules** pane shows classes extracted per file — if a template class is absent
  there, it's an extraction miss; if it's present but not applied, it's an ordering/layer
  conflict. The **REPL** pane tests any utility against your config live.
- **VS Code "UnoCSS" extension** (publisher `antfu`): autocomplete, hover-to-preview CSS,
  color swatches — reads `uno.config.ts`. Keep config in a **dedicated `uno.config.ts`**, not
  inlined in `astro.config.ts`, or custom theme tokens won't appear in completions.
- **`@unocss/eslint-plugin`:** `order` / `order-attributify` (canonical class sort),
  `blocklist` (surface blocked classes as errors), `enforce-class-compile`.

<!--
Source references:
- https://unocss.dev/guide/extracting
- https://unocss.dev/config/safelist
- https://unocss.dev/integrations/runtime
- https://unocss.dev/extractors/arbitrary-variants
- https://unocss.dev/presets/mini
- https://unocss.dev/tools/inspector
-->
