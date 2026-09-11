# Composition Layer

The composition layer creates flexible, component-agnostic layout systems that support as many content variants as possible.

## Purpose

Composition is a high-level macro view of layout. It provides skeletal layout structure that does not interfere with the components placed inside it. Think of composition as a skeleton -- it handles how things stitch together regardless of which components are used.

The browser is hinted with flexible CSS rules rather than micro-managed with strict rules. Composition suggests layout and allows the browser to make the right judgments based on context.

## What the Composition Layer Should Do

- Provide high-level, flexible layouts
- Determine how elements interact with each other
- Create consistent flow and rhythm

## What the Composition Layer Should Not Do

- Provide visual treatment such as colour or font style
- Provide decorative styles such as shadows and patterns
- Force pixel-perfect layout instead of flexible, progressive layout

## Flow and Rhythm Pattern

The flow utility creates consistent vertical spacing between sibling elements:

```css
.flow > * + * {
  margin-top: var(--flow-space, 1em);
}
```

Applied in HTML:

```html
<article class="card">
  <img class="card__image" alt="" />
  <div class="[ card__content ] [ flow ]">
    <!-- content in here will auto-flow -->
  </div>
</article>
```

Each element within `card__content` gets a top margin of `1em` unless `--flow-space` is defined. Override contextually:

```css
.card__content {
  --flow-space: 1.4rem;
}
```

This flow system is nearly identical to the Stack layout in Every Layout.

## Macro-Level Thinking

Even when working with small reusable components, they must eventually be placed in a larger context (page or view). Composition aids this by providing skeletal layout that supports any variant of a component -- swap a card for a call-to-action and the layout still works.
