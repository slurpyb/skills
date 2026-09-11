# React Slot-Recipe Component

Load when one React component owns a fixed multipart DOM structure and one slot recipe coordinates presentation across its parts.

## Choose this shape

Use a direct slot wrapper when callers configure the component as one unit and do not need to reorder, portal, or render its parts independently. Use style context when the parts form a compound API.

## Align anatomy

Declare stable semantic parts before implementation. Match each slot name to the corresponding behavior part and rendered element. Keep the root, controls, labels, indicators, content, and positioners distinct when they have independent styling responsibilities.

## Build the component

1. Import the generated slot recipe, generated variant type, and `cx`.
2. Combine semantic content and behavior props with the generated variant props.
3. Split variant props before forwarding root props.
4. Call the slot recipe once and keep the returned class map inside the component.
5. Apply each generated slot class to exactly one owned part.
6. Merge root `className` after the generated root class.
7. Expose a part-level class or props hook only when that part is a documented customization boundary.

The component owns the DOM order, required accessibility relationships, and default elements. Callers provide content and behavior values through named props or children rather than reconstructing the slots.

```tsx
const [variants, rootProps] = card.splitVariantProps(props);
const { className, ...rest } = rootProps;
const classes = card(variants);
return (
	<article {...rest} className={cx(classes.root, className)}>
		{header ? <header className={classes.header}>{header}</header> : null}
		<div className={classes.body}>{children}</div>
	</article>
);
```

## Behavior and state

Let the behavior primitive emit state attributes and measured CSS variables. Reference those through existing Panda conditions and recipe styles. Shared visual variants enter at the root and resolve every slot together.

Keep layout between the component's own parts in the slot recipe. Layout between separate components belongs to a pattern.

## Verification

Render every optional part, variant, compound variant, interaction state, direction, color mode, and responsive state. Confirm every declared slot receives a generated class and no variant prop reaches the DOM.

Next: for independently composable parts load [react-style-context.md](./react-style-context.md); for one styled surface load [react-standard-recipe.md](./react-standard-recipe.md).
