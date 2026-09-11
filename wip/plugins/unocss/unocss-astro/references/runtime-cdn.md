---
name: unocss-runtime-cdn
description: Generate CSS in the browser at runtime with @unocss/runtime — no build step
---

# UnoCSS Runtime & CDN

`@unocss/runtime` evaluates the classes present in the DOM and injects the matching CSS **at runtime in the browser** — no Vite/build step required. It uses a `MutationObserver` to watch the DOM and generate styles on the fly as elements appear or change.

## When to use it (vs build-time)

| Use the runtime when… | Use the build-time Vite plugin when… |
| --- | --- |
| Prototyping in a single HTML file | Shipping a real Astro site |
| A CMS / editor injects HTML you don't control | Output size and zero client JS matter |
| Embedded widgets, email previews, sandboxes | You want tree-shaken, static CSS |

For an Astro project the default is the Vite plugin (`unocss/astro`), which emits static CSS at build time. Reach for the runtime only for genuinely dynamic, no-build contexts — it ships a JS payload and styles after first paint.

## Quick start (CDN script tag)

```html [index.html]
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>

<div class="m-1 text-red-500 hover:underline">Hello</div>
```

By default the **Wind3 preset** is applied. The runtime ships **no preflights/resets** — add one yourself if you want normalised styling:

```html [reset]
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/normalize.min.css" />
<!-- or -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css" />
```

## Configure via `window.__unocss`

Define the config **before** loading the runtime script. Custom presets/rules are merged with the default preset.

```html [index.html]
<script>
  window.__unocss = {
    rules: [
      // custom rules...
    ],
    presets: [
      // custom presets...
    ],
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime"></script>
```

## Prebuilt builds

Pick a bundle for your preset combination, or compose from `core`.

| Build | Presets included | URL |
| --- | --- | --- |
| Uno (default) | `preset-wind3` | `@unocss/runtime/uno.global.js` |
| Attributify | `preset-wind3` + `preset-attributify` | `@unocss/runtime/attributify.global.js` |
| Mini | `preset-mini` + `preset-attributify` | `@unocss/runtime/mini.global.js` |
| Core | none — assign presets manually | `@unocss/runtime/core.global.js` |

```html [attributify build]
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/attributify.global.js"></script>
```

### Core build — mix and match presets

Load each preset's global script first, then reference it from `window.__unocss_runtime.presets` before loading the core runtime:

```html [core + preset-icons]
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/preset-icons.global.js"></script>
<script>
  window.__unocss = {
    presets: [
      () =>
        window.__unocss_runtime.presets.presetIcons({
          scale: 1.2,
          cdn: 'https://esm.sh/',
        }),
    ],
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/core.global.js"></script>
```

## Bundler usage

Install the package and initialise it yourself — handy when you want the runtime but also a module pipeline.

```bash [install]
npm i @unocss/runtime
```

```ts [main.ts]
import initUnocssRuntime from '@unocss/runtime'

initUnocssRuntime({ /* options */ })
```

Reuse an existing config via the `defaults` property:

```ts [main.ts]
import initUnocssRuntime from '@unocss/runtime'
import config from './uno.config'

initUnocssRuntime({ defaults: config })
```

Presets can be imported straight from `esm.sh`:

```ts [uno.config.ts]
import { defineConfig } from '@unocss/runtime'
import presetIcons from 'https://esm.sh/@unocss/preset-icons/browser'
import presetWind4 from 'https://esm.sh/@unocss/preset-wind4'

export default defineConfig({
  presets: [presetWind4(), presetIcons({ cdn: 'https://esm.sh/' })],
})
```

## Preventing FOUC

Because the runtime applies styles only after the DOM is ready, there can be a flash of unstyled content. Hide elements until UnoCSS has run by pairing an `[un-cloak]` CSS rule with the `un-cloak` attribute — the runtime removes the attribute once styles are applied.

```css [style]
[un-cloak] {
  display: none;
}
```

```html [markup]
<div class="text-blue-500" un-cloak>This text will only be visible in blue.</div>
```

## Caveats

- **Ships client JS and styles late** — net-new render cost; not for performance-critical pages. In Astro, prefer the build-time plugin.
- **No resets by default** — add a `@unocss/reset` stylesheet if you need normalisation.
- **MutationObserver-driven** — only classes that end up in the DOM are generated; classes referenced solely in scripts that never reach the DOM won't be picked up.
- **Config must be set before the script loads** — `window.__unocss` defined afterwards is ignored.

<!--
Source references:
- https://unocss.dev/integrations/runtime
-->
