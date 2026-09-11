# Slot Recipes

Load when a reusable component has multiple named parts whose styles or variants must stay coordinated.

## Using Slot Recipes

- Consume the existing component API that is already bound to the generated slot recipe.
- Set shared variant props at the component root so every slot resolves the same variant selection.
- Use named parts rather than adding parallel local classes to descendants.
- Treat the generated slot map as implementation detail unless the owning component explicitly exposes it.

## Creating Slot Recipes

Create a config slot recipe with `defineSlotRecipe` in the shared preset:

1. Give it a stable `className` and `slots` list.
2. Put shared per-slot presentation under `base`.
3. Define each variant value as a map from slot name to style object.
4. Add `defaultVariants` and `compoundVariants` where the contract requires them.
5. Register it under `theme.extend.slotRecipes` and export it from the slot-recipe barrel.
6. Regenerate and verify every slot receives a class.

Choose slot boundaries that match stable semantic parts of the component. Missing or invented slots create undefined classes and split styling ownership.

Use a single-part recipe when one element owns the visual contract. Use a pattern when the concern is reusable arrangement rather than component presentation.

Next: for fixed React structure load [react-slot-component.md](./react-slot-component.md); for compound React parts load [react-style-context.md](./react-style-context.md); to compare ownership load [recipes.md](./recipes.md).
