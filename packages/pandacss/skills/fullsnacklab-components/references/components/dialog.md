# Dialog

Request focused input or confirmation in a modal surface.

## Import

```tsx
import { Dialog } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Backdrop`, `CloseTrigger`, `Content`, `Description`, `Positioner`, `Title`, `Trigger`, `Body`, `Header`, `Footer`, `ActionTrigger`, `Context`.
- Exported contract types: `RootProps`, `ActionTriggerProps`.

## Composition skeleton

```text
Dialog.Root
Dialog.Trigger
Dialog.Backdrop
Dialog.Positioner
Dialog.Content
Dialog.Header
Dialog.Title + Description
Dialog.Body
Dialog.Footer + CloseTrigger or ActionTrigger
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

- Use ActionTrigger only for an action that should close the surface.
- Keep destructive confirmation distinct from ordinary dismissal.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
