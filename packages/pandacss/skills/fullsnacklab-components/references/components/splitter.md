# Splitter

Divide space into resizable panels.

## Import

```tsx
import { Splitter } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Panel`, `ResizeTrigger`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Splitter.Root
Splitter.Panel
Splitter.ResizeTrigger
Splitter.Panel
```

## Contract

Forward native element props and style props. Keep layout ownership at the nearest shared wrapper rather than spreading one-off positioning rules through feature code.

- Every ResizeTrigger belongs between the panels it resizes.
- Persist panel sizes only when the product needs restoration across sessions.

## Accessibility check

Confirm the layout helper does not change reading order or hide focusable descendants.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
