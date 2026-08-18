# Routing

This file is the traps, not the key reference.

## Where the keys sit

`defaultLocale`, `locales`, `fallback`, and `domains` are top-level in `i18n`; `prefixDefaultLocale`, `redirectToDefaultLocale`, and `fallbackType` live one level down under `routing`.

```js
// astro.config.mjs
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  fallback: { fr: 'en' },
  routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
}
```

`site` is required alongside for absolute URLs and for `domains`.

`redirectToDefaultLocale` sends `/` to `/[defaultLocale]/`. It is usable only with `prefixDefaultLocale: true`, and it defaults to `false` — it defaulted to `true` before Astro 6, where pairing it with the default `prefixDefaultLocale: false` could loop. Set both keys explicitly rather than inheriting either.

## Fallback

`fallback: { fr: 'en' }` makes Astro build a page under the `fr` route for every page the `en` locale has, so an untranslated route serves content instead of a 404.

`fallbackType` decides what that built page does, and the default surprises people:

- `'redirect'` (default) — the visitor is bounced to the `en` URL and the address bar changes.
- `'rewrite'` — the `en` content renders at the requested `/fr/...` URL, no redirect.

Pick `'rewrite'` when the localized URL has to survive, which is the usual want during an incremental translation.

## Custom locale paths

Map several language codes onto one URL segment by passing an object into `locales`:

```js
locales: ['en', { path: 'french', codes: ['fr', 'fr-BR', 'fr-CA'] }]
```

The folder must be named `src/pages/french/`, and `path` — not a code — is what you pass as `locale` to the URL helpers. `getPathByLocale('fr-CA')` returns `'french'`; `getLocaleByPath('french')` returns `'fr'`, the first code configured.

## domains

`domains` maps locales to their own hostnames (`fr: 'https://fr.example.com'`), and the absolute URL helpers return those hosts. It needs `site`, `output: 'server'` with no prerendered pages, an adapter that supports it, and a proxy that forwards `X-Forwarded-Host` and `X-Forwarded-Proto` — a missing header is a 404. Unmapped locales keep following `prefixDefaultLocale`.

## Manual routing

`routing: "manual"` disables Astro's i18n middleware entirely, and no other `routing` key may be set alongside it. You own the logic. Only under manual routing does `astro:i18n` export `middleware`, `requestHasLocale`, `notFound`, `redirectToDefaultLocale`, and `redirectToFallback` — reaching for `requestHasLocale` in an ordinary `src/middleware.ts` is the common mistake.

To extend rather than replace, compose Astro's own middleware with `sequence` and pass the routing options you dropped from config:

```ts
// src/middleware.ts
import { defineMiddleware, sequence } from 'astro:middleware';
import { middleware } from 'astro:i18n';

const mine = defineMiddleware(async (ctx, next) => next());

export const onRequest = sequence(
  mine,
  middleware({ prefixDefaultLocale: true, redirectToDefaultLocale: true, fallbackType: 'redirect' }),
);
```

Astro's i18n middleware runs first in the chain but does its own work last: your middleware and page logic resolve, then it validates the localized route. See `astro-7` for middleware basics.
