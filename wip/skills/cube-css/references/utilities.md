# Utility Layer

A utility is a CSS class that does one job and does that one job well.

## Definition

A utility class most often has a single CSS property. It may have a few related properties in a concise group:

```css
.wrapper {
  margin-inline: auto;
  padding-inline: 1rem;
  max-width: 60rem;
}
```

One job, done well.

## Design Token Workflow

CUBE CSS works well with design systems because utilities map directly to design tokens. Tokens are typically defined outside the CSS codebase (e.g., JSON), and utility classes are generated from them.

Token source:

```json
{
  "colors": {
    "primary": "#ff00ff",
    "secondary": "#ffbf81",
    "base": "#252525"
  }
}
```

Generated utility classes:

```css
.bg-primary {
  background: #ff00ff;
}
.bg-secondary {
  background: #ffbf81;
}
.color-primary {
  color: #ff00ff;
}
.color-secondary {
  color: #ffbf81;
}
```

Applied in HTML:

```html
<article class="bg-primary color-base"></article>
```

This maintains design tokens as a single source of truth: define once, apply everywhere.

## What Utilities Should Do

1. Apply a single CSS property, or a concise group of related properties, to create reusable helpers
2. Extend design tokens to maintain a single source of truth
3. Abstract repeatability away from CSS and apply it in HTML instead

## What Utilities Should Not Do

1. Define a large group of unrelated CSS properties (e.g., `color`, `font-size`, and `padding` together -- that should be a block)
2. Be used as a specificity hack (e.g., setting all properties with `!important`)
