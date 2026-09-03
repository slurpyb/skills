# Spinner

Show compact indeterminate activity.

## Import

```tsx
import { Spinner } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Spinner`.
- Exported contract types: `SpinnerProps`.

## Composition skeleton

```text
Spinner
```

## Contract

Expose status through visible text and an appropriate live announcement. Keep pending, success, and failure state owned by the operation that produces it.

## Accessibility check

Verify status text is perceivable without relying on color or motion and that repeated updates do not create noisy announcements.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`feedback.md`](../feedback.md).
