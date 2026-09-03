# React Component API

Load when designing a React component that will expose a Panda recipe as a stable public API.

## Design sequence

1. Name the anatomy before code. Use the same camel-case names for behavior parts, slot-recipe slots, style-context keys, and qualified exports.
2. Decide whether `Root` renders a structural DOM element or only provides state for portaled parts.
3. Select the styling architecture: one-part recipe, fixed-structure slot recipe, or compound slot recipe with style context.
4. Define behavior props, visual variants, DOM hooks, ref behavior, and exports as separate contracts.

Write one governing sentence that identifies what the component owns and what callers compose; use it to resolve close API decisions.

## Behavior contract

Preserve the underlying behavior primitive's native semantics, accessibility props, controlled/default/change triads, callback payloads, IDs, and state attributes. A wrapper extends that contract while retaining its established names.

Expose independent state as independent triads such as `value` / `defaultValue` / `onValueChange`. Fire change callbacks only for real changes and keep one callback payload convention across the component family.

## Styling contract

Recipe variants are closed visual decisions such as `variant`, `size`, `orientation`, and `shape`. Behavioral state remains in the behavior primitive and reaches recipes through surveyed Panda conditions and data attributes.

Place shared variants on `Root`. Slot parts receive the resolved classes, not duplicate variant props. Keep recipe prop names unchanged so Panda can extract their values.

## DOM and composition contract

- Render boolean data attributes by presence and enumerated attributes with stable values.
- Consume measured custom properties emitted by the behavior primitive inside the recipe.
- Choose one polymorphism mechanism and preserve the primitive's existing `asChild` or render contract.
- Follow the package's React peer range: use its `forwardRef` convention while React 18 is supported; accept `ref` as a prop in React 19-only packages.
- Add ID overrides, root-provider splits, or imperative handles only for a documented composition requirement.

Export qualified parts individually and as a namespace when the package supports compound APIs. Set readable display names for generated wrappers.

## Verification

Test native semantics, keyboard and focus behavior, controlled and uncontrolled modes, ref delivery, every recipe variant, state attributes, class merging, and server rendering.

Next: choose [react-standard-recipe.md](./react-standard-recipe.md), [react-slot-component.md](./react-slot-component.md), or [react-style-context.md](./react-style-context.md).
