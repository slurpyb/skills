# Starlight search

Confirm each signature with `consult-astro-docs` before writing. This file is the gotchas, not the API.

## Pagefind is already on

`pagefind` defaults to `true`. A Starlight site has full-text search with no config, no account, and no keys — the index is a static bundle built after `astro build`.

Two things surprise people:

- Search only works in a production build. The dev server shows a notice instead of results, so verify with `astro build && astro preview`.
- Pagefind cannot run when `prerender` is `false`. A fully on-demand Starlight site has no static output to index, so search must come from DocSearch or another provider.

## Excluding content

Whole page, from frontmatter:

```md
---
title: Internal notes
pagefind: false
---
```

Part of a page, from markup: wrap it in an element carrying `data-pagefind-ignore`.

## Tuning the client

Set `pagefind` to an object rather than a boolean to reach `ranking`, `indexWeight`, and `mergeIndex`. `mergeIndex` is the one to reach for when several sites should search as one; `ranking` exposes Pagefind's own scoring knobs (`pageLength`, `termFrequency`, `termSaturation`, `termSimilarity`, `diacriticSimilarity`, `metaWeights`). The option shapes are Pagefind's, so read Pagefind's docs for what the numbers mean.

## Choosing DocSearch

Stay on Pagefind unless one of these holds. Switching costs an Algolia account, an approval, and three secrets.

| | Pagefind | DocSearch |
|---|---|---|
| Setup | none | Algolia account plus program approval |
| Where it runs | static bundle you ship | Algolia's servers |
| Index size | grows the deploy | off your deploy |
| Analytics | none | search analytics and Insights |
| Works with `prerender: false` | no | yes |

The honest trigger is index size and traffic: a large docs site where the shipped Pagefind bundle becomes a real download, or a team that needs search analytics.

## Wiring DocSearch

Install `@astrojs/starlight-docsearch` and add it to Starlight's `plugins`:

```js
starlight({
  plugins: [
    starlightDocSearch({
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
    }),
  ],
})
```

Inline options cover `maxResultsPerGroup`, `disableUserPersonalization`, `insights`, and `searchParameters`. Function options such as `transformItems()` or `getMissingResultsUrl()` cannot be inlined — export a `DocSearchClientOptions` object from a file and pass `clientOptionsModule: './src/config/docsearch.ts'` instead.

DocSearch ships English UI strings only. Translate the modal by extending the `i18n` collection schema with `docSearchI18nSchema()` from `@astrojs/starlight-docsearch/schema` and adding `docsearch.*` keys to the locale JSON — see [content-config.md](content-config.md).

A self-hostable middle ground exists: the community Starlight DocSearch Typesense plugin keeps the DocSearch interface over a Typesense backend.
