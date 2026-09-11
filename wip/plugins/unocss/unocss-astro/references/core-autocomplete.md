---
name: unocss-core-autocomplete
description: The autocomplete config (templates, shorthands, extractors), the per-rule autocomplete meta DSL, and the @unocss/autocomplete engine
---

# UnoCSS Autocomplete

UnoCSS provides intelligent class suggestions in the [playground](https://unocss.dev/play) and the VS Code extension. The suggestions are powered by `@unocss/autocomplete` (in `packages-engine`), which reads each rule's `autocomplete` meta plus the global `autocomplete` config. In an Astro project, install the [UnoCSS VS Code extension](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) to get suggestions over your `.astro` files — it loads your `uno.config.ts` directly.

## Per-rule autocomplete (the `meta` DSL)

### Static rules

Static rules just work — no configuration needed:

```ts
rules: [
  ['flex', { display: 'flex' }],
]
```

### Dynamic rules

Dynamic (RegExp) rules produce no obvious suggestion, so attach an `autocomplete` template via the rule's `meta` object:

```ts
rules: [
  [
    /^m-(\d)$/,
    ([, d]) => ({ margin: `${d / 4}rem` }),
    { autocomplete: 'm-<num>' }, // <-- this
  ],
]
```

### Template DSL

The template uses a small DSL:

| Syntax | Meaning |
| --- | --- |
| `(...\|...)` | Logic **OR** groups, `\|`-separated — each alternative becomes a suggestion. |
| `<...>` | Built-in **shorthands**. Currently `<num>`, `<percent>`, `<directions>`. |
| `$...` | **Theme inferring** — e.g. `$colors` lists every key of the theme's `colors` object. |

## Global `autocomplete` config

Customise suggestions project-wide with `templates`, `shorthands`, and `extractors`:

```ts [uno.config.ts]
import { defineConfig } from 'unocss'

export default defineConfig({
  autocomplete: {
    templates: [
      // theme inferring
      'bg-$color/<opacity>',
      // short hands
      'text-<font-size>',
      // logic OR groups
      '(b|border)-(solid|dashed|dotted|double|hidden|none)',
      // constants
      'w-half',
    ],
    shorthands: {
      // equal to `opacity: "(0|10|20|30|40|50|60|70|90|100)"`
      'opacity': Array.from({ length: 11 }, (_, i) => i * 10),
      'font-size': '(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)',
      // override built-in short hands
      'num': '(0|1|2|3|4|5|6|7|8|9)',
    },
    extractors: [
      // ...extractors
    ],
  },
})
```

- **`templates`** — suggestion patterns written in the template DSL above.
- **`shorthands`** — a map of shorthand name → template. An **array** value is treated as a logic OR group. You may override built-in shorthands (e.g. redefine `num`).
- **`extractors`** — pick up possible classes and transform class-name-style suggestions into the correct format (e.g. the [attributify autocomplete extractor](https://github.com/unocss/unocss/blob/main/packages-presets/preset-attributify/src/autocomplete.ts)).

## Worked template examples

| Template | Input | Suggestions |
| --- | --- | --- |
| `(border\|b)-(solid\|dashed\|dotted\|double\|hidden\|none)` | `b-do` | `b-dotted`, `b-double` |
| `m-<num>` | `m-` | `m-1`, `m-2`, `m-3`… |
| `text-$colors` | `text-r` | `text-red`, `text-rose`… |

For **multiple templates** on one rule, pass an array. Each template contributes its own suggestions:

```ts
{ autocomplete: ['(border|b)-<num>', '(border|b)-<directions>-<num>'] }
```

- Input `b-` → `b-x`, `b-y`, `b-1`, `b-2`…
- Input `b-x-` → `b-x-1`, `b-x-2`…

## The @unocss/autocomplete engine

`@unocss/autocomplete` (part of `packages-engine`) is the package that powers editor suggestions from rules' `autocomplete` meta and the global `autocomplete` config. The VS Code extension and the playground both consume it; you rarely call it directly, but it is the same engine behind every suggestion described above.

<!--
Source references:
- https://unocss.dev/tools/autocomplete
- https://unocss.dev/config/autocomplete
- @unocss/autocomplete (packages-engine)
-->
