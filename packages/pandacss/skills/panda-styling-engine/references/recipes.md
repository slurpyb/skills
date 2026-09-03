# Recipes

Load when one reusable component part has visual variants, defaults, or compound variant behavior.

## Using Recipes

- Import the generated config recipe from the styled-system recipe entry.
- Prefer a component already bound with `styled(component, recipe)` so recipe variants become typed component props.
- Select variants declaratively at the call site.
- Keep consumer `className` separate for independently owned classes; the recipe remains the visual owner.
- Use the generated variant-prop splitter only when a wrapper must separate recipe props from DOM or component props.

## Creating Recipes

Create a config recipe with `defineRecipe` in the shared preset:

- `className` gives the recipe a stable generated identity.
- `base` holds presentation common to every variant.
- `variants` names independent visual decisions.
- `defaultVariants` makes the default contract explicit.
- `compoundVariants` handles combinations rather than duplicating branches.
- `jsx` lists wrapper component names when extraction must recognize aliases.
- recipe-local `staticCss` pre-generates variants invisible to extraction.

Use one recipe only when one class can own the component's styled surface. A coordinated multipart component belongs in a slot recipe.

Variant names describe product choices such as size, emphasis, orientation, or state. Keep raw CSS property names and arbitrary values out of the public component contract.

After changing a recipe, export it from the preset barrel, regenerate the styled system, check the generated variant types, and inspect representative states.

Next: for a React wrapper load [react-standard-recipe.md](./react-standard-recipe.md); for coordinated parts load [slot-recipes.md](./slot-recipes.md); for theme-dependent values load [semantic-tokens.md](./semantic-tokens.md).
