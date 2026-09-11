---
name: unocss-recipes
description: Task-oriented UnoCSS cookbook — minimal copy-paste recipes for common goals
---

# UnoCSS Recipes

A cookbook of short, copy-paste recipes. Each is a goal plus a minimal example. All configure a `uno.config.ts` and apply equally to Astro (via `unocss/astro`) and Vite (via `unocss/vite`).

## Install UnoCSS in a Vite project

Three pieces: the plugin in `vite.config`, a `uno.config.ts` selecting presets, and one virtual-CSS import. Only utilities you actually use are emitted.

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [UnoCSS()],
})
```

```ts [uno.config.ts]
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
})
```

```ts [main.ts]
import 'virtual:uno.css'
```

> In Astro, swap the plugin for `import UnoCSS from 'unocss/astro'` in `astro.config.mjs`; the virtual import is handled for you.

## Define and extend theme tokens

`theme` deep-merges with preset themes and feeds rule/variant matchers, so `text-primary`, `md:`, etc. resolve from it.

```ts [uno.config.ts]
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  theme: {
    colors: {
      primary: { DEFAULT: '#1fa2ff', 500: '#1fa2ff', 700: '#0a6ebd' },
      brand: 'var(--brand)',
    },
    breakpoints: { sm: '320px', md: '640px', lg: '1024px' },
  },
})
```

## Create static and dynamic shortcuts

Shortcuts alias utility combinations behind one name and emit to the `shortcuts` layer. Unlike `@apply`, they need no transformer.

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'py-2 px-4 font-semibold rounded-lg shadow-md'],       // array (static)
    { 'btn-green': 'text-white bg-green-500 hover:bg-green-700' }, // object
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`], // dynamic
  ],
})
```

## Write custom rules

Rules match in order. Static rules map an exact class to a CSS object; dynamic rules use a RegExp whose capture groups feed a matcher (return `undefined` to fall through). The matcher's second arg is the `RuleContext` (gives `theme`).

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  rules: [
    ['m-1', { margin: '1px' }],                                   // static
    [/^m-([.\d]+)$/, ([, d]) => ({ margin: `${d}px` })],          // dynamic
    [/^text-(.*)$/, ([, c], { theme }) => {                       // theme-aware
      if (theme.colors?.[c]) return { color: theme.colors[c] }
    }],
  ],
})
```

## Define a custom variant

A variant peels a prefix off a utility and rewrites the output selector. Return `{ matcher, selector }` (plus optional `parent`, `body`, `layer`, `sort`) when it owns the prefix; otherwise return the matcher unchanged.

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  variants: [
    (matcher) => {
      if (!matcher.startsWith('hover:')) return matcher
      return {
        matcher: matcher.slice(6),
        selector: s => `${s}:hover`,
      }
    },
  ],
})
```

## Use `@apply` / `@screen` / `theme()` in CSS

Add `transformerDirectives()` to reuse utilities inside plain CSS or SFC `<style>` blocks.

```ts [uno.config.ts]
import { defineConfig, transformerDirectives } from 'unocss'

export default defineConfig({
  transformers: [transformerDirectives()],
})
```

```css [styles.css]
.btn { @apply text-center my-0 font-medium rounded; }
.icon {
  width: theme('spacing.4');
  color: theme('colors.blue.500');
}
@screen sm { .btn { @apply px-6; } }
```

## Shorten variants with variant groups

`transformerVariantGroup()` expands grouped syntax so a shared prefix isn't repeated.

```ts [uno.config.ts]
import { defineConfig, transformerVariantGroup } from 'unocss'

