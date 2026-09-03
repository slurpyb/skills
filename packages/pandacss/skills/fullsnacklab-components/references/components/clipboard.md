# Clipboard

Display copyable text and provide copy-state feedback.

## Import

```tsx
import { Clipboard } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Control`, `Input`, `Label`, `Trigger`, `Indicator`, `CopyText`, `Context`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Clipboard.Root
Clipboard.Label
Clipboard.Control
Clipboard.Input
Clipboard.Trigger + Indicator
```

## Contract

Expose status through visible text and an appropriate live announcement. Keep pending, success, and failure state owned by the operation that produces it.

- Root owns the value being copied.
- Indicator switches between copied and idle content; keep the visible feedback near Trigger.

## Accessibility check

Verify status text is perceivable without relying on color or motion and that repeated updates do not create noisy announcements.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`feedback.md`](../feedback.md).
