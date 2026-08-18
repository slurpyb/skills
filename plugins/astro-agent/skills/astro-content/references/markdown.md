# Markdown and MDX

## Sätteri is the default

Astro 7 renders `.md` and `.mdx` with Sätteri, its native Rust pipeline. `@astrojs/markdown-remark` is no longer installed, so remark and rehype plugins copied from an Astro 5 or 6 config break the build with a missing package.

Sätteri applies GitHub-Flavored Markdown and smart punctuation by default, same as unified did. A project with no plugins needs no config at all.

Set `markdown.processor` to choose or configure a processor. Sätteri needs `@astrojs/markdown-satteri` installed only to pass options:

```js
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri({
      features: { gfm: false, smartPunctuation: false },
      mdastPlugins: [imgAttr()],
      hastPlugins: [satteriCallouts()],
    }),
  },
});
```

Sätteri calls them **mdast** plugins (unified's remark, operating on the Markdown tree) and **hast** plugins (unified's rehype, operating on the HTML tree). Options go to the plugin function, not into a nested array.

## Staying on unified

Install `@astrojs/markdown-remark` and pass `unified({ remarkPlugins, rehypePlugins })` to `markdown.processor`. Choose this when the project depends on a plugin with no Sätteri port, or on recma plugins in MDX — Sätteri has no recma equivalent.

Top-level `markdown.remarkPlugins`, `markdown.rehypePlugins`, and `markdown.remarkRehype` still work but are deprecated, and now require `@astrojs/markdown-remark` to be installed too. Move them into the processor.

`markdown.processor` sets the processor for the whole project; MDX can be pointed at a different one.

## Frontmatter computed by a plugin

A plugin writing to `data.astro.frontmatter` (Sätteri: `defineMdastPlugin`, `ctx.data.astro.frontmatter`) surfaces on the third value from `render()`:

```ts
const { Content, headings, remarkPluginFrontmatter } = await render(entry);
```

Schema validation runs on the file's own frontmatter, so computed fields are absent from `entry.data`. Read them from `remarkPluginFrontmatter`.

## MDX

`astro add mdx`, then include `mdx` in the collection's glob pattern. `<Content components={{ blockquote: Callout }} />` maps MDX elements to components.

Heading `id`s are injected by Astro after plugins run. A plugin that needs to read them runs after `satteriHeadingIdsPlugin()` (or `rehypeHeadingIds` on unified), placed first in the list.
