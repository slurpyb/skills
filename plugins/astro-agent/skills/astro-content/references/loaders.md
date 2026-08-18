# Loaders and schemas

Confirm signatures with `consult-astro-docs` before writing config. This file is the choice and the gotchas.

## Pick a loader

| Loader | When |
|---|---|
| `glob()` | A directory of files — Markdown, MDX, Markdoc, JSON, YAML, TOML. One entry per file. |
| `file()` | One local file holding many entries. |
| Custom | A CMS, API, or database read at build time. Check the [integrations directory](https://astro.build/integrations/?search=&categories%5B%5D=loaders) for an existing one first. |

`glob()` and `file()` import from `astro/loaders`, not `astro:content`.

## glob()

```ts
loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' })
```

`pattern` is relative to `base`. Entry `id` is slugified from the filename; a `slug` field in frontmatter or JSON data overrides it. An `id` containing `/` needs a rest param route (`[...id].astro`).

`generateId: ({ entry, base, data }) => string` replaces the default slugger. `retainBody: false` drops raw bodies from the data store — `entry.body` becomes `undefined` while `<Content />` still works. Reach for it only when the store is hitting a deploy size limit.

## file()

```ts
loader: file('src/data/authors.json')
```

Every entry needs a unique `id`: either an `id` property on each object in an array, or the object key in map form. Unlike `glob()`, ids are never generated.

JSON, YAML, and TOML parse natively. Anything else — CSV, or a nested JSON document holding several collections — needs `parser: (text) => ...`, which may be async. Glob patterns in the path fail; that is what `glob()` is for.

## Custom loader

A loader is `{ name, load(context) }` returned from a configuring function, typed `satisfies Loader` from `astro/loaders`. `load()` fetches, clears, validates, then writes:

```ts
load: async ({ store, parseData, generateDigest, logger }) => {
  const items = await fetchFromCms();
  store.clear();
  for (const item of items) {
    const data = await parseData({ id: item.id, data: item });
    store.set({ id: item.id, data, digest: generateDigest(data) });
  }
}
```

- `parseData()` validates against the schema. Writing raw data straight to `store.set()` skips validation, so entries reach pages unchecked.
- `digest` lets `store.set()` skip unchanged entries and return `false`.
- `renderMarkdown(content, { fileURL })` produces the `rendered` object that makes `render()` and `<Content />` available for this entry. Without a `rendered` field, `<Content />` outputs nothing.
- `meta` is a per-collection KV store for sync tokens and last-modified stamps, persisted between builds and readable only inside the loader.
- `logger.info()` over `console.log` — it tags output with the loader name.

A loader may ship its own `schema`, used when the collection defines none. A collection schema always wins. Dynamic schemas use `createSchema()`; the older schema-as-a-function signature is gone.

## Schemas

`schema` takes a Zod object, or a function receiving `{ image }` for local images:

```ts
schema: ({ image }) => z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  cover: image(),
  author: reference('authors'),
  draft: z.boolean().default(false),
})
```

- `z.coerce.date()` for frontmatter dates — a plain `z.date()` rejects the string.
- `reference('collection')` from `astro:content` links entries; resolve one by passing it back to `getEntry()`.
- `image()` resolves paths relative to the entry file and yields metadata for `<Image />`. `image().refine()` is unsupported — validate dimensions at runtime.
- `slug` is reserved. A schema containing it errors.
- Astro generates JSON Schema per collection under `.astro/collections/`, which JSON and YAML entry files can point at with `$schema` for editor validation.
