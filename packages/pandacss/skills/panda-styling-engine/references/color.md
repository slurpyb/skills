# Color

Load when working with color opacity, semantic palettes, `colorPalette`, runtime palette selection, or color-mode behavior.

## Color Opacity Modifier

Use Panda's token opacity syntax when a token-derived color needs a stable alpha variation. Keep opacity choices in semantic tokens when the same role recurs.

## Virtual Color

`colorPalette` selects a palette namespace. Descendant references such as `colorPalette.solid.bg`, `colorPalette.surface.border`, or shade paths resolve through that selected namespace.

Use virtual color when several recipes share the same palette grammar but callers select a semantic color family. Define a complete, consistent semantic palette shape so every recipe can depend on the same roles.

## Runtime selection

Panda extraction must see every possible palette. For a finite runtime set:

1. define the allowed semantic palettes;
2. pre-generate them through `staticCss` or the project's theme emission contract;
3. restrict the public value to that finite set;
4. select the palette through a generated prop, recipe variant, condition, or stable attribute boundary.

## Color modes

Put light, dark, contrast, or theme switching in semantic tokens. Recipes consume semantic palette roles rather than branching on raw colors.

Use fixed color tokens to store concrete ramps. Use semantic tokens to name roles. Use virtual color to swap a whole compatible role set.

Next, load [semantic-tokens.md](./semantic-tokens.md) for role definitions or [theme-config.md](./theme-config.md) for static palette emission.
