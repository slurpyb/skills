# The Imposter

Absolute or fixed positioning with transform-based centering, constrained by max dimensions and overflow auto.

## Core Concept

Positioning removes elements from normal document flow. The Imposter provides a general-purpose superimposition element, centrally positioned over the viewport, document, or a selected positioning container.

## Positioning Contexts

1. **Viewport**: `position: fixed`
2. **Document**: `position: absolute`
3. **Ancestor element**: `position: absolute` on the Imposter, `position: relative` on the ancestor (the "positioning container")

The `static` position value is the default and does not create a positioning context.

## Centering with Transform

Position the top-left corner at 50%/50%, then translate back by half the element's own dimensions:

```css
.imposter {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}
```

The `transform` property uses the element's own dimensions for calculation, so no hard-coded width or height is needed. The element "shrink wraps" its content when absolutely positioned.

## Overflow Containment

Prevent the Imposter from exceeding its positioning container with `max-inline-size` and `max-block-size`:

```css
.imposter {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  max-inline-size: 100%;
  max-block-size: 100%;
}
```

## Margin / Gap from Edges

Use `calc()` to create a minimum gap between the Imposter and its container edges:

```css
.imposter {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  max-inline-size: calc(100% - 2rem);
  max-block-size: calc(100% - 2rem);
}
```

This creates a `1rem` gap on all sides (2rem total, 1rem per end).

## Fixed Positioning

Use a custom property to switch between absolute and fixed:

```css
.imposter {
  position: var(--positioning, absolute);
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
  max-inline-size: calc(100% - 2rem);
  max-block-size: calc(100% - 2rem);
}
```

Override inline for fixed positioning (useful for dialogs that follow scroll):

```html
<div class="imposter" style="--positioning: fixed">
  <!-- content -->
</div>
```

## Generator CSS

```css
.imposter {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}

.imposter.contain {
  --margin: 0px;
  overflow: auto;
  max-inline-size: calc(100% - (var(--margin) * 2));
  max-block-size: calc(100% - (var(--margin) * 2));
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| breakout | `boolean` | `false` | Allow breaking out of positioning container |
| margin | `string` | `0` | Minimum space between element and container edges |
| fixed | `boolean` | `false` | Position relative to viewport instead of container |

## Examples

Overlay on content:

```html
<div style="position: relative">
  <p aria-hidden="true"><!-- obscured content --></p>
  <imposter-l>
    <box-l>
      <p><strong>You can't see all the content, because of this box.</strong></p>
    </box-l>
  </imposter-l>
</div>
```

Dialog:

```html
<imposter-l fixed>
  <dialog aria-labelledby="message">
    <p id="message">It's decision time, sunshine!</p>
    <button type="button">Yes</button>
    <button type="button">No</button>
  </dialog>
</imposter-l>
```

## Use Cases

Dialogs, popups, custom dropdown menus, content overlays, call-to-action overlays on locked content. Use `aria-hidden="true"` on obscured sibling content when appropriate. See Inclusive Components for dialog accessibility considerations.
