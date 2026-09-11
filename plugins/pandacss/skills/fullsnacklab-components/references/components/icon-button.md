# Icon Button

Trigger an action whose visible content is an icon.

## Import

```tsx
import { IconButton } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `IconButton`.
- Exported contract types: `IconButtonProps`.

## Composition skeleton

```text
IconButton
```

## Contract

Keep the native action type explicit in forms. Forward disabled and loading behavior, references, and accessible names. An icon-only action needs a text alternative.

- The icon is not a sufficient accessible name. Provide a text alternative on every use.

## Accessibility check

Provide an accessible name, visible focus, correct native action type, and a disabled state that matches actual behavior.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`accessibility.md`](../accessibility.md).
