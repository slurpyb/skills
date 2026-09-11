# CUBE CSS Principles

The overarching principle is simplicity -- let the right tools do their job without intervention.

## Hint the Browser, Don't Micro-Manage

The browser is hinted rather than micro-managed to do what it knows best in the context it finds itself in. Suggest layout rules and let the browser make the right judgments.

## Progressive Enhancement Is Core

Old browser? Not a problem. CUBE CSS creates a minimum viable experience by default. Modern capabilities (flexbox, grid) extend that experience using CSS's forgiving nature -- no polyfills or hacks needed. This produces much less CSS.

## Abstraction Only When Necessary

Most style rules are assigned at a high level (global CSS), supported by composition, utilities, then blocks and exceptions. The structure is flat and inclusive, making it predictable and easy to pick up.

## Tool Agnostic

Sass, Less, PostCSS, CSS-in-JS -- the methodology works with any tooling. CUBE CSS is a thinking and organisational methodology, not a tooling methodology. As long as the output is CSS, it works.

## Summary

- Simple over complex
- Browser knows best -- hint, don't dictate
- Progressive enhancement by default
- Minimal abstraction
- Any CSS toolchain works
