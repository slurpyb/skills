---
name: astro-assets
description: Optimizes images and loads fonts in Astro. Use when adding local or remote images, choosing between `<Image />`, `<Picture />`, and `getImage()`, making images responsive, or registering a font family.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# Astro assets

## Work the project

1. Read `astro.config.*` for `image` and `fonts`, then search `src/` for `<Image`, `<Picture`, `getImage(`, and `<Font`. Done when you can name the configured `image.layout` and every registered font family, or confirm neither is set.
2. Load `consult-astro-docs` for each API this task touches. Done when you have the current props for them.
3. Match the patterns already in the project, and install packages per `astro-conventions`. Done when the new markup uses the same components and `layout` as the usages you found in step 1.

## Image vs Picture vs getImage

`<Image />` emits one `<img>` in one format — `format` is singular and defaults to `webp`. Reach for it first. `alt` is required on both components.

`<Picture />` emits a `<picture>` with one `<source>` per entry in `formats` (`['avif', 'webp']`, most modern first) plus a `fallbackFormat` `<img>`. `formats`, `fallbackFormat`, and `pictureAttributes` exist only here; passing `formats` to `<Image />` does nothing.

`getImage()` is server-only and returns `{ src, attributes, srcSet }` for CSS backgrounds, endpoints, and custom components. Await it in frontmatter and pass `src` to the client.

## Local vs remote

Local images are imported from `src/` and get their dimensions for free. Files in `public/` are never optimized and never responsive.

Remote images need `width` and `height`, or `inferSize`. Both `inferSize` and any optimization require the host to be allowed by `image.domains` (exact hostnames) or `image.remotePatterns` (wildcards). An unauthorized remote image still renders, unoptimized.

## Responsive

Load [responsive.md](references/responsive.md) when setting `layout` or `image.responsiveStyles`, or hand-writing `widths` and `sizes`.

## Fonts

Configure top-level `fonts` with a provider from `fontProviders` (`astro/config`), then render `<Font cssVariable="…" />` in `<head>`. Load [fonts.md](references/fonts.md).

## Service

Sharp is the built-in default — there is no `@astrojs/sharp` to add. Strict package managers may need `pnpm add sharp`, and adapters that cannot run it need `passthroughImageService()`.

## Neighbours

- `og:image` and social meta — skill `astro-seo`.
- Images in collection frontmatter, through the schema's `image()` — skill `astro-content`.
