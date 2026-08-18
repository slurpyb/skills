# Links and current locale

This file is the gotchas, not the API. `astro:i18n` also exports list, path, and code helpers — get their signatures from `consult-astro-docs`, and the manual-routing-only set from [routing.md](routing.md).

## Calling the URL helpers

An unconfigured `locale` throws, so guard a path you did not build yourself with `pathHasLocale` first. `getAbsoluteLocaleUrl` degrades to a relative URL when `site` is unset rather than throwing — set `site` and check the output.

The `path` argument controls the trailing slash: `getRelativeLocaleUrl('fr')` gives `/fr`, `getRelativeLocaleUrl('fr', '')` gives `/fr/`, and `getRelativeLocaleUrl('fr', 'about')` gives `/fr/about`.

`options` is `{ prependWith?, normalizeLocale? }`. `prependWith: 'blog'` yields `/blog/fr/about`. `normalizeLocale` defaults to true, which is what turns a `fr_CA` locale into the `fr-ca` segment; pass `false` to keep the configured casing.

## Reading the locale

`Astro.currentLocale` is computed from the URL in the syntax your `locales` use, and falls back to `defaultLocale` when the URL carries no prefix. It is `string | undefined`, so default it once per page — `const locale = Astro.currentLocale ?? 'en'` — and feed that one value to both `<html lang>` and the URL helpers.

`Astro.preferredLocale` and `Astro.preferredLocaleList` read the browser's `Accept-Language` against your `locales` and exist only on routes rendered on demand — they are `undefined` on prerendered pages, where `Astro.currentLocale` still works. Match your `codes` to the browser's syntax or nothing matches.

## Switching locale on the current page

To link the same page in another locale, strip the current locale's prefix off `Astro.url.pathname` and hand the remainder back to the helper. Take the prefix from config rather than writing a locale regex, so adding a locale stays a one-place edit:

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const current = Astro.currentLocale ?? 'en';
const prefix = getRelativeLocaleUrl(current, ''); // the current locale's root path
const rest = Astro.url.pathname.slice(prefix.length);
---
<nav aria-label="Language">
  {locales.map(({ code, label }) => (
    <a href={getRelativeLocaleUrl(code, rest)} hreflang={code} lang={code}
       aria-current={code === current ? 'true' : undefined}>{label}</a>
  ))}
</nav>
```

`getRelativeLocaleUrlList(rest)` gives the same URLs without labels — reach for it when you only need the hrefs, as in the alternates block of [hreflang.md](hreflang.md).

## Active links

Astro keeps the locale prefix in `Astro.url.pathname`, so a `pathname === href` comparison that worked before i18n now misses. Compare after stripping the same prefix, and match the home link exactly so it does not light up on every page:

```ts
// src/utils/isActiveLink.ts
export function isActiveLink(pathname: string, href: string, prefix: string): boolean {
  const strip = (p: string) => (p.startsWith(prefix) ? p.slice(prefix.length - 1) : p).replace(/\/$/, '') || '/';
  const current = strip(pathname);
  const target = strip(href);
  return target === '/' ? current === '/' : current.startsWith(target);
}
```
