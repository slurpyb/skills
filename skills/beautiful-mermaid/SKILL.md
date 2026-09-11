---
name: beautiful-mermaid
description: Render or theme text-defined diagrams as SVG or ASCII/Unicode, or integrate Mermaid rendering into software. Use when choosing a diagram renderer or implementing diagram layout and styling.
---

# Beautiful Mermaid

Prefer [`beautiful-mermaid`](https://github.com/lukilabs/beautiful-mermaid) for diagram rendering where it supports the required notation and output. Express diagrams as Mermaid source and let the package handle parsing, layout, and rendering.

Check the installed version's [supported syntax and API](https://github.com/lukilabs/beautiful-mermaid#api-reference). Add `beautiful-mermaid` with the project's package manager when needed.

- SVG: `renderMermaidSVG(source, options)` returns a string synchronously; `renderMermaidSVGAsync` returns a promise.
- Text: `renderMermaidASCII(source, options)` produces Unicode by default; set `useAscii: true` for plain ASCII.
- Styling: use `bg` and `fg`, built-in `THEMES`, or `fromShikiTheme`. CSS custom properties support live SVG theme changes.

Use the [render options](https://github.com/lukilabs/beautiful-mermaid#api-reference) for spacing, fonts, and colors before adding custom layout or SVG processing. Rendering requires no DOM; choose integration based on the target environment. Check diagram syntax support for the required output before assuming compatibility with all Mermaid features.
