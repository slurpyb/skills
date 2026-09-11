# Markdown, MDX & Content Collections

Astro content lives in Markdown/MDX (often inside typed **content collections**). UnoCSS works
across all of it — directly as utilities in MDX, and via `presetTypography` for the long-form prose
that Markdown renders into bare HTML (`<h1>`, `<p>`, `<ul>`…) with no classes to target.

## Utilities in MDX

MDX is scanned like any other source, so utilities and components work inline:

```mdx [src/content/blog/hello.mdx]
import Callout from '../../components/Callout.astro'

# Title

<p class="text-lg text-ink-700">Lead paragraph with a utility.</p>

<Callout client:visible />
```

Plain `.md` has nowhere to put a `class`, which is what `presetTypography` solves.

## Prose with `presetTypography`

`presetTypography` adds a `prose` class that styles raw HTML produced by Markdown (see
[preset-typography](preset-typography.md)). Wrap rendered content in `prose`:

```ts [uno.config.ts]
import { defineConfig, presetWind4, presetTypography } from 'unocss'
export default defineConfig({
  presets: [presetWind4(), presetTypography()],
})
```

```astro [src/pages/blog/[...slug].astro]
---
import { getCollection, render } from 'astro:content'
export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}
const { post } = Astro.props
const { Content } = await render(post)
---
<article class="prose prose-emerald mx-auto max-w-2xl py-12 dark:prose-invert">
  <Content />
</article>
```

- `prose-emerald` (or any theme colour) tints links/accents via the typography colour scheme.
- `dark:prose-invert` flips prose for dark mode — pairs with
  [astro-theming-tokens](astro-theming-tokens.md).
- Override per element with the `prose` selectors documented in
  [preset-typography](preset-typography.md), or with `css` option in the preset.

## Tuning prose from theme tokens

Drive the prose palette from your design tokens so it matches the rest of the site rather than
introducing a parallel set of colours:

```ts [uno.config.ts]
presetTypography({
  cssExtend: {
    'a': { color: 'var(--color-accent-600)', 'text-decoration': 'none' },
    'a:hover': { 'text-decoration': 'underline' },
    'code': { color: 'var(--color-ink-700)' },
  },
})
```

## Content-collection-driven pages still extract normally

A page generated from a collection is a normal `.astro` route — its utilities extract at build time.
The only special case is prose (handled above) and any **dynamic** class derived from frontmatter,
which must be a full string or safelisted (see
[astro-islands-and-extraction](astro-islands-and-extraction.md#dynamic-class-names-dont-extract)):

```astro [map a typed enum to full utility strings — extractable]
---
const statusClass = {
  required: 'bg-emerald-100 text-emerald-800',
  optional: 'bg-amber-100 text-amber-800',
} as const
const { status } = Astro.props // 'required' | 'optional'
---
<span class:list={['rounded-full px-2 py-0.5 text-xs', statusClass[status]]}><slot /></span>
```

## Icons in content

`presetIcons` gives pure-CSS icons usable straight in MDX or `.astro` (see
[preset-icons](preset-icons.md)) — ideal for Astro's zero-JS-by-default model since they ship as CSS,
not an icon-font or JS runtime:

```mdx
<span class="i-carbon-information align-middle" /> Note
```
