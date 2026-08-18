---
name: astro-i18n
description: Routes and links multilingual Astro sites with the built-in `i18n` config and `astro:i18n`. Use when adding locale folders or `prefixDefaultLocale`, building links with `getRelativeLocaleUrl` or reading `Astro.currentLocale`, falling back to an untranslated locale, translating content per locale, or emitting hreflang alternates.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro i18n

## Work the project

1. Read `astro.config.*` for `i18n` and `site`, then list the folders under `src/pages/`. Done when you can name `defaultLocale`, every entry in `locales`, and which of them have a matching folder — or confirm `i18n` is unset.
2. Load `consult-astro-docs` for every config key and helper this task touches. Done when you have their current signatures and defaults.
3. Search `src/` for locale prefixes typed into `href`s and for hand-rolled locale parsing of `Astro.url`. Done when each locale-aware link you touch is built by `astro:i18n` and each locale read comes from `Astro.currentLocale`.

## Locale folders

Folder names under `src/pages/` must match `locales` entries exactly — `src/pages/fr/about.astro` serves `/fr/about`. Built-in i18n routes real folders, so a `src/pages/[locale]/` dynamic segment is a separate hand-rolled scheme that its helpers and middleware do not see.

`prefixDefaultLocale: false` (the default) keeps default-language files at the root of `src/pages/` and prefixes every other locale. `true` puts the default language in its own folder too — and `src/pages/index.astro` is still required.

## Routing config

`i18n.routing` is an object (`prefixDefaultLocale`, `redirectToDefaultLocale`, `fallbackType`) or the string `"manual"`. Load [routing.md](references/routing.md) for defaults, `fallback`, `domains`, custom locale paths, and manual middleware.

## Links and current locale

`getRelativeLocaleUrl(locale, path?)` builds in-site hrefs and applies the routing strategy for you. `getAbsoluteLocaleUrl` adds the origin from `site`. `Astro.currentLocale` is the locale of the page being rendered and works on prerendered pages.

Load [links.md](references/links.md) for the full `astro:i18n` export list, language switchers, active-link matching, and browser-preference detection.

## Content per locale

Load [content.md](references/content.md) when translating Content Collections entries or UI strings. `astro-content` owns the collection API itself.

## hreflang

Load [hreflang.md](references/hreflang.md) for the `@astrojs/sitemap` `i18n` option and in-page alternates. `astro-seo` owns the rest of the meta.
