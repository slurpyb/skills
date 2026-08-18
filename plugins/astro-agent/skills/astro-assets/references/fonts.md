# Fonts

`fonts` is a top-level config array — not `experimental.fonts`. Confirm the current family options with `consult-astro-docs`.

## Shape

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  fonts: [{
    provider: fontProviders.fontsource(),
    name: 'Roboto',
    cssVariable: '--font-roboto',
    weights: [400, 700],
    styles: ['normal'],
    subsets: ['latin'],
  }],
});
```

Render the family once in `<head>`, usually from a layout:

```astro
---
import { Font } from 'astro:assets';
---
<Font cssVariable="--font-roboto" preload />
```

Then style with the variable: `font-family: var(--font-roboto)`. On Tailwind 4, map it in `@theme inline` instead of writing `font-family` yourself.

## Providers

`fontProviders` exports `adobe()`, `bunny()`, `fontshare()`, `fontsource()`, `google()`, `googleicons()`, `npm()`, and `local()`. Every provider downloads the files at build time and serves them from your own origin, so no provider costs a third-party request in production.

`local()` requires `variants` nested under `options`; a top-level `variants` key is ignored. Keep font files in `src/`, not `public/`, or they end up duplicated in the build.

## Gotchas

- `display` defaults to `swap`, not `optional`. Layout shift is fought by fallbacks, not by `display`.
- Astro synthesises a metric-matched fallback from the last generic family in `fallbacks`, which defaults to `sans-serif`. Set `fallbacks: ['monospace']` on a mono face or the synthesised metrics are wrong. `optimizedFallbacks: false` opts out.
- Preload sparingly — only faces visible above the fold. Each preload competes with other critical resources.
- To download only the combinations you use, repeat a family (same `name`, `provider`, `cssVariable`) with different `weights` and `styles`. Astro merges them.
- Variable fonts take a weight range as a string: `weights: ['300 700']`, or `weight: '100 900'` inside a local variant.
- Stale fonts in dev: delete `.astro/fonts`. In a build: `node_modules/.astro/fonts`.
