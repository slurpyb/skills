# Head component

One component, imported by every layout. Pages pass props; nothing writes `<meta>` on its own.

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
}
const { title, description, image = '/og-default.png', noindex = false } = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL(image, Astro.site);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{noindex && <meta name="robots" content="noindex,nofollow" />}

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

`new URL(image, Astro.site)` handles an already-absolute `image` correctly: an argument with its own origin ignores the base, so a CDN URL passes through untouched.

## Title

Compose in the component so pages pass only their own part.

```astro
---
const { title, siteName = 'My Site' } = Astro.props;
const fullTitle = title ? `${title} | ${siteName}` : siteName;
---
<title>{fullTitle}</title>
```

## og:image

1200×630 is the size every platform crops from. Generate it through `astro-assets` if it is a real project image rather than a static file in `public/`, and pass the resulting `src` into `image`.

## noindex

`<meta name="robots" content="noindex,nofollow">` is per page and is what keeps staging, admin, and thank-you pages out of the index. `robots.txt` is a crawl instruction, not an index instruction — a URL disallowed there can still be indexed from inbound links, and a crawler blocked from the page never sees the `noindex`. Use the meta tag for pages that must not appear, and keep them out of the sitemap too.

## Pagination

Point every page of a series at the first one, so ranking signals do not split.

```astro
---
const { page } = Astro.props;
const canonical = new URL('/blog', Astro.site);
---
<link rel="canonical" href={canonical} />
```
