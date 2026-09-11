# Block Layer

A block is a skeletal component or organisational structure -- a card element, a button element.

## Role

By the time you reach the block layer, most work has been done by global CSS, composition, and utilities. A block provides a light, specific group of rules that only apply in that context. It runs against the grain of the higher layers when needed.

## No Formal Element Syntax

BEM uses `.my-block__my-element`. CUBE CSS does not require this. Formal element declaration is mostly redundant because higher layers have handled most styling.

Inside a block, you can use any selector approach. The parent block class (`.my-block`) gives one extra specificity point:

```css
.my-block {
}

.my-block .image {
}

.my-block .content {
}
```

You can also target HTML elements directly:

```css
.my-block {
}

.my-block img {
}

.my-block article {
}
```

The important thing is consistency within your team.

## Composition Within Blocks

Approach block internals with a composition layer. A card's content area can use the flow utility so any content is supported:

```html
<article class="card">
  <img class="card__image" alt="" />
  <div class="[ card__content ] [ flow ]">
    <!-- any content works here -->
  </div>
</article>
```

Hint the browser with flexible rules rather than micro-manage it.

## What a Block Should Do

1. Extend the work already done by global CSS, composition, and utility layers
2. Apply a collection of design tokens within a concise group
3. Create a namespace or specificity boost to control a specific context

## What a Block Should Not Do

1. Grow larger than 80-100 lines of CSS
2. Solve more than one contextual problem (e.g., styling a card and a button in one file)
