# Composition

Favor composition over inheritance for layout. Combine simple, independent layout primitives to create complex interfaces, like letters forming words.

## The Problem with Namespacing

Dedicating CSS to specific components (`.dialog`, `.dialog__header`, etc.) duplicates styles that could be shared. The inheritance mindset names things before deciding what smaller parts can do for them.

```css
/* Namespaced -- styles are isolated and duplicated */
.dialog { /* ... */ }
.dialog__header { /* ... */ }
.dialog__body { /* ... */ }
.dialog__foot { /* ... */ }
```

## Layout Primitives

Primitives are simple, nonlexical components without inherent meaning. They gain meaning through composition. In JavaScript, `true` is a primitive -- it tells you nothing about the application. An object is not primitive -- it reflects the author's intent.

Each primitive has a simple responsibility:

- "space elements vertically" (Stack)
- "pad elements evenly" (Box)
- "separate elements horizontally" (Cluster)

They are designed as parents, children, or siblings of one another.

## Composition in Practice

A dialog box is composed of primitives:

- **Box** for padding and borders
- **Stack** for vertical spacing between sections
- **Cluster** for button groups
- **Center** for horizontal centering

The same primitives compose a registration form or a conference slide layout. Different combinations, same building blocks.

## Why This Matters

Without primitives, every component follows its own layout rules, creating inefficiencies and inconsistencies. A design system that leverages primitives produces consistent layouts with minimal, reusable code.

The English alphabet is only 26 bytes, and think of all the great works created with that.
