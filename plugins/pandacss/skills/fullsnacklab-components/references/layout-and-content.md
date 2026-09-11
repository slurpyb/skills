# Layout and semantic content

Use this reference for layout helpers and direct content components.

## Semantic first

Choose the element that communicates meaning, then use the package component that supports it.

- `Heading` establishes document hierarchy; levels should not be chosen for visual size alone.
- `Text` represents block or supporting prose.
- `Span` represents inline text.
- `Link` navigates; `Button` performs an action.
- `Code` represents machine-readable text.
- `Kbd` represents a key or shortcut.
- `Table` represents row-and-column relationships, not general layout.
- `Image`, `Icon`, and `Avatar` need meaning-aware alternative treatment.

## Layout ownership

- `Group` arranges related peers.
- `AbsoluteCenter` centers content over a positioned container.
- `ScrollArea` owns overflow through `Viewport`, `Content`, and scrollbar parts.
- `Splitter` owns resizable panel relationships.

Keep layout decisions at the nearest reusable composition boundary. Feature code should describe product layout; leaf content components should not accumulate page-specific positioning.

## Reading and focus order

Visual position must not contradict DOM reading order. This matters for attached input actions, responsive reordering, split panels, tables, and scroll regions.

Scrollable regions need a discoverable size constraint. Avoid nested scroll areas unless independent scrolling is required. Focused descendants must remain visible as the user navigates.

## Media

- Decorative images use empty alternative text.
- Informative images describe the information they add.
- Icon-only actions name the action on the control.
- Decorative icons are hidden from assistive output.
- Avatar fallback should identify the same entity as the image.

## Tables

Use `Caption` when surrounding content does not already name the table. Use `Header` for row or column headings and `Cell` for data. Keep each `Row` within `Head`, `Body`, or `Foot` as appropriate.

For responsive layouts, preserve table semantics unless the product truly changes to a different information structure.

## Completion check

- Semantic elements match user intent.
- Heading levels and landmarks remain coherent.
- Visual and DOM order agree.
- Overflow and resize behavior preserve keyboard visibility.
- Media alternatives reflect meaning.
- Tables retain real row-and-column relationships.
