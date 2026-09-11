# Cascade-First CSS

CUBE CSS embraces the cascade and inheritance to style as much as possible at a high level, producing less CSS through progressive enhancement.

## CSS Is the Core

Where other methodologies work around CSS or avoid it, CUBE CSS embraces it. CSS is complex because knowledge lies in how it works, not just syntax. CUBE CSS leverages this instead of fighting it.

## Progressive Enhancement Approach

CUBE CSS is a progressive-enhancement methodology. When nothing but global styles make it to the browser, the page should still look great. Modern features like flexbox and grid extend the minimum viable experience without fear of lack of support.

The forgiving, progressive nature of CSS is what gives the methodology its power. Simple is almost always more effective than complex.

## Styling at a High Level

Style rules are assigned at the highest level possible:

1. Global CSS handles the majority of styling (cascade and inheritance)
2. Composition handles layout structure
3. Utilities apply design tokens
4. Blocks handle context-specific overrides
5. Exceptions handle state deviations

By the time you reach blocks, most work is already done.

## Result

- Less CSS written overall
- No polyfills or hacks needed
- Old browsers get a minimum viable experience by default
- Modern browsers get enhanced capabilities automatically
