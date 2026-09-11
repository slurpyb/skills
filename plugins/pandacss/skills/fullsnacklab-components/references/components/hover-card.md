# Hover Card

Reveal supporting content while a trigger is hovered or focused.

## Import

```tsx
import { HoverCard } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Arrow`, `ArrowTip`, `Content`, `Positioner`, `Trigger`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
HoverCard.Root
HoverCard.Trigger
HoverCard.Positioner
HoverCard.Content
HoverCard.Arrow + ArrowTip
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

- Supporting information must remain nonessential; content required to complete a task belongs in an always-available surface.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
