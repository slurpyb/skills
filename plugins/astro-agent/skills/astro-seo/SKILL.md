---
name: astro-seo
description: Emits SEO metadata from one Astro head component — Open Graph, Twitter Cards, and canonical links. Use when adding social preview tags, JSON-LD structured data, a sitemap, an RSS feed, robots.txt, `noindex`, or hreflang alternates.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro SEO

## Work the project

1. Read `astro.config.*` for `site` and for a `sitemap()` entry in `integrations`, then find where `<head>` is written — the layouts under `src/layouts/` and any `BaseHead` or `SEO` component they import. Done when you can name the one file each page's `<head>` comes from and list the meta already in it, or confirm pages write their own.
2. Load `consult-astro-docs` for `@astrojs/sitemap` and `@astrojs/rss` before configuring either. Done when you have their current options.
3. Put new meta in the shared head component, and install integrations per `astro-conventions`. Done when a new page inherits title, description, canonical, and `og:image` without touching its own frontmatter.

## Absolute URLs

`site` in `astro.config.*` is the root of everything here. Set it first: canonicals, `og:image`, the sitemap, and RSS links are all absolute, and `site` is the only place the deployed origin exists.

Build every one of them with `new URL(path, Astro.site)`. Canonical is `new URL(Astro.url.pathname, Astro.site)`; a relative `og:image` is ignored by every crawler. With `site` unset, `Astro.site` is `undefined` and that call throws at build — let it, since falling back to `Astro.url` ships `http://localhost:4321` URLs into the built HTML.

## Head component

Load [head.md](references/head.md) for the `<SEO />` props, the Open Graph and Twitter set, title templates, and `noindex`.

## Structured data

Inject JSON-LD with `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`. A plain `{expression}` inside `<script>` is HTML-escaped and the JSON arrives corrupt, so `set:html` is the way.

Load [json-ld.md](references/json-ld.md) for the escape any CMS-fed schema needs, and for the `WebSite`, `BlogPosting`, and `BreadcrumbList` shapes.

## Sitemap, robots, RSS

`astro add sitemap` (per `astro-conventions`) generates `/sitemap-index.xml` at build. `@astrojs/rss` is a plain package, not an `astro add` integration.

Load [sitemap-rss.md](references/sitemap-rss.md) for filtering, `robots.txt`, feed items, and discovery links.

## hreflang

`astro-i18n` owns locale alternates and `x-default` — load its `hreflang` reference. This skill owns the canonical beside them.
