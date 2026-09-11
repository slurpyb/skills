# Icon

Apply consistent sizing and color behavior to an icon child.

## Import

```tsx
import { Icon } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Icon`.
- Exported contract types: `IconProps`.

Source defaults:

- Icon renders its child as the styled element by default.

## Composition skeleton

```text
Icon
```

## Contract

Choose the semantic element first, then apply the visual component. Forward native attributes, references, and accessible labels instead of flattening the component into decorative markup.

- Pass one icon element as the child. Keep decorative icons hidden and name the owning control instead.

## Accessibility check

Use the semantic element that matches the content. Decorative icons and images need the correct hidden treatment; meaningful media needs text alternatives.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
