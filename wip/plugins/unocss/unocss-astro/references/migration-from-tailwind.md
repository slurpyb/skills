---
name: unocss-migration-from-tailwind
description: Move an Astro + Tailwind project to UnoCSS — what stays, what differs, and wind3 vs wind4
---

# Migrating from Tailwind to UnoCSS (in Astro)

UnoCSS is **not** a drop-in Tailwind replacement. It has a different engine, no Tailwind
plugin system, and a different config shape. `presetWind3` is the Tailwind v3 compatibility
layer; `presetWind4` aligns with Tailwind v4. You **translate** `tailwind.config.js` into
UnoCSS idioms — you do not copy it.

## Swap the Astro integration

Tailwind in Astro ran through `@astrojs/tailwind`. UnoCSS ships its own Astro integration
(`unocss/astro`), which extends a Vite plugin and emits a `virtual:uno.css` module.

```bash
# before
npm rm @astrojs/tailwind tailwindcss
# after
npm i -D unocss
```

```ts
// astro.config.ts — BEFORE
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({ integrations: [tailwind()] });
```

```ts
// astro.config.ts — AFTER
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  integrations: [UnoCSS({ injectReset: true })], // injectReset replaces @tailwind base reset
});
```

```ts
// src/main.ts or a layout's frontmatter — import the generated CSS once
import 'virtual:uno.css';
```

## The config: translate, don't copy

UnoCSS uses `uno.config.ts` (a dedicated file — best for IDE support, see the gotchas
reference). The merge model differs: UnoCSS always does a deep merge (`defaultsDeep`), so
there is **no `extend` key** — write `theme: { colors: { ... } }` and it merges with the
preset defaults.

```js
// tailwind.config.js — BEFORE
module.exports = {
  darkMode: 'class',
  prefix: 'tw-',
  theme: {
    extend: {
      colors: { brand: '#2563eb', surface: '#f8fafc' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

```ts
// uno.config.ts — AFTER (Tailwind v3 compatible)
import {
  defineConfig,
  presetWind3,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind3({ dark: 'class' }), // darkMode: 'class' → here; 'media' for OS preference
    presetTypography(),             // @tailwindcss/typography → presetTypography (prose-* API differs slightly)
  ],
  transformers: [
    transformerDirectives(),   // enables @apply / @screen in CSS
    transformerVariantGroup(), // enables hover:(a b) shorthand
  ],
  theme: {
    // No `extend`: merged deeply by default
    colors: { brand: '#2563eb', surface: '#f8fafc' },
  },
  shortcuts: [
    // `container` is NOT automatic in UnoCSS — replicate it:
    ['container', 'mx-auto px-4 max-w-screen-xl'],
  ],
});
```

## What's the same

- **Utility names and responsive/pseudo variants:** `presetWind3` covers the vast majority
  of Tailwind v3 utilities — `flex`, `p-4`, `md:grid`, `hover:bg-blue-500`, color scales.
- **Arbitrary values:** identical bracket syntax — `m-[10px]`, `text-[#abc]`,
  `grid-cols-[1fr_2fr_1fr]` (spaces become underscores). See the gotchas reference.
- **`@apply`:** works via `transformerDirectives()` — but only for utilities that exist in
  UnoCSS (see below).
- **JIT:** UnoCSS is always on-demand by design — no `content`/JIT toggle to configure.

## What differs

| Tailwind | UnoCSS | Note |
|----------|--------|------|
| Plugin system (`plugins: [...]`) | **None** | Replace each plugin with a preset, rule, or shortcut |
| `@tailwindcss/forms` | custom rules / native CSS | No drop-in equivalent |
| `@tailwindcss/typography` | `presetTypography()` | `prose-*` API differs slightly |
| `theme: { extend: {...} }` | `theme: {...}` (deep-merged) | No `extend` key |
| `darkMode: 'class'` | `presetWind3({ dark: 'class' })` | or `'media'` |
| `prefix: 'tw-'` | `presetMini`/`presetWind3` prefix option | mixing prefixed + unprefixed is error-prone |
| `tailwind.config.js` | `uno.config.ts` | dedicated file, deep-merge model |

**`@apply` caveat:** any `@apply` that referenced a *plugin-generated* class breaks until
you port that plugin. Audit every `@apply` after migrating.

## Migration steps

1. Remove `@astrojs/tailwind` + `tailwindcss`; add `unocss`; wire `unocss/astro` and import
   `virtual:uno.css`.
2. Move custom theme values from `theme.extend` into UnoCSS `theme` (no `extend`).
3. List every Tailwind plugin; replace each with a preset, custom rule, or shortcut.
4. Add `transformerDirectives()` and audit every `@apply` — confirm each still resolves.
5. Replicate `container` behaviour with a shortcut; test breakpoint edge cases first.

## wind3 vs wind4: which preset?

`presetWind3` follows the Tailwind v3 / Windi theme shape. `presetWind4` realigns to
Tailwind v4 semantics and **renames most top-level theme keys**.

| wind3 key | wind4 key |
|-----------|-----------|
| `fontFamily` | `font` |
| `fontSize` / `lineHeight` / `letterSpacing` | `text.fontSize` / `text.lineHeight` / `text.letterSpacing` |
| `borderRadius` | `radius` |
| `boxShadow` | `shadow` |
| `breakpoints` | `breakpoint` |
| `transitionProperty` | `property` |
| `easing` | `ease` |

In wind4, `width`/`height`/`maxWidth`/`minWidth`/etc. **all unify onto the `spacing` scale**,
so a custom `spacing` value propagates to every sizing utility. wind4 also removes the
`grid*` theme keys (use arbitrary values), and adds `insetShadow` and `defaults`.

```ts
// wind3 theme shape
theme: { fontFamily: { sans: 'Inter' }, borderRadius: { lg: '0.75rem' }, breakpoints: { md: '768px' } }

// wind4 theme shape
theme: { font: { sans: 'Inter' }, radius: { lg: '0.75rem' }, breakpoint: { md: '768px' }, spacing: { 4: '1rem' } }
```

**CSS-variable model:** wind3 inlines theme values at build time (no theme CSS variables).
wind4 tracks token usage and emits `--un-*` custom properties (`:root`) — `'on-demand'`
(default), `'full'`, or `false` (wind3-like inlining). wind4 declares them with `@property`,
enabling transitions on variable-backed values.

**Decision:** choose **wind3** for maximum compatibility with third-party packages built for
it and minimal migration effort; choose **wind4** when aligning to Tailwind v4 or starting
fresh. Packages built for wind3 may hit theme-key mismatches under wind4.

## Community presets fill the plugin gap

Since the plugin system is gone, lean on community presets (the canonical index is the
[Awesome UnoCSS](https://github.com/unocss-community/awesome-unocss) list). They use the same
`presets[]` API. Place them **after** your base preset so their rules win on conflict.

```ts
import { defineConfig, presetWind3 } from 'unocss';
import presetScrollbar from 'unocss-preset-scrollbar';   // scrollbar-thin, scrollbar-thumb-{color}
import presetAnimations from 'unocss-preset-animations';  // composable motion utilities

export default defineConfig({
  presets: [presetWind3(), presetScrollbar(), presetAnimations()],
});
```

Other notable ones: `unocss-preset-fluid` (clamp()-based fluid type/spacing without
breakpoints), `unocss-preset-daisy` (DaisyUI components).

<!--
Source references:
- https://unocss.dev/guide/why
- https://unocss.dev/presets/wind3
- https://unocss.dev/presets/wind4
- https://github.com/unocss-community/awesome-unocss
-->
