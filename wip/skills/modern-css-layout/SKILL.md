---
name: modern-css-layout
description: Modern CSS architecture — CUBE CSS methodology (Composition, Utility, Block, Exception) layered with Every Layout primitives (Stack, Cluster, Sidebar, Switcher, Cover, Grid, Frame, Reel, Imposter). Cascade-first, algorithmic, intrinsic. Uses logical properties and relative units (rem/em/ch/clamp/minmax). Use for any CSS architecture, responsive layout, or migration away from utility-only or BEM-only approaches.
---

# Modern CSS Layout

This skill provides documentation for a modern approach to CSS architecture, combining the **CUBE CSS** methodology with the powerful, algorithmic primitives from **Every Layout**. It's designed for creating scalable, consistent, and responsive layouts that work *with* the browser's natural abilities, not against them.

This approach is cascade-first, context-aware, and favors composition over inheritance. It allows you to build complex UIs from simple, reusable pieces, often without needing media queries.

**When to use:**
*   Writing modern, scalable CSS.
*   Building responsive layouts that are intrinsically flexible.
*   Creating component-based UIs with a consistent design system.
*   Migrating away from utility-only frameworks (like Tailwind) or rigid methodologies (like BEM).

## Key Concepts

*   **CUBE Methodology**: A CSS methodology that organizes styles into four layers, processed in order:
    1.  **Composition**: High-level, flexible layout systems (e.g., Every Layout primitives).
    2.  **Utility**: Single-purpose helper classes, often mapped to design tokens.
    3.  **Block**: Scoped styles for specific UI components (e.g., a card, a button).
    4.  **Exception**: State-based variations on a Block, handled with `data-` attributes.
*   **Algorithmic & Intrinsic Layout**: Instead of dictating exact pixel values and using rigid breakpoints, this approach "hints" at the browser's layout engine using flexible properties (`flex-basis`, `minmax()`, `clamp()`). The browser then calculates the best layout based on the available space and content, making components responsive by default.
*   **Composition over Inheritance**: Complex UI is built by combining simple, independent layout primitives (like `Stack`, `Grid`, `Sidebar`). These primitives handle arrangement, while other components (like `Box` or CUBE Blocks) handle the intrinsic styling.
*   **Cascade-First**: This approach embraces the CSS cascade, setting as many styles as possible at a high level (global styles). Each subsequent layer only adds the specific rules needed, resulting in less, more efficient CSS.
*   **Relative Units**: Using units like `rem`, `em`, and `ch` is crucial. They allow spacing, sizing, and typography to scale relative to user preferences and content, improving accessibility and layout robustness.

## Quick Reference

Here are some of the most common and practical code examples for building modern layouts.

### 1. The Stack: Vertical Spacing
The `Stack` is the most fundamental primitive. It injects consistent vertical space between sibling elements using the "owl" selector (`* + *`). This avoids extra margin on the first or last child.

```css
/* A Stack layout primitive */
.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}
```
```html
<!-- Applied in HTML -->
<div class="stack">
  <h2>A Heading</h2>
  <p>A paragraph of text that will have space above it.</p>
  <button>A button with space above it.</button>
</div>
```

### 2. The Grid: Responsive Grid without Media Queries
This powerful pattern creates a responsive grid that automatically adjusts the number of columns based on available space. The `min()` function prevents items from becoming smaller than a set minimum or `100%` of the container width, avoiding overflow.

```css
/* A responsive grid primitive */
.grid {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
}
```

### 3. The Sidebar: Intrinsically Wrapping Layout
The `Sidebar` creates a two-column layout where one element has a defined basis and the other fills the remaining space. It automatically "wraps" to a single column when the content area becomes too narrow, without any media queries.

```css
/* A Sidebar layout primitive */
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.with-sidebar > .sidebar {
  flex-basis: 20rem; /* The sidebar's ideal width */
  flex-grow: 1;
}

.with-sidebar > .not-sidebar {
  flex-basis: 0;
  flex-grow: 999; /* Takes up all remaining space */
  min-inline-size: 50%; /* The wrapping point */
}
```

