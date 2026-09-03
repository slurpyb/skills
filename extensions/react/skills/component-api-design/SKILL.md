---
name: component-api-design
description: Use when designing or reviewing a component's public API. Naming, props, compound component structure, CSS custom properties, and data-attributes.
---

# Component API Design

A general guide to designing a component's public API, grounded in how real, widely-used component libraries actually name and structure things. Use [GLOSSARY.md](references/GLOSSARY.md)'s terms exactly. Two topics get their own dedicated guide, since they're the two most load-bearing conventions here: [CONTROLLED-UNCONTROLLED.md](references/CONTROLLED-UNCONTROLLED.md) and [CALLBACKS.md](references/CALLBACKS.md). See [SOURCES.md](references/SOURCES.md) for what all of this is grounded in.

## 1. Name the anatomy first

Write down the parts before any code: trigger, content, item, positioner. Group by shared prefix (`item`, `itemText`, `itemIndicator`) and shared suffix (`itemTrigger`, `closeTrigger`, both end in `Trigger`). Decide whether anatomy is a declared, schema-generated artifact (worth it once you have a whole library of components) or left implicit in JSX (fine for one self-contained component). See [METHODOLOGY.md](references/METHODOLOGY.md#1-name-the-component-and-its-anatomy-first).

## 2. Decide what Root renders

A structural component (an accordion, a select) renders a real DOM wrapper at Root. An overlay or portal component (a dialog) has content living elsewhere in the tree, so Root is a pure state provider with no DOM output. See [METHODOLOGY.md](references/METHODOLOGY.md#2-decide-what-root-actually-renders).

## 3. Design the compound export shape

Land on `Namespace.Part` (`Dialog.Root`, `Dialog.Trigger`). Export each part under its own qualified name too, then re-export the set under a namespace object, so both `Dialog.Trigger` and `DialogTrigger` work. See [METHODOLOGY.md](references/METHODOLOGY.md#3-design-the-compound-export-shape).

## 4. Design every stateful prop as a controlled/uncontrolled triad

`value`/`defaultValue`/`onValueChange`, every time, no exceptions. Full guide, the shape, why `defaultValue` matters, single source of truth per mode, partial control, in [CONTROLLED-UNCONTROLLED.md](references/CONTROLLED-UNCONTROLLED.md).

## 5. Design the callback payload shape

Bare positional value or a details object, decide once for the whole surface and hold it everywhere. Full guide, naming, firing rules, granularity, cancellation, async, ordering, in [CALLBACKS.md](references/CALLBACKS.md).

## 6. Pick one polymorphism mechanism

Clone-based (simple, structural-clone-only, single child) or render-function-based (state-aware, function-capable, needs an escape hatch for polymorphism under SSR). Don't mix the two. Write down the consumer contract (forward the ref, spread the props) wherever a caller will actually see it. See [METHODOLOGY.md](references/METHODOLOGY.md#6-decide-the-polymorphism-strategy-and-dont-mix-mechanisms).

## 7. Design data-attributes for every meaningful state

Decide the addressing scheme (bespoke per-component, a generic scope-and-part system, or a single component-identity key) and enum vs. boolean-per-state on purpose. Render every boolean as present-when-true, absent-when-false, never the strings `"true"`/`"false"`. See [METHODOLOGY.md](references/METHODOLOGY.md#7-design-data-attributes-for-every-meaningful-state).

## 8. Design CSS custom properties for measured values

Fully-qualified names avoid collisions when composing several components on one page. Generic shared names are DRY when many components need the same positioning primitive. See [METHODOLOGY.md](references/METHODOLOGY.md#8-design-css-custom-properties-for-anything-that-needs-a-measured-value).

## 9. If pre-styled, design a variant vocabulary

Name the axes (`variant`, `size`) and a closed set of values on each. Mirror the active variant onto the DOM as its own data-attribute. Always accept and merge a consumer `className` last. See [METHODOLOGY.md](references/METHODOLOGY.md#9-if-this-ships-pre-styled-design-a-variant-vocabulary-explicitly).

## 10. Decide escape hatches on purpose

An `ids` override prop, a Root/Provider split, an imperative handle. Each solves one specific, real problem. Don't add one before you have the concrete case. See [METHODOLOGY.md](references/METHODOLOGY.md#10-decide-the-escape-hatches-on-purpose-not-as-afterthoughts).

## 11. Write the governing philosophy down

One sentence, stated once, that resolves every close naming call the rest of this process leaves open. See [METHODOLOGY.md](references/METHODOLOGY.md#11-write-the-governing-philosophy-down-once-and-let-it-settle-every-close-call).
