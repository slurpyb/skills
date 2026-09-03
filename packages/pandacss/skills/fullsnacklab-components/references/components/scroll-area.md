# Scroll Area

Provide a styled viewport and scrollbars for overflow content.

## Import

```tsx
import { ScrollArea } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Content`, `Corner`, `Thumb`, `Scrollbar`, `Viewport`, `Context`.
- Exported contract types: `RootProps`, `ContentProps`.

Source defaults:

- Scrollbar renders Thumb when no children are supplied.

## Composition skeleton

```text
ScrollArea.Root
ScrollArea.Viewport
ScrollArea.Content
ScrollArea.Scrollbar + Thumb
ScrollArea.Corner
```

## Contract

Forward native element props and style props. Keep layout ownership at the nearest shared wrapper rather than spreading one-off positioning rules through feature code.

- Viewport owns scrolling; Content owns the measured content.
- Avoid nesting independent scroll regions unless the interaction requires it.

## Accessibility check

Confirm the layout helper does not change reading order or hide focusable descendants.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
