# JSON-LD

## set:html, and why it is not the safe option

`set:html` is the documented way to write a JSON-LD block, because a plain `{expression}` inside `<script>` is HTML-escaped like any other Astro expression — every `"` lands as `&quot;` and the schema is unparseable.

```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

`set:html` writes its value verbatim: Astro escapes nothing. `JSON.stringify` escapes for JSON, not for HTML, so it leaves `<` alone — and a schema string holding `</script>` closes the tag early and turns whatever follows into markup. Author-controlled text is fine; a CMS field, a comment, or a URL query value is not.

Escape the one character that can break out. `\u003c` parses back to `<`, so the schema is unchanged:

```astro
---
const ld = JSON.stringify(schema).replace(/</g, '\\u003c');
---
<script type="application/ld+json" set:html={ld} />
```

## Schemas

One `WebSite` (and `Organization`, if there is one) in the base layout; one page-type schema per page.

```astro
---
// src/layouts/BaseLayout.astro
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'My Site',
  url: Astro.site?.href,
  description: 'Site description',
};
---
```

```astro
---
// a blog post page
const { post } = Astro.props;
const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.description,
  image: new URL(post.data.image, Astro.site).href,
  author: { '@type': 'Person', name: post.data.author },
  datePublished: post.data.pubDate.toISOString(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': new URL(Astro.url.pathname, Astro.site).href,
  },
};
---
```

```astro
---
const crumbs = [
  { name: 'Home', url: Astro.site?.href },
  { name: 'Blog', url: new URL('/blog', Astro.site).href },
  { name: post.data.title, url: new URL(Astro.url.pathname, Astro.site).href },
];
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.url,
  })),
};
---
```

Every `url`, `@id`, and `image` is absolute. `.href` is explicit, though a bare `URL` also serializes to its href through `toJSON()`.

The schema must describe what the page actually shows. Structured data claiming a rating, a price, or an author the rendered HTML does not contain is a manual-action risk, so drive every field from the same data the page renders.
