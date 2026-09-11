---
name: cube-css
description: CUBE CSS (Composition, Utility, Block, Exception) methodology — a pragmatic CSS architecture that works with the browser's cascade and inheritance. Use when designing CSS architecture, writing modern layout primitives, deciding utility vs. block placement, or migrating from BEM or utility-first systems like Tailwind.
---

# CUBE CSS

CUBE CSS (Composition, Utility, Block, Exception) is a CSS methodology oriented towards simplicity, pragmatism, and consistency. It works *with* the browser's cascade and inheritance, not against it.

Use this skill when designing a CSS architecture, writing modern layout primitives, deciding where to place styles (utility vs. block), or migrating from methodologies like BEM or utility-first systems like Tailwind.

## Key Concepts

CUBE CSS is a "cascade-first" methodology. The goal is to let CSS do the heavy lifting by styling at the highest level possible. Each subsequent layer only adds what the previous layers cannot handle.

*   **Composition**: High-level, flexible layout systems. This is the skeletal structure of a page or component.
*   **Utility**: Single-purpose helper classes that do one job well. They are often generated from design tokens.
*   **Block**: Skeletal components with minimal, context-specific rules. By the time you write a block, most of the styling should already be done by the layers above.
*   **Exception**: State-driven deviations from a block's rules. These are handled with data attributes, not classes, and are ideal for state changes driven by JavaScript.

## Quick Reference

Here are some practical examples demonstrating the core concepts of CUBE CSS.

### 1. The Flow Utility (Composition)

The `flow` utility creates consistent vertical spacing between sibling elements, a fundamental composition pattern.

```css
.flow > * + * {
  margin-top: var(--flow-space, 1em);
}
```

```html
<div class="[ card__content ] [ flow ]">
  <h2>Card Title</h2>
  <p>This paragraph will have a top margin.</p>
  <button>And so will this button.</button>
</div>
```

### 2. Contextual Override for Flow

You can easily override the default flow spacing within a specific block's context using CSS Custom Properties.

```css
/* In your block's CSS file */
.card__content {
  --flow-space: 1.4rem;
}
```

### 3. Simple Block Selectors

Blocks provide a specificity boost for a component's context. Unlike BEM, CUBE CSS encourages simple, readable selectors without a formal element syntax.

```css
/* A block provides a namespace */
.my-block {
  /* Block-specific styles */
}

/* Target child elements with simple descendant selectors */
.my-block .image {
  /* ... */
}

/* You can also target HTML elements directly */
.my-block article {
  /* ... */
}
```

### 4. State Exception with Data Attributes

Use `data-attributes` to handle exceptions or state changes, keeping them separate from styling classes.

```html
<article class="card" data-state="reversed"></article>
```

```css
/* Style the exception in your CSS */
.card[data-state='reversed'] {
  display: flex;
  flex-direction: column-reverse;
}
```

### 5. Generating Utilities from Design Tokens

Utilities are perfect for applying design tokens. Define tokens in a central place (like JSON) and generate utility classes from them.

```json
{
  "colors": {
    "primary": "#ff00ff",
    "base": "#252525"
  }
}
```

```css
/* CSS generated from the tokens */
.bg-primary {
  background: #ff00ff;
}
.color-base {
  color: #252525;
}
```

### 6. Class Grouping for Readability

To keep HTML clean when using multiple classes, CUBE CSS recommends a grouping convention.

```html
<article
  class="[ card ] [ section box ] [ bg-base color-primary ]"
  data-state="reversed"
></article>
```

## How to Use This Documentation

*   To understand the philosophy, start with the **Overview** and **Principles**.
*   For creating layouts and managing space, read the **Composition** reference.
*   For applying design tokens and single-purpose styles, see **Utilities**.
*   For styling specific components like cards or buttons, see **Blocks**.
*   For handling state changes (e.g., with JavaScript), see **Exceptions**.

## Reference Index

For more detailed information, consult the individual reference files:

*   [Overview](references/overview.md)
*   [Principles](references/principles.md)
*   [Cascade First](references/cascade-first.md)
*   [Composition](references/composition.md)
*   [Utilities](references/utilities.md)
*   [Blocks](references/blocks.md)
*   [Exceptions](references/exceptions.md)
*   [Grouping](references/grouping.md)
