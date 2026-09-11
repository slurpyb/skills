# Boxes

The CSS box model, display types, logical properties, formatting contexts, and content-driven sizing.

## Everything is a Box

Every rendered element creates a box shape. `border-radius`, `clip-path`, and `transforms` can be deceptive, but everything takes up box-shaped space. Layout is the arrangement of boxes.

## The Box Model

The box model comprises content, padding, border, and margin. Default browser styles for elements like paragraphs use logical properties:

```css
p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
```

## The display Property

**Block** elements assume all available space in one dimension (horizontal in `horizontal-tb` writing mode, vertical in `vertical-lr`). They follow flow direction.

**Inline** elements are sized by their content, placed adjacently where space allows. They follow writing direction. Vertical margin and padding have no effect on inline elements. Prescribed `width` and `height` do not take effect.

**inline-block** is a hybrid: you can set vertical properties, but this can disrupt line height.

**none** removes the element from layout entirely, including from assistive technologies.

## Logical Properties

Physical properties (`margin-left`, `margin-right`) break when writing direction changes. Logical properties honor the content direction:

```css
/* Physical -- breaks in RTL */
.icon {
  margin-right: 0.5em;
}

/* Logical -- works in LTR and RTL */
.icon {
  margin-inline-end: 0.5em;
}
```

`margin-inline-end` applies margin after the element in the inline direction. `margin-block-start` applies margin before the element in the block direction. These adapt automatically to writing mode and direction.

## Formatting Contexts

`display: flex` and `display: grid` create new formatting contexts for child elements while the parent itself remains block-level. `display: flex` switches children from vertical to horizontal flow. These formatting contexts are the basis of layout primitives.

## Content-Driven Sizing

Content determines element size by default. Inline elements grow horizontally; block elements grow vertically. If you halve the width, the element must be twice as tall for the same content.

### box-sizing

`content-box` (default): padding and border add to prescribed dimensions.
`border-box`: content area shrinks to accommodate padding within prescribed dimensions.

```css
* {
  box-sizing: border-box;
}
```

### auto vs. 100%

`inline-size: 100%` with `content-box` causes overflow when padding is added. `inline-size: auto` (the default) fits within the parent regardless of `box-sizing`:

```css
/* Overflows with content-box */
.child {
  inline-size: 100%;
  padding: 1rem;
}

/* Fits correctly -- just use the default */
.child {
  padding: 1rem;
  /* inline-size: auto is implicit */
}
```

## Key Principle

Element dimensions should be derived from inner content and outer context. When you prescribe dimensions, things go wrong. Use `min-height` (Cover), `flex-basis` (Sidebar), and other suggestive properties. Instead of telling browsers what to do, allow them to calculate the best layout for the user, their screen, and their device.
