# Input

Collect a single line of textual or native input.

## Import

```tsx
import { Input } from "@fullsnacklab/components";
```

Export shape: **direct**.

## Verified API

- Components and helpers: `Input`.
- Exported contract types: `InputProps`.

## Composition skeleton

```text
Input
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
