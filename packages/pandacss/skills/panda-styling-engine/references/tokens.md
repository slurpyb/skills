# Tokens

Load when defining or selecting fixed design values such as spacing, sizes, fonts, radii, shadows, durations, easing, z-index, gradients, borders, or assets.

## Defining Tokens

- Use `defineTokens` in the shared theme or preset.
- Every leaf has a `{ value: ... }` shape.
- Group related values in nested lowercase keys.
- Use `DEFAULT` when a group needs both a base value and named children.
- Reference another token with Panda's token-reference syntax.
- Export the category through the token barrel and register it under `theme.extend.tokens`.

## Using Tokens

Use generated token names through pattern props, style props, recipes, slot recipes, named styles, and utility transforms. Use the typed token helper only when JavaScript needs the resolved CSS variable or value outside a style object.

## Selection rule

A token answers “what fixed value exists in the design language?” A semantic token answers “what does this value mean here?” Components generally consume the semantic layer while theme and configuration code define the fixed layer.

Add a token when a value belongs to a reusable scale or canonical set. Keep one-off algorithm inputs local when naming them would create vocabulary without reuse.

After token changes, run clean codegen and confirm generated names and references resolve.

Next, load [semantic-tokens.md](./semantic-tokens.md) for contextual meaning or [color.md](./color.md) for palette behavior.
