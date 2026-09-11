# Progress

Communicate determinate or indeterminate task progress.

## Import

```tsx
import { Progress } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Circle`, `CircleRange`, `CircleTrack`, `Label`, `Range`, `Track`, `ValueText`, `View`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Progress.Root
Progress.Label + ValueText
Progress.Track + Range
Progress.Circle + CircleTrack + CircleRange (alternative)
```

## Contract

Expose status through visible text and an appropriate live announcement. Keep pending, success, and failure state owned by the operation that produces it.

- Provide a visible label and value text for determinate work.
- Do not fabricate percentages when the operation cannot report progress.

## Accessibility check

Verify status text is perceivable without relying on color or motion and that repeated updates do not create noisy announcements.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`feedback.md`](../feedback.md).