### 4. The Cluster: Flexible Horizontal Grouping
The `Cluster` is perfect for groups of items that should sit side-by-side and wrap when space runs out, like tags or buttons. It uses `flexbox` and `gap` to manage spacing elegantly.

```css
/* A Cluster layout primitive */
.cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space, 1rem);
  align-items: center;
}
```
```html
<!-- Used for a group of tags -->
<div class="cluster">
  <span>CSS</span>
  <span>Every Layout</span>
  <span>CUBE</span>
  <span>Responsive Design</span>
</div>
```

### 5. CUBE Block and Exception
A `Block` provides minimal, context-specific styles for a component. An `Exception` uses a `data-state` attribute to apply a variation, often triggered by JavaScript.

```css
/* A simple 'card' block */
.card {
  border: 1px solid grey;
  padding: 1rem;
}

/* An exception for a 'reversed' state */
.card[data-state='reversed'] {
  background-color: #333;
  color: white;
}
```
```html
<!-- The block in its default and exception states -->
<article class="card">This is a standard card.</article>

<article class="card" data-state="reversed">
  This is a reversed card.
</article>
```

### 6. The Frame: Enforcing Aspect Ratio
The `Frame` primitive uses the modern `aspect-ratio` property to maintain a consistent aspect ratio for images, videos, or any other element.

```css
/* A Frame layout primitive */
.frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover; /* Crops media to fit without distortion */
}
```

## How to Use This Documentation

This documentation combines two complementary systems:

*   **CUBE CSS Methodology (`cube-*.md` files):** This provides the high-level thinking and organizational structure for your CSS. Refer to these files to understand the principles of layering your styles from global to specific.
*   **Every Layout Primitives (`el-*.md` files):** This is a collection of pre-built, robust layout components. These primitives are the perfect implementation for the **Composition Layer** in CUBE CSS.

**Suggested Workflow:**
1.  Start with the **CUBE CSS** principles to structure your project.
2.  When you need to build a specific layout (e.g., a grid of cards, a media object, a page header), consult the **Every Layout** primitives.
3.  Combine primitives to create complex layouts. For example, a `Grid` of `Box` components, where each `Box` contains a `Stack`.
4.  Use CUBE's **Block** and **Exception** layers to apply the final, component-specific visual styles (colors, borders, etc.) to your composed layouts.

## Full Reference

### CUBE CSS Methodology
*   [Overview](references/cube-overview.md)
*   [Principles](references/cube-principles.md)
*   [Cascade First](references/cube-cascade-first.md)
*   [Composition](references/cube-composition.md)
*   [Utilities](references/cube-utilities.md)
*   [Blocks](references/cube-blocks.md)
*   [Exceptions](references/cube-exceptions.md)
*   [Grouping](references/cube-grouping.md)

### Every Layout Primitives & Concepts
*   [Algorithmic Design](references/el-algorithmic-design.md)
*   [Axioms](references/el-axioms.md)
*   [Box](references/el-box.md)
*   [Boxes (Box Model Concepts)](references/el-boxes.md)
*   [Center (Contained in Imposter)](references/el-imposter.md)
*   [Cluster](references/el-cluster.md)
*   [Composition](references/el-composition.md)
*   [Container (Container Queries)](references/el-container.md)
*   [Cover](references/el-cover.md)
*   [Frame](references/el-frame.md)
*   [Global Local Styling](references/el-global-local-styling.md)
*   [Grid](references/el-grid.md)
*   [Icon](references/el-icon.md)
*   [Imposter](references/el-imposter.md)
*   [Modular Scale](references/el-modular-scale.md)
*   [Reel](references/el-reel.md)
*   [Sidebar](references/el-sidebar.md)
*   [Stack](references/el-stack.md)
*   [Switcher (Contained in Axioms)](references/el-axioms.md)
*   [Units](references/el-units.md)