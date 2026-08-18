# Migrating legacy collections

The original Content Collections API is gone. Astro 6 removed the `legacy.collections` flag *and* the silent backwards compatibility that let Astro 5 projects keep old collections working without a flag — so a project that built cleanly on 5 can fail on 6 or 7. Load the current v6 upgrade guide through `consult-astro-docs` alongside this list.

`legacy.collectionsBackwardsCompat: true` buys time: it restores the old config path, loader-less `type` collections, `entry.slug`, `entry.render()`, and path-based ids. Treat it as a way to get the build green, then work the list below and remove it.

## The rewrites

| Legacy | Now |
|---|---|
| `src/content/config.ts` | `src/content.config.ts` — the old path is a build error |
| `type: 'content'` / `type: 'data'` | a `loader`, usually `glob()` |
| a folder in `src/content/` with no declaration | every collection declared in the config; nothing is implicit |
| `entry.slug` | `entry.id`, slugified by `glob()` |
| `await entry.render()` | `await render(entry)`, imported from `astro:content` |
| `Astro.glob()` | `getCollection()`, or `import.meta.glob()` for non-collection files |

## Behaviour that changed under you

- `getEntry()` returns `CollectionEntry | undefined`. Code that used a literal id and skipped the check now has a type error.
- Entry order from `getCollection()` is platform-dependent. Any page that relied on the old ordering needs an explicit sort.
- Ids are slug-based, not path-based. Routes built from `entry.id` produce different URLs than legacy `slug` did unless frontmatter carries a `slug` field.
- The `layout` frontmatter field does nothing in a collection entry. Wrap the rendered `<Content />` in a layout in the dynamic route instead.
- A leading underscore on a filename no longer excludes an entry. Filter drafts through the schema and a `getCollection()` predicate.
- `image().refine()` is unsupported. Move image checks to runtime.

## Verify

Run `astro sync`, then a build. Content collection errors name the collection and entry, so read the error rather than guessing — the [content collection error list](https://docs.astro.build/en/reference/error-reference/#content-collection-errors) maps each one to a cause.
