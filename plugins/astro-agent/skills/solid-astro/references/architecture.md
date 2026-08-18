# Architecture

The `src/` tree this skill assumes, and how to split a file that outgrew its limit.

## Tree

```text
src/
├── components/              # UI components
│   ├── common/              # shared across features (Button, Card)
│   └── blog/                # grouped by feature
├── layouts/                 # page wrappers
├── pages/                   # routes: composition only
├── lib/                     # data services and shared helpers
│   ├── blog.ts
│   └── utils.ts
├── interfaces/              # every exported type
│   ├── content.interface.ts
│   ├── component.interface.ts
│   └── api.interface.ts
├── content/                 # collections and their schemas
└── styles/
```

Per-kind line limits live in `SKILL.md`.

## Import direction

Imports flow one way, so a change to a leaf never reaches back up:

```text
pages → layouts → components → lib → content collections / external API
```

Types are the exception: anything may import from `src/interfaces/`.

A page reads its data through `src/lib/`, never by querying a collection or an API in its own frontmatter. Components take data as props or call a service; they stay unaware of the routes that mount them.

## Naming

| Kind | Pattern | Example |
|---|---|---|
| Component, layout | `PascalCase.astro` | `BlogCard.astro` |
| Page | `kebab-case.astro` | `getting-started.astro` |
| Service, helper | `camelCase.ts` | `blog.ts` |
| Interface file | `[domain].interface.ts` | `content.interface.ts` |
| Props interface | PascalCase, `Props` suffix | `BlogCardProps` |

## Splitting a page

Move each section of markup into a component under `src/components/<feature>/` and each query into a service, leaving the page as imports plus composition:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroSection from '../components/home/HeroSection.astro';
import FeaturesGrid from '../components/home/FeaturesGrid.astro';
import { getHomeData } from '../lib/home';

const { features } = await getHomeData();
---

<BaseLayout title="Home">
  <HeroSection />
  <FeaturesGrid features={features} />
</BaseLayout>
```

## Splitting a service

Split by responsibility and re-export the public surface, so importers keep the same path:

```text
src/lib/blog/queries.ts     # collection and API reads
src/lib/blog/transforms.ts  # shaping and sorting
src/lib/blog/index.ts       # re-exports; the only path components import
```
