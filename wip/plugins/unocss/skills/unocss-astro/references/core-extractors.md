---
name: unocss-core-extractors
description: What an extractor is, the default extractor, configuring extractors, and the Pug / MDC / Svelte / arbitrary-variants extractors
---

# UnoCSS Extractors

Extractors pull **candidate utility tokens** out of your source files — they define what the generator even *sees*. Without a matching extractor, a class written in an unusual syntax (Pug, Svelte `class:`, MDC inline props, bracket variants) is never offered to the rules and so generates no CSS.

An extractor implements one method:

```ts [types.ts]
export interface Extractor {
  name: string
  order?: number
  /** Extract the code and return a list of selectors. Return `undefined` to skip. */
  extract?: (ctx: ExtractorContext) => Awaitable<Set<string> | CountableSet<string> | string[] | undefined | void>
}
```

## The default extractor

By default, `extractorSplit` is **always** applied. It splits the source code into tokens on non-identifier boundaries and feeds them directly to the engine. This handles ordinary `class="..."` usage in HTML, Astro, JSX, Vue, etc.

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    // your extractors
  ],
})
```

Override or disable the default via `extractorDefault`:

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    // your extractors
  ],
  // disable the default extractor
  extractorDefault: false,
  // ...or override the default extractor with your own
  extractorDefault: myExtractor,
})
```

Custom extractors are added to the `extractors` array. Reference implementations: the [pug extractor](https://github.com/unocss/unocss/blob/main/packages-presets/extractor-pug/src/index.ts) and the [attributify extractor](https://github.com/unocss/unocss/blob/main/packages-presets/preset-attributify/src/extractor.ts).

> **Astro note:** The `@unocss/astro` integration scans your Vite-processed files automatically, so the default extractor covers `.astro` templates out of the box. `client:only` islands are an exception — they must live in `src/components/` or be added to UnoCSS's `content` config to be processed. Add the extractor below that matches each island's template language (e.g. `extractorSvelte()` for `.svelte` islands).

## Arbitrary Variants Extractor

Supports complex bracket-syntax variants like `[&>*]:m-1` and `[&[open]]:p-2`, capturing the bracket group as a variant rather than splitting on it.

```html
<div class="[&>*]:m-1 [&[open]]:p-2"></div>
```

This extractor is **included in `@unocss/preset-mini` as the default extractor**, so with `preset-mini`/`preset-wind3`/`preset-wind4` you normally don't install it manually. To add it standalone:

```bash
bun add -d @unocss/extractor-arbitrary-variants
```

```ts [uno.config.ts]
import extractorArbitrary from '@unocss/extractor-arbitrary-variants'
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    extractorArbitrary(),
  ],
})
```

## Pug Extractor

Extracts classes from Pug templates.

```bash
bun add -d @unocss/extractor-pug
```

```ts [uno.config.ts]
import extractorPug from '@unocss/extractor-pug'
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    extractorPug(),
  ],
})
```

## MDC Extractor

Extracts classes from [MDC (Markdown Components)](https://content.nuxtjs.org/guide/writing/mdc) syntax (used by Nuxt Content). It applies to `.md`, `.mdc` and `.markdown` files and reads inline prop syntax.

```bash
bun add -d @unocss/extractor-mdc
```

```ts [uno.config.ts]
import extractorMdc from '@unocss/extractor-mdc'
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    extractorMdc(),
  ],
})
```

Inline props like `{.text-2xl.font-bold}` are extracted from headings, links and images:

```md
# Title{.text-2xl.font-bold}

Hello [World]{.text-blue-500}

![image](/image.png){.w-32.h-32}
```

The `text-2xl`, `font-bold`, `text-blue-500`, `w-32`, and `h-32` classes are extracted.

## Svelte Extractor

Extracts classes from Svelte's `class:` directive. Useful when authoring `.svelte` islands inside an Astro project.

```bash
bun add -d @unocss/extractor-svelte
```

```ts [uno.config.ts]
import extractorSvelte from '@unocss/extractor-svelte'
import { defineConfig } from 'unocss'

export default defineConfig({
  extractors: [
    extractorSvelte(),
  ],
})
```

```svelte
<div class:text-orange-400={foo} />
```

`text-orange-400` is extracted and generates:

```css
.text-orange-400 {
  color: #f6993f;
}
```

<!--
Source references:
- https://unocss.dev/config/extractors
- packages-engine/core/src/types.ts (Extractor interface, v66.7.0)
- packages-engine/core/src/extractors/split.ts (default extractor)
- @unocss/extractor-{arbitrary-variants,pug,mdc,svelte}
-->
