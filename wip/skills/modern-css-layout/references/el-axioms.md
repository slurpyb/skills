# Axioms

Foundational design axioms that pervade the system, using typographic measure as the primary example and an exception-based approach to CSS.

## What Are Axioms

Like Euclid's geometric postulates, design axioms are simple irreducible rules that produce consistent output system-wide. Without them, your design will be inconsistent and malformed.

## The Measure Axiom

*"The measure should never exceed 60ch."*

Measure is the width of a line of text in characters. The Elements of Typographic Style considers 45-75 characters reasonable. This axiom should pervade the design without exception.

### Why Not Fixed Widths

Setting a fixed `px` width for measure breaks zoom and creates horizontal scrolling. The `ch` unit is character-relative and adapts to `font-size` changes:

```css
:root {
  --measure: 60ch;
}
```

`1ch` is based on the width of the font's `0` character. Changing `font-size` changes the value of `1ch`, adapting the measure algorithmically.

### Exception-Based Approach

Apply the constraint universally, then remove it from elements that should not be constrained:

```css
* {
  max-inline-size: var(--measure);
}

html, body, div, header, nav, main, footer {
  max-inline-size: none;
}
```

This is smarter than listing every element that *should* be constrained. Inline elements are included but cause no ill effects since they are equal or narrower than their parents.

Exception-based CSS does *most* styling with the *least* code. Per ITCSS (Inverted Triangle CSS): specificity is inversely proportional to reach.

### Utility Classes

```css
.max-inline-size\:measure {
  max-inline-size: var(--measure);
}

.max-inline-size\:measure\/2 {
  max-inline-size: calc(var(--measure) / 2);
}
```

### Three Tiers of Application

1. **Universal styles** -- seed the axiom as broadly as possible
2. **Layout primitives** -- accept measure-related props (e.g., the Switcher's `threshold` defaults to `var(--measure)`)
3. **Utility classes** -- for targeted overrides

## Measure in Composite Layouts

Layout primitives use `var(--measure)` as sensible defaults. The Switcher uses it as its threshold:

```css
switcher-l {
  display: flex;
  flex-wrap: wrap;
}

switcher-l > * {
  flex-basis: calc((var(--measure) - 100%) * 999);
  flex-grow: 1;
}
```

## Key Principle

Choose properties, values, and units that enable the browser to calculate the most suitable layout on your behalf. The `ch` unit for measure is one such choice: it creates a relationship between character count and element width that the browser can maintain across any font size, zoom level, or device.
