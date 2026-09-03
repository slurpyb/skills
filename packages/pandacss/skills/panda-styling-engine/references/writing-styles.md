# Writing Styles

Load after selecting the owning Panda primitive and before authoring its style objects.

Panda style objects use typed CSS properties, project shorthands, tokens, conditions, responsive values, nested selectors, and named style references.

## Style object order

Organize each object by responsibility:

1. structural display and positioning;
2. intrinsic sizing and layout participation;
3. spacing;
4. typography and foreground;
5. surface, border, and effects;
6. interaction and responsive conditions;
7. narrowly scoped descendant selectors.

## Values

- Choose semantic tokens for product meaning.
- Choose fixed tokens when defining theme vocabulary or low-level scales.
- Use logical properties for direction-aware layout.
- Use responsive objects for property changes across configured breakpoints.
- Use named conditions for interaction, component state, color mode, motion, and contrast.
- Use CSS variables only as an explicit boundary for values that cannot be represented by finite tokens or variants.

## Placement

Write style objects inside the primitive that owns them:

- pattern transforms for layout algorithms;
- recipe and slot-recipe branches for component presentation;
- named text, layer, and animation styles for reusable compositions;
- global styles for document-wide baselines;
- utility transforms for reusable property-language extensions;
- generated JSX props for small element-local presentation.

A style object is complete when every decision belongs to its owner and project vocabulary replaces repeated literals.

Next, load [merging-styles.md](./merging-styles.md) when several styling sources meet or [semantic-tokens.md](./semantic-tokens.md) when values express intent.