export default defineConfig({
  transformers: [transformerVariantGroup()],
})
```

```html [usage]
<!-- hover:(...) expands to hover:bg-gray-400 hover:font-medium -->
<div class="hover:(bg-gray-400 font-medium) font-(light mono)" />
```

## Use attributify mode

`presetAttributify()` moves utilities into HTML attributes, keeping long class lists readable. For JSX/TSX add the JSX transformer so valueless attributes aren't dropped.

```ts [uno.config.ts]
import { defineConfig, presetAttributify, presetWind4 } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  presets: [presetWind4(), presetAttributify()],
  transformers: [transformerAttributifyJsx()], // only for JSX/TSX
})
```

```html [usage]
<button bg="blue-400 hover:blue-500" text="sm white" p="y-2 x-4" rounded>Button</button>
```

## Enable dark mode (class vs media)

`presetMini`/`presetWind4` provide a `dark:` variant. Class-based by default — toggle `.dark` on `<html>`. Pass `{ dark: 'media' }` to use `prefers-color-scheme`.

```html [class-based (default)]
<html class="dark">
  <div class="bg-white text-black dark:bg-black dark:text-white" />
</html>
```

```ts [media-query based]
import { defineConfig, presetMini } from 'unocss'

export default defineConfig({
  presets: [presetMini({ dark: 'media' })],
})
```

## Add pure-CSS icons with preset-icons

`presetIcons()` renders any Iconify icon as pure CSS via `i-{collection}-{name}`. Install collections on demand. Icons accept text colour, sizing, hover, and dark variants.

```bash [install collections]
npm i -D @iconify-json/mdi @iconify-json/carbon @iconify-json/logos
# or every collection: npm i -D @iconify/json
```

```ts [uno.config.ts]
import { defineConfig, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: { display: 'inline-block', 'vertical-align': 'middle' },
    }),
  ],
})
```

```html [usage]
<div class="i-mdi-alarm text-orange-400" />
<div class="i-logos-vue text-3xl" />
<button class="i-carbon-sun dark:i-carbon-moon" />
```

## Load web fonts with preset-web-fonts

`presetWebFonts()` fetches font CSS from a provider (`google`, `bunny`, `fontshare`, …) and exposes `font-*` utilities. Specify weights/styles with `Name:400,700`.

```ts [uno.config.ts]
import { defineConfig, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
  ],
})
```

## Style markdown/HTML with preset-typography

`presetTypography()` adds `prose` utilities that style raw HTML (e.g. rendered markdown). Apply `prose`, pick a theme with `prose-<color>`, and invert for dark mode with `dark:prose-invert`.

```ts [uno.config.ts]
import { defineConfig, presetTypography, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetTypography()],
})
```

```html [usage]
<article class="prose prose-truegray dark:prose-invert">
  <!-- rendered markdown / html -->
</article>
```

## Force-generate or block classes (safelist / blocklist)

UnoCSS only generates classes it can statically find. Classes assembled dynamically (e.g. `text-${color}`) may never be scanned — add them to `safelist`. Use `blocklist` to suppress accidental matches.

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  safelist: [
    'prose', 'm-auto', 'text-left',
    ...Array.from({ length: 10 }, (_, i) => `p-${i}`),
  ],
  blocklist: ['container', /^text-(gray|red)-100$/],
})
```

## Generate CSS in the browser with @unocss/runtime

No build step — drop a script tag and UnoCSS evaluates DOM classes at runtime. Set `window.__unocss` **before** loading the script. Great for prototypes, CMS, and embedded contexts. (See `runtime-cdn.md` for builds, presets, and FOUC handling.)

```html [index.html]
<script>
  window.__unocss = {
    rules: [ /* custom rules */ ],
    presets: [ /* merged with the default preset */ ],
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>

<div class="m-1 text-red-500 hover:underline">Hello</div>
```

<!--
Source references:
- https://unocss.dev/guide/ (recipes index)
- https://unocss.dev/integrations/vite
- https://unocss.dev/config/theme
- https://unocss.dev/config/shortcuts
- https://unocss.dev/config/rules
- https://unocss.dev/config/variants
- https://unocss.dev/transformers/directives
- https://unocss.dev/transformers/variant-group
- https://unocss.dev/presets/attributify
- https://unocss.dev/presets/icons
- https://unocss.dev/presets/web-fonts
- https://unocss.dev/presets/typography
- https://unocss.dev/guide/extracting#safelist
- https://unocss.dev/integrations/runtime
-->
