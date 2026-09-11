# The Cover

A vertically centered layout using flexbox column direction and `margin-block: auto`, with a minimum block size and support for header/footer elements.

## Core Problem

Centering vertically with transforms or fixed heights causes overflow when content grows. Using `min-block-size` instead of a fixed height lets the element expand to accommodate content. But we need to handle optional header and footer elements around the centered content without adapting CSS per configuration.

## The Solution

The Cover is a Flexbox context with `flex-direction: column`. One principal element gravitates to the center via `margin-block: auto`. Optional header/footer elements are pushed away by these auto margins.

```css
.cover {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
  padding: 1rem;
}

.cover > * {
  margin-block: 1rem;
}

.cover > :first-child:not(h1) {
  margin-block-start: 0;
}

.cover > :last-child:not(h1) {
  margin-block-end: 0;
}

.cover > h1 {
  margin-block: auto;
}
```

How it works:

1. All children get `margin-block: 1rem` for minimum spacing
2. The centered element (`h1` by default) gets `margin-block: auto`, pushing it away from siblings and container edges
3. `:first-child:not(h1)` and `:last-child:not(h1)` remove extraneous outer margin only when those elements are *not* the centered element
4. Works with 1, 2, or 3 child elements without CSS changes

The `min-block-size: 100vh` makes the element *cover* the viewport height. It can be set to any value.

## Horizontal Centering

The Cover solves vertical centering only. Use the Center layout in composition for horizontal centering.

## IntersectionObserver Enhancement

Animate covers as they enter the viewport:

```js
if ('IntersectionObserver' in window) {
  const targets = Array.from(document.querySelectorAll('cover-l'));
  targets.forEach(t => t.setAttribute('data-observe', ''));

  const callback = (entries, observer) => {
    entries.forEach(entry => {
      entry.target.setAttribute('data-visible', entry.isIntersecting);
    });
  };

  const observer = new IntersectionObserver(callback);
  targets.forEach(t => observer.observe(t));
}
```

## Generator CSS

```css
.cover {
  display: flex;
  flex-direction: column;
  min-block-size: 100vh;
  padding: 1rem;
}

.cover > * {
  margin-block: 1rem;
}

.cover > :first-child:not(h1) {
  margin-block-start: 0;
}

.cover > :last-child:not(h1) {
  margin-block-end: 0;
}

.cover > h1 {
  margin-block: auto;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| centered | `string` | `"h1"` | Selector for the centered element |
| space | `string` | `"var(--s1)"` | Minimum space between/around children |
| minHeight | `string` | `"100vh"` | Minimum block-size |
| noPad | `boolean` | `false` | Disable padding on container |

## Examples

```html
<cover-l>
  <h1>Welcome!</h1>
</cover-l>
```

## Use Cases

"Above the fold" introductory content, full-viewport sections, book covers, hero areas with header navigation and centered headline.
