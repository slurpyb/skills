# Popover

Reveal interactive supporting content anchored to a trigger.

## Import

```tsx
import { Popover } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Anchor`, `ArrowTip`, `Arrow`, `CloseTrigger`, `Content`, `Description`, `Indicator`, `Positioner`, `Title`, `Trigger`, `Body`, `Header`, `Footer`, `Context`.
- Exported contract types: `RootProps`.

Source defaults:

- Root and RootProvider mount lazily and remove content when closed.
- Arrow includes ArrowTip by default.

## Composition skeleton

```text
Popover.Root
Popover.Trigger
Popover.Positioner
Popover.Content
Popover.Arrow
Popover.Header
Popover.Title + Description
Popover.Body
Popover.Footer + CloseTrigger
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

- Use for supporting interactions that do not require a modal task boundary.
- Title and Description should label nontrivial content.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
