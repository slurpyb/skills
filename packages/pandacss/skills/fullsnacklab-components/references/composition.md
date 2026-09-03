# Component-family composition

Use this reference with any `family` entry in the component index.

## Ownership ladder

A family normally has four layers:

1. **Root** owns state, context, generated identifiers, and lifecycle.
2. **Interaction parts** change state: triggers, controls, items, thumbs, and resize handles.
3. **Presentation parts** expose state: content, indicators, values, previews, and messages.
4. **Form or platform parts** preserve native behavior: hidden inputs, hidden selects, and positioned surfaces.

Keep these layers in one family. Do not pair a trigger from one namespace with content from another.

## Root and provider

Use `Root` for ordinary composition. Use `RootProvider` only when state is intentionally created outside the JSX tree and supplied through the package's context contract. A provider is not a shortcut for global state.

One root should represent one independent interaction. Nested roots are valid only when the product contains independent interactions, such as a menu inside a dialog.

## Triggers and controls

- A trigger changes disclosure or open state.
- A control groups the interactive pieces of one value.
- An item represents one member of a root-owned collection.
- An indicator reflects state; it should not become a second state owner.
- A hidden control preserves native form participation and should remain in the tree when listed by the component reference.

When a trigger accepts a child element, preserve the child's accessible name, ref, and native interaction. Do not introduce an extra anonymous interactive element around it.

## Content and positioning

Positioned families commonly separate `Positioner` from `Content`. The positioner owns placement; the content owns semantics, focusable descendants, and visible structure. Keep both when the component reference lists both.

Mounted content can be absent while closed. Code inside it must tolerate lazy mounting, cleanup, and repeated open cycles.

## Repeated items

Render items from one stable application collection. The value passed to the root, the item identity, the displayed text, and change handling should all describe the same model.

Use stable product identifiers as keys and values. Display labels are not reliable identifiers when localization or duplicate labels are possible.

## Context escape hatch

Some families export `Context` or item context helpers. Use them only when a custom child must read package-owned state that no exported presentation part exposes. Keep context reads inside the family tree and avoid copying context state into application state.

## Wrapper boundary

A wrapper may own the common part hierarchy while re-exporting the namespace as an escape hatch. The wrapper should still expose root state props and callbacks when consumers need controlled behavior.

A useful wrapper reduces choices:

```text
product data + root contract
            ↓
application wrapper
            ↓
verified package-family structure
```

A thin alias that returns only `Family.Root` adds indirection without encoding a product contract.

## Completion check

- One root owns one interaction.
- Every part belongs to the same namespace.
- Trigger, control, content, indicator, and hidden-control roles remain distinct.
- Repeated items use one stable collection and identity model.
- Mounted and unmounted content behaves correctly across repeated cycles.
