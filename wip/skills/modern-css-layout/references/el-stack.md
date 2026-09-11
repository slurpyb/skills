# The Stack

Injects vertical margin between sibling elements using the owl selector (`* + *`), with support for recursion, splitting, and custom property overrides.

## Core Concept

Margin is a property of the *relationship* between two elements, not of an individual element. Applying `margin-bottom` directly to elements creates redundant space on `:last-child` elements that doubles up with parent padding.

The Stack styles the *context*, not the individual element.

## The Owl Selector

```css
.stack > * + * {
  margin-block-start: 1.5rem;
}
```

The adjacent sibling combinator (`+`) ensures `margin-block-start` only applies where an element is preceded by another element. No leftover margin on first or last children. The `>` child combinator limits the effect to direct children.

## Recursion

Remove the child combinator to inject margins at any nesting depth:

```css
.stack * + * {
  margin-block-start: 1.5rem;
}
```

Useful for even spacing regardless of nesting level. Be aware this may affect elements you don't intend to space, such as list items.

## Nested Variants

Use different Stack classes with different margin values instead of recursion for more deliberate control:

```css
[class^='stack'] > * {
  margin-block: 0;
}

.stack-large > * + * {
  margin-block-start: 3rem;
}

.stack-small > * + * {
  margin-block-start: 0.5rem;
}
```

This pattern works well for form layouts: large spacing between fields, small spacing between label and input.

## Custom Property Overrides (Exceptions)

Use CSS custom properties with a fallback for per-element exceptions:

```css
.stack > * + * {
  margin-block-start: var(--space, 1.5em);
}

.stack-exception,
.stack-exception + * {
  --space: 3rem;
}
```

This works because `*` has zero specificity, so `.stack-exception` overrides `.stack > * + *` via source order in the cascade.

## Splitting the Stack (splitAfter)

Make the Stack a Flexbox context to push elements apart with `auto` margins. Useful for card-like components where some elements should gravitate to the bottom:

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}

.stack > :nth-child(2) {
  margin-block-end: auto;
}
```

When the Stack is the only child of its parent, set `block-size: 100%` so it stretches to match the parent and the split can occur:

```css
.stack:only-child {
  block-size: 100%;
}
```

## Generator CSS

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * {
  margin-block: 0;
}

.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| space | `string` | `"var(--s1)"` | A CSS margin value |
| recursive | `boolean` | `false` | Apply spacing regardless of nesting level |
| splitAfter | `number` | - | Element index after which to split with auto margin |

## Examples

Basic:

```html
<stack-l>
  <h2><!-- text --></h2>
  <img src="path/to/image.svg" />
  <p><!-- text --></p>
</stack-l>
```

Nested stacks with different spacing:

```html
<stack-l space="3rem">
  <h2><!-- heading --></h2>
  <stack-l space="1.5rem">
    <p><!-- body --></p>
    <p><!-- body --></p>
  </stack-l>
</stack-l>
```

List semantics with ARIA:

```html
<stack-l role="list">
  <div role="listitem"><!-- item 1 --></div>
  <div role="listitem"><!-- item 2 --></div>
</stack-l>
```

## Use Cases

Anywhere elements are stacked vertically, a Stack should be in effect. Grid cells are likely to be Stacks. The grid itself is likely a member of a Stack.
