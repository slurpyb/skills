# Global and Local Styling

Three tiers of styling: universal/inherited styles, layout primitives, and utility classes. Leverage CSS's global nature rather than fighting it.

## Three Tiers

1. **Universal (including inherited) styles** -- broadest reach, lowest specificity
2. **Layout primitives** -- composable components for arrangement
3. **Utility classes** -- targeted overrides with highest specificity

## Global Styles

### Inherited Styles

Rules on `:root` or `<body>` inherited by (almost) all elements:

```css
:root {
  font-family: sans-serif;
}
```

### Universal Selector

Styles all elements directly:

```css
* {
  font-family: sans-serif;
}
```

### Element Selectors

Target elements globally by type. Essential for styling arbitrary content from WYSIWYG editors and markdown:

```css
p {
  font-family: sans-serif;
}
```

Liberal use of element selectors is the hallmark of a comprehensive design system.

## Utility Classes

Classes diverge from inherited/element styles globally. They are portable across any HTML element:

```css
.font-size\:base {
  font-size: var(--font-size-base) !important;
}

.font-size\:biggish {
  font-size: var(--font-size-biggish) !important;
}

.font-size\:big {
  font-size: var(--font-size-big) !important;
}
```

Naming convention emulates CSS declaration structure: `property-name:value`. The `!important` suffix ensures utilities are final adjustments that cannot be overridden.

Share values between elements and utilities with custom properties on `:root`:

```css
:root {
  --font-size-base: 1rem;
  --font-size-biggish: 1.75rem;
  --font-size-big: 2.25rem;
}

h3 { font-size: var(--font-size-biggish); }
h2 { font-size: var(--font-size-big); }
```

## ITCSS Principle

Sensible CSS architecture has *reach* (how many elements are affected) inversely proportional to *specificity* (how complex the selectors are). Formalized by Harry Roberts as Inverted Triangle CSS.

## Layout Primitives as Components

Implemented as custom elements with props for instance-specific configuration. Default styles come from an accompanying stylesheet:

```css
stack-l {
  display: block;
}

stack-l > * + * {
  margin-top: var(--s1);
}
```

Props generate embedded stylesheets. A unique *configuration* (not instance) gets one shared `<style>` element:

```html
<stack-l data-i="Stack-var(--s3)" space="var(--s3)">
  <div>...</div>
</stack-l>
```

Generates:

```css
[data-i='Stack-var(--s3)'] > * + * {
  margin-top: var(--s3);
}
```

Multiple instances sharing the same configuration reuse the same style block.

## Local Styling Options

- **`id` selectors**: High specificity, unique per document
- **Inline styles**: Maximum specificity but a maintenance nightmare
- **Shadow DOM**: Encapsulated but prevents global style inheritance

The custom element approach with props provides controlled local configuration while preserving access to global styles.
