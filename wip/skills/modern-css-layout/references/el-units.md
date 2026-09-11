# Units

Why relative units (rem, em, ch, ex, vw/vh) over px, and how each unit serves accessibility and algorithmic layout.

## Why Not px

Pixels are not regular, immutable, or constant. Screen pixel geometries vary, sub-pixel rendering changes perceived resolution, and device pixel ratios mean `1px` CSS does not equal one hardware pixel.

When you set fonts using `px`, browsers fix fonts at that size, disregarding the user's browser font-size setting. More users adjust their default font size than use Edge or IE. Disregarding them is as impactful as disregarding whole browsers.

## rem -- Root-Relative

`1rem` equals one times the root font size. Paragraphs should always be `1rem` (the default). Headings are set relatively larger:

```css
h2 {
  font-size: 2.5rem;
}
```

Scaling the entire interface is trivial -- change the root and everything adjusts proportionately:

```css
@media (min-width: 960px) {
  :root {
    font-size: 125%;
  }
}
```

With `px`, you would adjust every element individually.

## em -- Context-Relative

`em` pertains to the immediate context, like a container query is to a media query. Useful for sizing things relative to their parent:

```css
h2 {
  font-size: 2.5rem;
}

h2 strong {
  font-size: 1.125em; /* 1.125 * 2.5rem */
}
```

Rule of thumb: `em` for inline elements, `rem` for block elements. SVG icons are ideal candidates for `em` sizing since they accompany text.

## ch -- Character Width

`1ch` is based on the width of the font's `0` character. Use for measure (line length) constraints:

```css
h2, h3 {
  max-inline-size: 60ch;
}
```

Different font sizes produce different pixel widths at the same `ch` value, maintaining readable line lengths algorithmically.

## ex -- X-Height

`1ex` equals the height of the font's lowercase `x`. Useful for vertical measurements relative to the text body.

## vw/vh -- Viewport Units

Viewport units scale proportionately with the viewport. Combined with `calc()`, they create smooth scaling from a minimum:

```css
:root {
  font-size: calc(1rem + 0.5vw);
}
```

`1rem` ensures the font never drops below the user's default size. This eliminates the discrete "jump" of breakpoint-based scaling.

## Key Principle

Relative units are arbitrators. Browsers translate `em`, `rem`, `ch`, and `ex` into pixels in a way that is sensitive to context and configuration. Learn to extrapolate layouts from text's intrinsic dimensions and your designs will be robust. In CSS layout terms, an error is malformed or obscured content -- data loss for human beings.
