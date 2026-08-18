---
name: astro-starlight
description: Builds documentation sites on the Astro Starlight theme. Use when scaffolding a docs site, configuring the sidebar, defining the `docs` collection, excluding pages from search or swapping Pagefind for DocSearch, adding a Starlight plugin, or translating docs into more locales.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro Starlight

## Work the project

1. Read the `starlight()` call in `astro.config.*`, the `docs` collection in `src/content.config.ts`, and the tree under `src/content/docs/`. Done when you can name every option already set and the sidebar shape in force — or confirm Starlight is not installed yet.
2. Load `consult-astro-docs` for each Starlight option this task touches; the Starlight reference lives in that corpus. Done when you have the current type for every key you will write.
3. Edit the existing `starlight()` options rather than adding a second integration entry. Done when `astro build` completes and the pages you touched render.

## Scaffold

New site: `npm create astro@latest -- --template starlight`. Existing Astro project: `astro add starlight`, then define the `docs` collection yourself. `astro-conventions` owns the package-manager rules.

## Config

Starlight is one integration call, and nearly everything is an option on it: `title`, `logo`, `social`, `editLink`, `sidebar`, `locales`, `customCss`, `components`, `head`, `pagefind`, `plugins`. The sitemap is the exception — it turns on from `site` on the Astro config. `plugins` takes an array of plugin factories; read each plugin's own docs for its options. `social` is an **array** of `{ icon, label, href }`, icons named from Starlight's built-in set, no longer an object keyed by platform.

## Content collection

The `docs` collection lives in `src/content.config.ts` and loads through `docsLoader()`. Load [content-config.md](references/content-config.md) to write or repair it, add custom frontmatter fields, or migrate a legacy `src/content/config.ts`.

## Sidebar

With no `sidebar` key, Starlight autogenerates one from `src/content/docs/`, labelling each entry with the page's `title`. Load [sidebar.md](references/sidebar.md) to configure entries and groups, mix `autogenerate` into a group, add badges, or override from page frontmatter.

## Search

Pagefind is on by default and needs no config. Load [search.md](references/search.md) to exclude content, tune the client, or decide between Pagefind and DocSearch.

## Locales

`locales` is keyed by the directory under `src/content/docs/`, each value `{ label, lang?, dir? }`. The `root` key serves a language with no path prefix and requires `lang`. Set `defaultLocale` to whichever key is the source language, and skip it when that key is `root`. A single-language site in another language is `locales: { root: { label, lang } }` alone, with no language picker.

Translated UI strings come from an `i18n` collection using `i18nLoader()` and `i18nSchema()`, backed by JSON or YAML in `src/content/i18n/`. `astro-i18n` owns routing for sites that are not Starlight.

## Neighbours

Collections beyond the `docs` and `i18n` pair belong to `astro-content`; Astro version, output mode, adapters, and middleware to `astro-7`.
