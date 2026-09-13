---
name: unocss-tooling-inspector-ide
description: The UnoCSS Inspector, editor extensions (VS Code, JetBrains, Zed, LSP), and ESLint config
---

# UnoCSS Tooling, Inspector & IDE

Dev-time tooling that makes UnoCSS legible: a browser inspector, editor extensions for autocomplete and previews, and an ESLint config for class ordering and blocklists.

## Inspector (`@unocss/inspector`)

The Inspector UI ships with `unocss` and the Vite plugin — there is nothing extra to install. In an **Astro** project the Vite-backed dev server (`astro dev`) exposes it at the same `/__unocss` path.

Visit it in the dev server:

```
http://localhost:4321/__unocss   # Astro dev (Vite default is 5173)
```

It lets you:

- **Inspect generated CSS rules** — see exactly what each utility compiles to.
- **See applied classes per file** — which utilities each module triggered.
- **Test utilities in a REPL** — try classes against your current config without editing source.

The Inspector resolves against the live config, so changes to `uno.config.ts` are reflected after the dev server reloads.

## VS Code extension

Install [`antfu.unocss`](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) from the Marketplace. It gives you:

- Decoration and tooltip for matched utilities (hover to see the generated CSS).
- Auto-loading of your config — the extension finds the UnoCSS config under your project; if none is found it disables itself.
- A count of matched utilities.

For the best experience, keep config in a separate `uno.config.ts` file rather than inline in the plugin.

### Commands

| Command | Title |
| --- | --- |
| `unocss.reload` | UnoCSS: Reload UnoCSS |
| `unocss.insert-skip-annotation` | UnoCSS: Insert `@unocss-skip` for the selection |

### Useful configuration keys

| Key | Description | Type | Default |
| --- | --- | --- | --- |
| `unocss.disable` | Disable the extension | `boolean` | `false` |
| `unocss.root` | Project root containing the UnoCSS config | `array,string` | — |
| `unocss.include` | Directory of files to detect | `array,string` | — |
| `unocss.exclude` | Directory of files **not** to detect | `array,string` | — |
| `unocss.underline` | Underline decoration for class names | `boolean` | `true` |
| `unocss.colorPreview` | Colour preview decorations | `boolean` | `true` |
| `unocss.colorPreviewRadius` | Radius for the colour preview | `string` | `"50%"` |
| `unocss.remToPxPreview` | rem→px preview in hover | `boolean` | `true` |
| `unocss.remToPxRatio` | rem→px ratio | `number` | `16` |
| `unocss.selectionStyle` | Selection-style decorations | `boolean` | `true` |
| `unocss.strictAnnotationMatch` | Be strict about where to show annotations | `boolean` | `false` |
| `unocss.autocomplete.matchType` | Autocomplete matching type | `string` | `"prefix"` |
| `unocss.autocomplete.strict` | Be strict about where to show autocomplete | `boolean` | `false` |
| `unocss.autocomplete.maxItems` | Max autocomplete items | `number` | `1000` |

```json [.vscode/settings.json]
{
  "unocss.root": ".",
  "unocss.colorPreview": true,
  "unocss.autocomplete.matchType": "fuzzy"
}
```

### Icons preset

When using `presetIcons`, also install [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) for inlay preview, completion, and hover on `i-*` classes.

## JetBrains IDEs

A **community** plugin — [`unocss-intellij`](https://plugins.jetbrains.com/plugin/22204-unocss) — supports WebStorm, IntelliJ IDEA, etc. Not reviewed or maintained by the UnoCSS team; report issues to [re-ovo/unocss-intellij](https://github.com/re-ovo/unocss-intellij/issues).

Features:

- Auto-completion for UnoCSS classes
- Hover documentation
- Code folding
- Colour / icon preview

## Zed

A **community** extension — [`zed-unocss`](https://zed.dev/extensions/unocss) — installed from Zed's extension manager. Not reviewed or maintained by the UnoCSS team; report issues to [bajrangCoder/zed-unocss](https://github.com/bajrangCoder/zed-unocss/issues).

## LSP (Neovim, Emacs, any LSP client)

A **community** language server — [`unocss-language-server`](https://github.com/xna00/unocss-language-server) — brings autocomplete and hover CSS previews to any editor that speaks LSP. Not officially maintained.

```bash [install]
npm install -g unocss-language-server
```

```bash [start]
unocss-language-server --stdio
```

Then point your editor's LSP client at that command. Features: auto-completion for utilities and hover docs with CSS previews.

## ESLint config (`@unocss/eslint-config`)

Lints and auto-orders UnoCSS classes.

```bash [install]
bun add -d @unocss/eslint-config
```

```js [eslint.config.js]
import unocss from '@unocss/eslint-config/flat'

export default [
  unocss,
  // ...other configs
]
```

```json [.eslintrc (legacy)]
{
  "extends": ["@unocss"]
}
```

### Rules

Rule prefix depends on the config style: `unocss/<rule>` (flat) or `@unocss/<rule>` (legacy).

| Rule | What it does | Default-on? |
| --- | --- | --- |
| `order` | Enforce a consistent order for class selectors | yes |
| `order-attributify` | Enforce order for attributify selectors | yes |
| `blocklist` | Warn/error on classes in your `blocklist` | optional |
| `enforce-class-compile` | Require the `:uno:` prefix (pairs with the compile-class transformer) | optional |

`order` accepts `unoFunctions` (default `['clsx', 'classnames']`) and `unoVariables` (regex, default `['^cls', 'classNames?$']`) to also order classes passed into those helpers.

Enable optional rules explicitly:

```js [eslint.config.js]
import unocss from '@unocss/eslint-config/flat'

export default [
  unocss,
  {
    rules: {
      'unocss/blocklist': 'warn', // or 'error'
    },
  },
]
```

`blocklist` reads the `blocklist` array from your UnoCSS config; entries can carry a custom message:

```ts [uno.config.ts]
export default defineConfig({
  blocklist: [
    ['bg-red-500', { message: 'Use bg-red-600 instead' }],
    [/-auto$/, { message: s => `Use ${s.replace(/-auto$/, '-a')} instead` }],
  ],
})
```

`enforce-class-compile` is auto-fixable (adds the `:uno:` prefix) and currently only supports Vue templates.

<!--
Source references:
- https://unocss.dev/tools/inspector
- https://unocss.dev/integrations/vscode
- https://unocss.dev/integrations/jetbrains
- https://unocss.dev/integrations/zed
- https://unocss.dev/integrations/lsp
- https://unocss.dev/integrations/eslint
-->
