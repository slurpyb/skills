# The Icon

Inline SVG icons sized with em/cap units, using `currentColor` for automatic color matching, with `inline-flex` baseline alignment and logical margin.

## Sizing with em and cap

Icons should match uppercase letter height. `0.75em` approximates this across common fonts. The emerging `cap` unit provides an exact match:

```css
.icon {
  height: 0.75em;
  height: 1cap;
  width: 0.75em;
  width: 1cap;
}
```

The second declaration overrides the first where `cap` is supported. Because sizing uses `em`, icons scale automatically with `font-size` changes.

## SVG Icons with currentColor

Inline SVGs adopt the surrounding text's color via `currentColor`:

```html
<svg viewBox="0 0 10 10" width="0.75em" height="0.75em"
     stroke="currentColor" stroke-width="2">
  <path d="M1,1 9,9 M9,1 1,9" />
</svg>
```

Set `width` and `height` as SVG attributes (not just CSS) so icons remain small if CSS fails to load.

## Vertical Alignment

Icons sit on the text baseline by default. `vertical-align: middle` aligns to the middle of *lowercase* letters, which is usually wrong. For taller icons, use a length value for `vertical-align` instead.

## Spacing: Word Space (Simple)

A literal space character between the SVG and text node creates natural word spacing. This space collapses when the icon is alone, and respects `dir="rtl"` for right-to-left layouts:

```html
<button>
  <svg class="icon">...</svg> Close
</button>
```

Swap icon to the right with `dir="rtl"`:

```html
<button dir="rtl">
  <svg class="icon">...</svg> Close
</button>
```

## Spacing: Custom Margin (Flexible)

For precise control, use `inline-flex` to eliminate word space, then add `margin-inline-end`:

```css
.icon {
  height: 0.75em;
  height: 1cap;
  width: 0.75em;
  width: 1cap;
}

.with-icon {
  display: inline-flex;
  align-items: baseline;
}

.with-icon .icon {
  margin-inline-end: var(--space, 0.5em);
}
```

`margin-inline-end` applies margin *after* the icon in the text direction. It works correctly in both LTR and RTL contexts. The tradeoff: the margin remains even when no text is present.

## Accessibility

When no visible text accompanies the icon, provide a label:

1. Visually hide a text `<span>`
2. Add `<title>` to the `<svg>`
3. Add `aria-label` to the parent `<button>`

The component's `label` prop applies `role="img"` and `aria-label` to the icon element.

## Generator CSS

```css
.icon {
  width: 0.75em;
  width: 1cap;
  height: 0.75em;
  height: 1cap;
}

.with-icon {
  display: inline-flex;
  align-items: baseline;
}

.with-icon .icon {
  margin-inline-end: 1rem;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| space | `string` | `null` | Space between icon and text. If null, natural word spacing is used |
| label | `string` | `null` | Adds `role="img"` and `aria-label` for accessibility |

## Examples

Button with icon and text:

```html
<button>
  <icon-l space="0.5em">
    <svg><use href="/icons.svg#cross"></use></svg>
    Close
  </icon-l>
</button>
```

Button with icon only (labeled):

```html
<button>
  <icon-l label="Close">
    <svg><use href="/icons.svg#cross"></use></svg>
  </icon-l>
</button>
```

## Use Cases

Buttons with icons, links with visual cues, icon-only controls (with accessible labels). Highly familiar icons (close/X) may stand alone; esoteric icons should include visible text.
