# Toast

Announce transient application feedback.

## Import

```tsx
import { Toaster, toaster } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `toaster`, `Toaster`.
- Exported contract types: `none`.

## Composition skeleton

```text
Toaster (mount once)
toaster (operation helper)
```

## Contract

Expose status through visible text and an appropriate live announcement. Keep pending, success, and failure state owned by the operation that produces it.

- Mount one Toaster at the application boundary.
- Call toaster from operation edges; messages should state the result and any recovery action.

## Accessibility check

Verify status text is perceivable without relying on color or motion and that repeated updates do not create noisy announcements.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`feedback.md`](../feedback.md).
