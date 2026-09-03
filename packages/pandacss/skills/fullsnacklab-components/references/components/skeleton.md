# Skeleton

Reserve layout while content is loading.

## Import

```tsx
import { Skeleton, SkeletonCircle, SkeletonText } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Skeleton`, `SkeletonCircle`, `SkeletonText`.
- Exported contract types: `SkeletonProps`, `SkeletonCircleProps`, `SkeletonTextProps`.

Source defaults:

- SkeletonCircle enables circular presentation by default.

## Composition skeleton

```text
Skeleton
SkeletonCircle
SkeletonText
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
