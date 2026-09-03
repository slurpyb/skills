# Drawer

Present focused content from an edge-aligned modal surface.

## Import

```tsx
import { Drawer } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Backdrop`, `Positioner`, `CloseTrigger`, `Content`, `Description`, `Title`, `Trigger`, `Body`, `Header`, `Footer`, `Context`.
- Exported contract types: `RootProps`.

Source defaults:

- Root and RootProvider mount lazily and remove content when closed.

## Composition skeleton

```text
Drawer.Root
Drawer.Trigger
Drawer.Backdrop
Drawer.Positioner
Drawer.Content
Drawer.Header
Drawer.Title + Description
Drawer.Body
Drawer.Footer + CloseTrigger
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
