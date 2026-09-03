# Input Group

Compose an input with leading or trailing elements.

## Import

```tsx
import { InputGroup } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `InputGroup`.
- Exported contract types: `InputGroupProps`.

## Composition skeleton

```text
InputGroup
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Keep visual order and DOM order aligned, especially when controls appear before or after the input.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
