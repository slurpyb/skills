# React Standard Recipe Component

Load when one React component part owns one reusable styled surface and a standard Panda recipe defines its visual variants.

## Choose this shape

Use a standard recipe for a native element or one behavior primitive whose presentation resolves to one class string. Use a slot recipe when several named parts must change together.

## Build the component

1. Import the generated recipe, its generated variant type, and Panda's `cx` helper.
2. Start the public props from the rendered element or behavior primitive props.
3. Add the generated recipe variant props without renaming their keys; resolve native-name collisions explicitly with `Omit` when the recipe axis owns that prop.
4. Call `recipe.splitVariantProps(props)` before forwarding DOM props.
5. Resolve the recipe once from the variant props.
6. Merge `cx(recipeClass, className)` so the generated class remains the foundation and the documented consumer class is last.
7. Forward the remaining props and ref to the real interactive or semantic element.

Use `styled(element, recipe)` when the element, forwarding rules, and ref contract are direct. Use an explicit wrapper when behavior props, child structure, event normalization, or polymorphism require code.

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
	const [variants, elementProps] = button.splitVariantProps(props);
	const { className, ...rest } = elementProps;
	return <button ref={ref} type="button" {...rest} className={cx(button(variants), className)} />;
});
```

## Public contract

Keep native names and semantics. A button defaults to `type="button"` when form submission is not its contract. A link remains an anchor with a destination. Offer polymorphism only across elements that preserve the documented behavior, or expose separate semantic components.

Keep visual options in the recipe's closed axes. Use `compoundVariants` for visual combinations and semantic tokens or `colorPalette` for theme variation.

## Extraction and ownership

Add every wrapper name to the recipe's `jsx` list when its Pascal-case name does not match the recipe identity. Pre-generate finite runtime-selected variants through the owning `staticCss` contract.

Consumers import the React component. The generated recipe stays inside the component package.

## Verification

Check that variant props do not reach the DOM, native props and refs do, consumer classes merge at the documented boundary, and generated CSS includes every supported variant.

Next: for public API decisions load [react-component-api.md](./react-component-api.md); for multiple parts load [react-slot-component.md](./react-slot-component.md).
