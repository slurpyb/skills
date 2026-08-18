# Content per locale

`astro-content` owns the collection API. This file is only what changes once routes are localized.

## One collection, a folder per locale

Keep translations inside one collection so the schema stays single-source, and let the folder carry the locale:

```
src/content/blog/
├── en/getting-started.md
└── fr/getting-started.md
```

One `glob()` loader over `src/content/blog` picks up both folders.

An entry's `id` is its path relative to the loader's `base`, so the locale is the first segment. Log one `id` before writing a filter against it.

## Routes stay in locale folders

Pages come from `src/pages/fr/blog/`, not a `[locale]` param — see the SKILL for why. Each locale folder gets its own route file, filtering the collection to that locale:

```astro
---
// src/pages/fr/blog/[...slug].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('fr/'));
  return posts.map((post) => ({
    params: { slug: post.id.replace(/^fr\//, '') },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<Content />
```

Duplicating that file per locale is the honest cost of folder routing. Factor the body into a layout or a shared component and leave only the locale literal in each page.

When a translation is missing, `i18n.fallback` covers the whole route rather than the entry — see [routing.md](routing.md). Filtering to a locale that has no entries yields an empty `getStaticPaths`, which builds no page at all and gives the fallback nothing to point at.

## UI strings

Navigation labels and button text do not belong in a collection. A typed dictionary keyed by locale gives you autocomplete and one place to add a language:

```ts
// src/i18n/ui.ts
export const ui = {
  en: { 'nav.home': 'Home', 'nav.about': 'About' },
  fr: { 'nav.home': 'Accueil', 'nav.about': 'À propos' },
} as const;

export function useTranslations(locale: string) {
  const strings = ui[locale as keyof typeof ui] ?? ui.en;
  return (key: keyof typeof ui.en) => strings[key] ?? ui.en[key];
}
```

A page calls it once — `const t = useTranslations(Astro.currentLocale ?? 'en')` — and both fallbacks above keep an unconfigured locale or a missing key rendering English rather than throwing.

Keys stay English in every locale file so a missing translation is a visible fall-through, not a lookup failure.
