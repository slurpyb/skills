# Sitemap, robots.txt, RSS

## Sitemap

`astro add sitemap` per `astro-conventions`. `site` is required — without it the integration cannot build a single URL.

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap({
    filter: (page) => !page.includes('/admin/'),
  })],
});
```

Build output is `/sitemap-index.xml` plus numbered `/sitemap-0.xml` files.

- `filter` receives the **full URL** including the origin, not a pathname. Anything you gave a `noindex` belongs here too.
- The integration crawls routes at build. Dynamic routes rendered on demand produce no entries — those pages need `prerender`, or listing in `customPages`.
- `changefreq` and `priority` are site-wide (per-page control is `serialize`), and Google ignores both. Reach for them only when another crawler asks.
- `filenameBase` renames the files, for a domain that already has a sitemap.

## robots.txt

A static `public/robots.txt` repeats the origin, so it goes stale when the domain changes. Generate it from `site` instead:

```ts
// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}`);
};
```

Add the head link as well: `<link rel="sitemap" href="/sitemap-index.xml" />`.

## RSS

`@astrojs/rss` installs as a package — there is no `astro add rss`.

```ts
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Blog',
    description: 'Latest articles',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
```

- Entry links come from `post.id`. `post.slug` is gone from the Content Layer — see `astro-content`.
- The endpoint's `site` is the config value again, so an unset `site` fails here as everywhere else.
- Feed links get a trailing slash regardless of your `trailingSlash` config. On `trailingSlash: 'never'`, pass `trailingSlash: false` to `rss()` or every feed link redirects.
- `rssSchema` from `@astrojs/rss` can be the collection schema, which makes a missing `pubDate` a content error rather than a broken feed.

Serving full post content means rendering and sanitizing the Markdown yourself — `sanitize-html` over a `markdown-it` render of `post.body`. Relative images and internal links do not resolve in a reader.

Autodiscovery, in `<head>`:

```astro
<link rel="alternate" type="application/rss+xml" title="My Blog" href={new URL('rss.xml', Astro.site)} />
```
