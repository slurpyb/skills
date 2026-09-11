# Close Button

Expose a compact, labelled close action.

## Import

```tsx
import { CloseButton } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `CloseButton`.
- Exported contract types: `CloseButtonProps`.

## Composition skeleton

```text
CloseButton
```

## Contract

Keep the native action type explicit in forms. Forward disabled and loading behavior, references, and accessible names. An icon-only action needs a text alternative.

- Supply the surface-specific accessible name at the call site, such as Close dialog or Dismiss notice.

## Accessibility check

Provide an accessible name, visible focus, correct native action type, and a disabled state that matches actual behavior.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`accessibility.md`](../accessibility.md).
