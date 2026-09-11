# Tooltip

Provide a short accessible description for a trigger.

## Import

```tsx
import { Tooltip } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Tooltip`.
- Exported contract types: `TooltipProps`.

Source defaults:

- Tooltip mounts lazily and removes content when closed.

## Composition skeleton

```text
Tooltip
```

## Contract

The root owns open state and lifecycle. Keep trigger, positioning, content, dismissal, focus return, and labelling in one composition. Mount one root per independent surface.

- Tooltip content must be short and supplementary.
- The trigger still needs an accessible name without the tooltip.

## Accessibility check

Verify trigger naming, title and description relationships, focus entry, focus containment where modal, dismissal, and focus return.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`overlays.md`](../overlays.md).
