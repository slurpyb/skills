# The Box

Symmetric padding, border, color inheritance, and high-contrast outline for individual element styling, separated from layout concerns.

## Core Concept

The Box handles styles intrinsic to individual elements -- styles not dictated by parent layouts. Layout primitives like the Stack handle margin; the Box handles padding. Keeping these concerns separate enables composition.

Global styles (font-family, color, line-height) should be inherited, not repeated per element. The Box only deals with layout-specific properties not handled by parents or globals.

## Padding

Padding is symmetric on all sides or none. An element with asymmetric padding is solving a more specific problem (often one that margin should handle instead).

```css
.box {
  padding: var(--s1);
}
```

## The Visible Box

A Box should show its shape via `border` or `background-color`.

### Color Inheritance

Force color inheritance so changing `color` and `background-color` only needs to happen in one place:

```css
.box {
  padding: var(--s1);
}

.box * {
  color: inherit;
}
```

### Inversion with Custom Properties

```css
.box {
  --color-light: #eee;
  --color-dark: #222;
  color: var(--color-dark);
  background-color: var(--color-light);
  padding: var(--s1);
}

.box * {
  color: inherit;
}

.box.invert {
  color: var(--color-light);
  background-color: var(--color-dark);
}
```

### High Contrast Mode Support

High contrast themes eliminate backgrounds. Use a transparent outline to restore the box shape:

```css
.box {
  --color-light: #eee;
  --color-dark: #222;
  color: var(--color-dark);
  background-color: var(--color-light);
  padding: var(--s1);
  outline: 0.125rem solid transparent;
  outline-offset: -0.125rem;
}
```

The outline is invisible normally. Windows High Contrast Mode gives it a color, making the box visible. Negative `outline-offset` moves it inside the perimeter so it behaves like a border.

## Borders

Like padding, borders should be on all sides or none. Use contextual borders (via `* + *` on a parent) to separate child elements without doubling up.

## Generator CSS

```css
.box {
  padding: var(--s1);
  border: var(--border-thin) solid;
  --color-light: #fff;
  --color-dark: #000;
  color: var(--color-dark);
  background-color: var(--color-light);
}

.box * {
  color: inherit;
}

.box.invert {
  color: var(--color-light);
  background-color: var(--color-dark);
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| padding | `string` | `"var(--s1)"` | CSS padding value |
| borderWidth | `string` | `"var(--border-thin)"` | CSS border-width value |
| invert | `boolean` | `false` | Apply inverted theme |

## Examples

Box with header (nested boxes):

```html
<box-l padding="0">
  <box-l borderWidth="0" invert>head</box-l>
  <box-l borderWidth="0">body</box-l>
</box-l>
```

Box within a Stack:

```html
<stack-l>
  <p>...</p>
  <box-l><!-- content --></box-l>
  <p>...</p>
</stack-l>
```

## Use Cases

Messages, notes, cards in a grid, inner wrappers of dialogs. Compose boxes together for header/body patterns.
