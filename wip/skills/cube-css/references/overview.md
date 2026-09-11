# CUBE CSS Overview

CUBE CSS is a CSS methodology oriented towards simplicity, pragmatism and consistency that works with the browser rather than against it.

## What CUBE CSS Stands For

CUBE = **Composition Utility Block Exception**. CSS = **Cascading Style Sheets**.

The methodology is an extension of CSS, not a reinvention. The CUBE layers extend what CSS already provides for free, adding control only where needed.

## How It Differs from BEM

BEM's core is blocks -- everything is styled inside a block. CUBE CSS's core is CSS itself. The cascade and inheritance are embraced, not avoided. By the time you reach the block layer in CUBE, blocks become much less significant because most styling has already been handled by higher layers.

CUBE CSS takes inspiration from BEM but steps back from its principles.

## The Four Layers

1. **Composition** -- High-level, flexible layout systems (skeletal structure)
2. **Utility** -- Single-purpose CSS classes, often generated from design tokens
3. **Block** -- Skeletal components with minimal, context-specific rules
4. **Exception** -- State-driven deviations from block rules, using data attributes

## Scalability

CUBE CSS scales from tiny blogs to massive websites serving millions of users. It works in both old and new codebases due to its flexibility and progressive enhancement approach.

## Key Idea

CSS does the heavy lifting. Each subsequent layer (Composition, Utility, Block, Exception) only adds what the previous layers cannot handle. This produces less CSS overall and leverages the browser's built-in capabilities.
