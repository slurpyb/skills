# Typography Foundation

Load when configuring global CSS variables, document typography, font faces, semantic font roles, or named text styles.

## Preset-owned globals

Define the shared baseline in `globalCss.extend`:

- map global border, placeholder, selection, focus-ring, body-font, heading-font, and mono-font variables to token paths;
- set `html.colorPalette` to the project's configured default accent palette, or to `neutral` when the project has no default accent.
- give `body` the semantic canvas background, default foreground, `body` text style, and semantic body font;
- group heading selectors under the `heading` text style and semantic heading font;
- assign each heading level its named `heading.*` text style;
- assign body-copy elements the `body` text style and semantic body font;
- apply the surveyed named text or layer styles for links, code, blockquotes, and lists.

This cascade gives intrinsic elements the design-system baseline. Components then add structure and variants through their owned recipes.

## Text styles first

Build the typography scale and semantic roles with Panda text styles. Include reusable size steps plus roles such as `heading`, `heading.*`, `body`, `label`, `link`, `code`, `blockquote`, and `list` when the project vocabulary provides them.

Consume those names through `textStyle` in global rules, recipes, and generated style props. When one heading level changes, deep-merge the matching `theme.extend.textStyles.heading` entry so the rest of the hierarchy stays intact.

## Variable fonts and semantic roles

Register brand variable fonts in `globalFontface` with `GlobalFontface` typing. Declare the supported weight range, style, format, and `fontDisplay: 'swap'`; keep resilient system fallbacks in the underlying font tokens.

Define semantic font tokens for `body` and `heading`, each referring to the appropriate base font token. Components and global rules consume the semantic role rather than a font-family literal.

## Verification

Inspect the active text-style and semantic-font vocabulary through Panda MCP, run codegen, and verify representative intrinsic elements at narrow and wide viewports. Confirm that font loading preserves readable fallback text and that heading overrides retain inherited role properties.

Next: for token authoring load [tokens.md](./tokens.md) and [semantic-tokens.md](./semantic-tokens.md); for preset assembly load [theme-config.md](./theme-config.md).
