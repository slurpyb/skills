# Modular Scale

Ratio-based spacing and sizing using CSS custom properties, where a single ratio value extrapolates consistent, harmonious values throughout the design.

## Musical Harmony as Model

A plucked guitar string produces a composition of frequencies (harmonics) that sound harmonious because of their regularity. Visual layout should aim for the same cohesion.

## Deriving the Scale

Treat `line-height` as a basis. With `font-size: 1rem` and `line-height: 1.5`, the default value is `1.5rem`. Rather than adding 1.5 at each step (large intervals), multiply by 1.5 for smaller, regular increments:

```js
1 * 1.5;           // 1.5
1.5 * 1.5;         // 2.25
1.5 * 1.5 * 1.5;   // 3.375
```

## CSS Custom Properties

Define the scale using `calc()`, multiplying and dividing by the ratio. Each point references the previous:

```css
:root {
  --ratio: 1.5;
  --s-5: calc(var(--s-4) / var(--ratio));
  --s-4: calc(var(--s-3) / var(--ratio));
  --s-3: calc(var(--s-2) / var(--ratio));
  --s-2: calc(var(--s-1) / var(--ratio));
  --s-1: calc(var(--s0) / var(--ratio));
  --s0: 1rem;
  --s1: calc(var(--s0) * var(--ratio));
  --s2: calc(var(--s1) * var(--ratio));
  --s3: calc(var(--s2) * var(--ratio));
  --s4: calc(var(--s3) * var(--ratio));
  --s5: calc(var(--s4) * var(--ratio));
}
```

## JavaScript Access

Custom properties on `:root` are globally available to JavaScript and pierce Shadow DOM boundaries:

```js
const rootStyles = getComputedStyle(document.documentElement);
const scale3 = rootStyles.getPropertyValue('--s3');
```

## Shadow DOM Support

Global custom properties work inside Shadow DOM:

```js
this.shadowRoot.innerHTML = `
  <style>
    :host {
      padding: var(--s3);
    }
  </style>
  <slot></slot>
`;
```

## Passing via Props

Custom elements can consume scale values as prop strings:

```html
<my-element padding="var(--s3)">
  <!-- content -->
</my-element>
```

Interpolated into the component's CSS:

```js
get padding() {
  return this.getAttribute('padding') || 'var(--s1)';
}

set padding(val) {
  return this.setAttribute('padding', val);
}
```

## Enforcing the Scale

To enforce only scale values, accept integers and interpolate them:

```js
if (!/(?<!\S)\d(?!\S)/.test(this.padding)) {
  console.error('padding value should be a number on the modular scale');
  return;
}
```

## Key Principle

The specific ratio matters less than strict adherence to *whichever* ratio you choose. `1.5`, the golden ratio (`1.61803398875`), or any other -- harmony comes from consistency. A single number, used as multiplier and divisor, seeds the entire visual design.
