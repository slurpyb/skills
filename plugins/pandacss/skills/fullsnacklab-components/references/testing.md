# Verification strategy

Verify the contract at the layer changed. Reading types or rendering static markup does not prove interaction behavior.

## Direct components

Check:

- semantic element and native attributes;
- forwarded ref and `className` when wrapped;
- disabled and loading behavior;
- accessible name;
- product variants and content states used by the feature.

## Component families

Exercise the complete interaction path:

```text
initial state
  → trigger or control
  → package state change
  → visible content or indicator
  → callback or submission
  → dismissal, reset, or next state
```

Test controlled and uncontrolled use only when both are part of the changed contract.

## Forms

Test:

- label and description relationships;
- keyboard entry and selection;
- submitted native value;
- required, invalid, disabled, and read-only states;
- error recovery without value loss;
- reset behavior;
- repeated-item identity.

## Overlays

Test:

- open by pointer and keyboard;
- initial focus;
- keyboard navigation inside content;
- Escape and explicit dismissal;
- outside interaction when supported;
- action success and failure;
- focus return;
- repeated open and close cycles.

## Feedback

Test operation ownership, visible pending text, one success or failure announcement, truthful progress, and message cleanup. Avoid tests that assert only implementation classes when the user-visible state can be asserted.

## Server and client

Render the server boundary, hydrate the client interaction, and exercise it. A client-only unit test does not catch serialization or hydration failures.

## Check order

Run from narrow to broad:

1. changed component or wrapper test;
2. related feature test;
3. package type check;
4. package lint;
5. application integration or browser test;
6. production build when exports, CSS, providers, or generation changed.

## Completion evidence

Record the exact command and observable behavior. The work is complete when the changed flow executes successfully, not merely when the source compiles.
