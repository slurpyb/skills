---
name: astro-content
description: Builds Astro content collections in `src/content.config.ts`. Use when adding a collection, writing a loader or schema, querying or rendering entries, configuring Markdown or MDX plugins, or migrating a legacy `src/content/config.ts`.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro content collections

## Work the project

1. Read `src/content.config.ts` (or `src/content/config.ts` if the project is still legacy), the directories it loads from, and one entry file per collection. Done when you can name every existing collection, its loader, and its schema fields.
2. Load `consult-astro-docs` for the loader and query APIs this task touches. Done when you have the current signature for each.
3. Extend an existing collection before adding one. Follow `astro-conventions` for any install. Done when `astro sync` regenerates types with no schema error.

## Config

Collections are defined in `src/content.config.ts` — one `defineCollection()` each, a single `collections` export, and `z` imported from `astro/zod` (Zod 4). A `loader` is required; a `schema` is optional and worth writing every time, because it is what types `entry.data` and turns bad frontmatter into a build error.

Load [loaders.md](references/loaders.md) to choose between `glob()`, `file()`, and a custom loader, or to write a schema.

## Query and render

`getCollection(name, filter?)` and `getEntry(name, id)` come from `astro:content`. `getEntry` can return `undefined` — check it. Sort entries yourself; collection order is not guaranteed.

Render body content with the standalone `render()`, also from `astro:content` — `const { Content, headings } = await render(entry)` — not a method on the entry.

Load [markdown.md](references/markdown.md) before touching Markdown plugins or MDX — Astro 7 renders Markdown with Sätteri, not unified.

## Request-time data

`src/content.config.ts` loads at build time. Data that must be fresh per request is a separate API — a *live* collection in `src/live.config.ts`, needing an adapter and giving up MDX and image optimization. Query `consult-astro-docs` for `defineLiveCollection` before writing one.

## Migration

Load [migration.md](references/migration.md) when the project has `src/content/config.ts`, `type: 'content'`, `entry.slug`, or `entry.render()`.

## Neighbours

- Starlight's `docsLoader()` and `docsSchema()` — skill `astro-starlight`.
- Page metadata built from `entry.data` — skill `astro-seo`.
