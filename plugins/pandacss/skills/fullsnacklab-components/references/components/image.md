# Image

Render an image with the package's visual treatment.

## Import

```tsx
import { Image } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Image`.
- Exported contract types: `ImageProps`.

## Composition skeleton

```text
Image
```

## Contract

Choose the semantic element first, then apply the visual component. Forward native attributes, references, and accessible labels instead of flattening the component into decorative markup.

- Use empty alternative text only for decorative images; otherwise describe the information the image contributes.

## Accessibility check

Use the semantic element that matches the content. Decorative icons and images need the correct hidden treatment; meaningful media needs text alternatives.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
