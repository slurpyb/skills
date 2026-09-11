# The Grid

A responsive grid formation using CSS Grid's `auto-fit`, `minmax()`, and the `min()` function, requiring no media queries.

## Core Problem

CSS Grid lets you place content anywhere within a predefined grid, but the more deliberate the placement, the more `@media` breakpoints are needed. It is not possible to design *to a grid* in a context-independent, automatically responsive fashion. But it is possible to create grid-like formations that respond to available space.

## Flexbox Approach (Limitation)

Flexbox can create grid formations, but items on the last row grow to fill space, breaking column alignment:

```css
.flex-grid {
  display: flex;
  flex-wrap: wrap;
}

.flex-grid > * {
  flex: 1 1 30ch;
}
```

## CSS Grid with auto-fit and minmax

CSS Grid keeps items aligned to column boundaries:

```css
.grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

- `auto-fit` dynamically spawns and wraps columns
- `minmax()` ensures each column shares a width between a minimum and maximum
- `1fr` makes columns grow together to fill the container

The problem: the fixed minimum in `minmax()` causes overflow in containers narrower than that value.

## The min() Function Solution

Use `min()` to cap the minimum at `100%` when the container is narrower than the ideal minimum:

```css
.grid {
  display: grid;
  grid-gap: 1rem;
}

@supports (width: min(250px, 100%)) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  }
}
```

`min(250px, 100%)` returns `100%` where `250px` is larger than the evaluated `100%`. The algorithm decides where the width must be capped at `100%`. The `@supports` block provides a single-column fallback for browsers without `min()` support.

## ResizeObserver Alternative

For cases where JavaScript is acceptable, `ResizeObserver` can toggle a class based on container width:

```js
function observeGrid(gridNode) {
  if ('ResizeObserver' in window) {
    const min = gridNode.dataset.min;
    const test = document.createElement('div');
    test.style.width = min;
    gridNode.appendChild(test);
    const minToPixels = test.offsetWidth;
    gridNode.removeChild(test);

    const ro = new ResizeObserver(entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        const isWide = cr.width > minToPixels;
        gridNode.classList.toggle('aboveMin', isWide);
      }
    });

    ro.observe(gridNode);
  }
}
```

```css
.grid {
  display: grid;
  grid-gap: 1rem;
}

.grid.aboveMin {
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
}
```

The `min()` CSS solution is now preferred over this approach.

## Generator CSS

```css
.grid {
  display: grid;
  grid-gap: 1rem;
}

@supports (width: min(250px, 100%)) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  }
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| min | `string` | `"250px"` | The x in `minmax(min(x, 100%), 1fr)` |
| space | `string` | `"var(--s1)"` | Space between grid cells |

## Examples

Cards layout:

```html
<grid-l min="calc(var(--measure) / 3)">
  <box-l>
    <stack-l><!-- card content --></stack-l>
  </box-l>
  <box-l>
    <stack-l><!-- card content --></stack-l>
  </box-l>
  <box-l>
    <stack-l><!-- card content --></stack-l>
  </box-l>
</grid-l>
```

## Use Cases

Browsing teasers, product grids, card layouts. Compose each card with a Box and Stack inside the Grid.
