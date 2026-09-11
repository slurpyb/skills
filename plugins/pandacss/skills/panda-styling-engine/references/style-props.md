# Style Props

Load when a generated JSX element needs a small amount of element-local presentation.

Panda's generated JSX factory accepts typed style properties, shorthands, conditions, responsive objects, tokens, and named styles. Extraction happens at build time.

## Use style props when

- the element already comes from the generated `styled` factory or a generated pattern;
- the presentation is local to that one element;
- the prop set is short and does not define a reusable component contract;
- values are statically discoverable tokens or finite conditions.

```tsx
<Stack gap="4" align="start">
	<styled.p color="fg.muted" textStyle="body">
		Content
	</styled.p>
</Stack>
```

## Promote instead of accumulating

- Repeated arrangement becomes a pattern.
- Repeated single-part presentation becomes a recipe.
- Coordinated multipart presentation becomes a slot recipe.
- Repeated typography, surface, or motion becomes a named style.
- New values become tokens or semantic tokens.

Dynamic prop expressions are not automatically extractable. Model finite choices as variants or conditions and pre-generate them when extraction cannot see the selection.

Use responsive objects and named conditions rather than duplicating elements by breakpoint or interaction state.

Next, load [patterns.md](./patterns.md) for layout or [recipes.md](./recipes.md) when the prop set represents a reusable contract.
