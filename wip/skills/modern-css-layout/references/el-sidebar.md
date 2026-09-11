# The Sidebar

A layout where a fixed-width sidebar sits beside a fluid content area, wrapping to a vertical configuration intrinsically without media queries.

## Core Problem

Media queries pertain to the *viewport* width, not the actual available space. A component inside a `300px` container and a `500px` container sees the same viewport width. Components need to be context-aware, not viewport-aware.

Flexbox with `flex-basis` can govern its own layout per context. By designing to *ideal* element dimensions and tolerating reasonable variance, you can do away with `@media` breakpoints.

## The Solution

The Sidebar exists in one of two configurations -- horizontal or vertical -- determined entirely by the space available.

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
}

.sidebar {
  flex-basis: 20rem;
  flex-grow: 1;
}

.not-sidebar {
  flex-basis: 0;
  flex-grow: 999;
}
```

The `.not-sidebar` element's high `flex-grow` value (999) causes it to take up all available space. The sidebar's `flex-basis` is subtracted from the total, creating the sidebar effect. The non-sidebar squashes the sidebar down to its ideal width.

## Controlling the Wrap Point

Use `min-inline-size` to define when wrapping occurs:

```css
.not-sidebar {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}
```

When `.not-sidebar` would be less than or equal to `50%` of the container width, it wraps to a new row and grows to `100%`. The value `50%` is apt because a sidebar ceases to be a sidebar when it is no longer the narrower element.

## The Gutter

Use the `gap` property for spacing between elements regardless of configuration:

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.sidebar {
  flex-basis: 20rem;
  flex-grow: 1;
}

.not-sidebar {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}
```

## Intrinsic Sidebar Width

Omit `flex-basis` entirely to let the sidebar's *content* determine its width. An image inside the sidebar at `15rem` wide makes the sidebar `15rem` in horizontal configuration, growing to `100%` when wrapped.

## Generator CSS

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
}

.with-sidebar > :first-child {
  flex-grow: 1;
}

.with-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| side | `string` | `"left"` | Which element is the sidebar ("left" or "right") |
| sideWidth | `string` | - | Width of sidebar when adjacent. Defaults to content width if unset |
| contentMin | `string` | `"50%"` | Minimum width of content element (CSS percentage) |
| space | `string` | `"var(--s1)"` | Space between the two elements |
| noStretch | `boolean` | `false` | Elements adopt their natural height |

## Examples

Media object:

```html
<sidebar-l space="var(--s2)" sideWidth="15rem" noStretch>
  <img src="path/to/image" alt="Description" />
  <p><!-- text accompanying the image --></p>
</sidebar-l>
```

Search input with button:

```html
<form>
  <sidebar-l side="right" space="0" contentMin="66.666%">
    <input type="text">
    <button>Search</button>
  </sidebar-l>
</form>
```

## Use Cases

Media objects, form inputs with buttons, any two-element layout where one element should have a fixed or intrinsic width and the other should fill remaining space.
