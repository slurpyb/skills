# Absolute Center

Center content over its nearest positioned container.

## Import

```tsx
import { AbsoluteCenter } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `AbsoluteCenter`.
- Exported contract types: `AbsoluteCenterProps`.

## Composition skeleton

```text
AbsoluteCenter
```

## Contract

Forward native element props and style props. Keep layout ownership at the nearest shared wrapper rather than spreading one-off positioning rules through feature code.

## Accessibility check

Confirm the layout helper does not change reading order or hide focusable descendants.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
