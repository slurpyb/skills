# hreflang

`astro-seo` owns canonical, Open Graph, and the rest of the meta. This file is only the locale alternates.

## Sitemap alternates

`@astrojs/sitemap` writes `xhtml:link rel="alternate"` entries for every locale once you pass its own `i18n` option. Install with `astro add sitemap` per `astro-conventions`.

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en-US', fr: 'fr-CA', es: 'es-ES' },
    },
  })],
  i18n: { defaultLocale: 'en', locales: ['en', 'fr', 'es'] },
});
```

The sitemap `i18n` block is a second, separate mapping — it does not read `i18n.locales`:

- Keys are the URL path segments Astro produces, so they must match your locale folder names. A URL with no matching segment is treated as `defaultLocale`.
- Values are language attributes: letters and hyphens only, so `fr-CA` rather than `fr_CA`. Use the regional tag you actually target.
- `defaultLocale` must be one of the keys.
- `site` is required, here as for any sitemap.

Two traps: `namespaces.xhtml` defaults to true and turning it off silently drops every alternate link, and the integration cannot enumerate dynamic routes under on-demand rendering — those pages need `customPages`, or `prerender`.

Per-entry control lives in `serialize()`, where `item.links` takes `{ lang, url }` (or `hreflang` instead of `lang`) for alternates the mapping cannot express.

## x-default

The integration's output covers only the locales you mapped, so add `x-default` yourself in the layout `<head>` if you want to name a language selector or a locale-agnostic landing page. That head block is also where alternates belong for a site with no sitemap:

```astro
---
import { getAbsoluteLocaleUrl } from 'astro:i18n';

const { path } = Astro.props; // path without a locale prefix, e.g. 'about'
const langs = { en: 'en-US', fr: 'fr-CA', es: 'es-ES' };
---
{Object.entries(langs).map(([locale, lang]) => (
  <link rel="alternate" hreflang={lang} href={getAbsoluteLocaleUrl(locale, path)} />
))}
<link rel="alternate" hreflang="x-default" href={getAbsoluteLocaleUrl('en', path)} />
```

Build each `href` with the helper so the routing strategy stays the config's job. Every URL you advertise has to resolve — an alternate pointing at a 404 loses you the whole cluster, which makes `i18n.fallback` and hreflang a matched pair.
