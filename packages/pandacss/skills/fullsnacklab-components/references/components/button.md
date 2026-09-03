# Button

Trigger an action, submit intent, or group related actions.

## Import

```tsx
import { Button, ButtonGroup } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Button`, `ButtonGroup`.
- Exported contract types: `ButtonProps`, `ButtonGroupProps`.

## Composition skeleton

```text
Button
ButtonGroup
```

## Contract

Keep the native action type explicit in forms. Forward disabled and loading behavior, references, and accessible names. An icon-only action needs a text alternative.

- Button sets the native type to button before consumer props are applied.
- Loading disables the action, adds loading state data, and can replace children with loading text and a spinner.
- ButtonGroup shares visual variant props with descendant buttons.

## Accessibility check

Provide an accessible name, visible focus, correct native action type, and a disabled state that matches actual behavior.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`accessibility.md`](../accessibility.md).
