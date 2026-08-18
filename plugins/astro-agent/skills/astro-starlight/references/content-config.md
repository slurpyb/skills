# Starlight content config

Confirm each signature with `consult-astro-docs` before writing. This file is the gotchas, not the API.

## One file, one path

Starlight's collections are declared in `src/content.config.ts` — not `src/content/config.ts`, which is the legacy location and a common stale answer. The `docs` collection is required. The `i18n` collection is optional and only needed to translate UI strings.

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
```

Loaders come from `@astrojs/starlight/loaders`, schemas from `@astrojs/starlight/schema`. Two modules, easy to cross.

## The loaders are fixed paths

`docsLoader()` reads Markdown, MDX, and Markdoc from `src/content/docs/` — the directory is not configurable. `i18nLoader()` reads JSON and YAML from `src/content/i18n/` and takes no options. Both skip files whose name starts with `_`.

Starlight routes from the `docs` collection, so `glob()` in its place breaks routing even when the files load.

`docsLoader()` sluggifies each filename, lowercasing it and dropping special characters, so `Example.File.md` serves at `/examplefile`. Pass `generateId` to keep them:

```ts
docsLoader({
  generateId: ({ entry }) => entry.split('.').slice(0, -1).join('.'),
})
```

## Custom frontmatter

Extend `docsSchema()` rather than replacing it, so every field Starlight itself reads survives:

```ts
import { z } from 'astro/zod';

docs: defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      author: z.string().optional(),
      category: z.enum(['guide', 'reference', 'tutorial']).optional(),
    }),
  }),
}),
```

`i18nSchema({ extend: ... })` works the same way, and is how a plugin's UI strings get added — the DocSearch plugin ships `docSearchI18nSchema()` for exactly this.

Restart the dev server or press `s` to sync after a schema change; `astro:content` types are generated, not live.

## Migrating a legacy config

Move the declarations to `src/content.config.ts`, swap any `glob()` on the docs collection back to `docsLoader()`, and drop `type: 'content'`. If the surrounding project cannot move off legacy collections yet, `legacy.collectionsBackwardsCompat` in the Astro config keeps the v4 behaviour alive as a stopgap. `astro-content` owns the wider migration.
