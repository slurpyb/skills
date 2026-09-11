# The Reel

A horizontal scrolling layout using flexbox without wrapping, `overflow-x: auto`, scrollbar styling, and ResizeObserver for progressive enhancement.

## Core Concept

Vertical scrolling is conventional in `horizontal-tb` writing mode. Horizontal scrolling sections *within* a vertically scrolling page are acceptable for browsing categories of content (movies, products, photos). Bidirectional scrolling on a single element is a WCAG 1.4.10 Reflow failure.

## The Solution

Flexbox without `flex-wrap` forces single-file formation. `overflow-x: auto` invokes scrolling only on the element itself:

```css
.reel {
  display: flex;
  overflow-x: auto;
}
```

## Scrollbar Styling

A visible scrollbar provides affordance and drag-to-scroll functionality. Style it for visibility:

```css
.reel {
  display: flex;
  overflow-x: auto;
  scrollbar-color: var(--color-light) var(--color-dark);
}

.reel::-webkit-scrollbar {
  block-size: 1rem;
}

.reel::-webkit-scrollbar-track {
  background-color: var(--color-dark);
}

.reel::-webkit-scrollbar-thumb {
  background-color: var(--color-dark);
  background-image: linear-gradient(
    var(--color-dark) 0, var(--color-dark) 0.25rem,
    var(--color-light) 0.25rem, var(--color-light) 0.75rem,
    var(--color-dark) 0.75rem
  );
}
```

The thumb uses a `linear-gradient` to create an inset appearance since margin/border are not supported on scrollbar pseudo-elements.

## Height

Let content determine the height. For images, set the Reel height and make images fill it while maintaining aspect ratio:

```css
.reel {
  block-size: 50vh;
}

.reel > img {
  block-size: 100%;
  width: auto;
}
```

## Spacing

Use the adjacent sibling combinator for spacing between items:

```css
.reel > * + * {
  margin-inline-start: var(--s1);
}
```

Or use `gap` in the Flexbox context:

```css
.reel {
  gap: var(--s1);
}
```

Padding on scrolling containers interacts unexpectedly -- the end padding is ignored. For padding around children, use margin on children plus a pseudo-element for the trailing space:

```css
.reel > * {
  margin: var(--s0);
  margin-inline-end: 0;
}

.reel::after {
  content: '';
  flex-basis: var(--s0);
  flex-shrink: 0;
}
```

## ResizeObserver for Overflow Detection

Detect overflow to conditionally add padding above the scrollbar and enable keyboard focus:

```js
const reels = Array.from(document.querySelectorAll('.reel'));

const toggleOverflowClass = elem => {
  elem.classList.toggle('overflowing', elem.scrollWidth > elem.clientWidth);
};

for (let reel of reels) {
  if ('ResizeObserver' in window) {
    new ResizeObserver(entries => {
      toggleOverflowClass(entries[0].target);
    }).observe(reel);
  }

  if ('MutationObserver' in window) {
    new MutationObserver(entries => {
      toggleOverflowClass(entries[0].target);
    }).observe(reel, {childList: true});
  }
}
```

```css
.reel.overflowing {
  padding-block-end: var(--s0);
}
```

The `MutationObserver` handles dynamically removed children. The `overflowing` class can also be used to add `tabindex="0"` for keyboard scrollability, or to show a "scroll for more" instruction.

## Affordance

Avoid percentage widths like `25%` or `33.333%` that fit elements exactly within the space, hiding the overflow. Partially obscured last elements indicate scrollability. Use the `overflowing` class to reveal instructions:

```css
.reel.overflowing + .instruction {
  display: block;
}
```

## Generator CSS

```css
.reel {
  display: flex;
  block-size: auto;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: #fff #000;
}

.reel::-webkit-scrollbar {
  block-size: 1rem;
}

.reel::-webkit-scrollbar-track {
  background-color: #000;
}

.reel::-webkit-scrollbar-thumb {
  background-color: #000;
  background-image: linear-gradient(#000 0, #000 0.25rem, #fff 0.25rem, #fff 0.75rem, #000 0.75rem);
}

.reel > * {
  flex: 0 0 auto;
}

.reel > img {
  block-size: 100%;
  flex-basis: auto;
  width: auto;
}

.reel > * + * {
  margin-inline-start: 1rem;
}

.reel.overflowing {
  padding-block-end: 1rem;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| itemWidth | `string` | `"auto"` | Width of each child element |
| space | `string` | `"var(--s0)"` | Space between items |
| height | `string` | `"auto"` | Height of the Reel |
| noBar | `boolean` | `false` | Hide the scrollbar |

## Examples

Cards:

```html
<reel-l itemWidth="20rem">
  <box-l>
    <stack-l><!-- card content --></stack-l>
  </box-l>
  <box-l>
    <stack-l><!-- card content --></stack-l>
  </box-l>
</reel-l>
```

Navigation links (sausage links):

```html
<reel-l role="list" noBar>
  <div role="listitem"><a href="/home">Home</a></div>
  <div role="listitem"><a href="/about">About</a></div>
  <div role="listitem"><a href="/pricing">Pricing</a></div>
</reel-l>
```

## Use Cases

Carousels/sliders replacement, browsing categories (movies, products, photos), horizontal navigation menus ("sausage links").
