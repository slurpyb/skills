# Avatar

Represent a person or entity with an image and fallback.

## Import

```tsx
import { Avatar } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `Image`, `Fallback`, `Context`.
- Exported contract types: `RootProps`, `FallbackProps`.

Source defaults:

- Image disables dragging and uses a no-referrer policy by default.

## Composition skeleton

```text
Avatar.Root
Avatar.Image
Avatar.Fallback
```

## Contract

Choose the semantic element first, then apply the visual component. Forward native attributes, references, and accessible labels instead of flattening the component into decorative markup.

## Accessibility check

Use the semantic element that matches the content. Decorative icons and images need the correct hidden treatment; meaningful media needs text alternatives.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
