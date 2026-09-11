# The Cluster

A flex-wrap layout for groups of elements that differ in length and need to distribute fluidly, like words in a sentence.

## Core Problem

`inline-block` elements are separated by word spaces that interact unpredictably with margins. Margins on wrapping elements create indents and missing vertical spacing. Even with fixes for left-aligned cases, doubled-up space occurs where margin interacts with parent padding.

## The Solution

Make the parent a Flexbox context. This eliminates word spaces and provides vertical alignment via `align-items`.

### The gap Property

Modern browsers support `gap` with Flexbox, injecting spacing *between* child elements without negative margins or wrapper elements:

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
}
```

### Legacy Negative Margin Technique

Before `gap` support, the approach used negative margins on a wrapper and halved margins on children:

```css
.cluster {
  --space: 1rem;
}

.cluster > * {
  display: flex;
  flex-wrap: wrap;
  margin: calc(var(--space) / 2 * -1);
}

.cluster > * > * {
  margin: calc(var(--space) / 2);
}
```

Today, `gap` without feature detection is recommended, accepting flush layouts in older browsers.

### Justification and Alignment

Clusters accept any `justify-content` and `align-items` values. Space and gap are honored regardless of wrapping.

For a page header with logo and navigation:

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
  justify-content: space-between;
  align-items: center;
}
```

The navigation list wraps below the logo when there is no room for its unwrapped content.

## Generator CSS

```css
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
  justify-content: flex-start;
  align-items: center;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| justify | `string` | `"flex-start"` | CSS `justify-content` value |
| align | `string` | `"flex-start"` | CSS `align-items` value |
| space | `string` | `"var(--s1)"` | CSS `gap` value between children |

## Examples

Basic:

```html
<cluster-l>
  <!-- child elements -->
</cluster-l>
```

List with ARIA semantics:

```html
<cluster-l role="list">
  <div role="listitem"><!-- item --></div>
  <div role="listitem"><!-- item --></div>
  <div role="listitem"><!-- item --></div>
</cluster-l>
```

## Use Cases

Buttons at the end of forms, lists of tags or keywords, meta information groups, page headers with logo and navigation using `justify-content: space-between`.
