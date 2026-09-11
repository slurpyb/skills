# Application wrapper design

Use a wrapper to encode repeated product decisions around `@fullsnacklab/components`. Keep direct package usage when no repeated product contract exists.

## Decision test

Create a wrapper when at least one is true:

- the same family structure repeats in multiple features;
- product data must be mapped into repeated package items;
- required labels, descriptions, actions, or empty states should be consistent;
- the application needs one named pattern such as a confirmation dialog or account menu;
- style props and `className` need one established merge boundary;
- the application must expose a smaller safe subset while preserving advanced escape hatches.

Use the package directly when the wrapper would only rename one component or pass every prop through unchanged.

## Ownership

A wrapper may own:

- default family structure;
- product-oriented prop names;
- mapping from data objects to package items;
- application copy defaults;
- repeated accessibility relationships;
- a consistent slot for actions, help, errors, or empty content.

A wrapper should not own:

- request state or permissions unrelated to presentation;
- a mirrored copy of package state;
- recreated package event types;
- a local substitute for shared theme primitives;
- component parts that the package already exports.

## Prop design

Start with the package root contract, then replace only fields the wrapper truly owns.

```tsx
type Item = {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
};

type ProductTabsProps = Omit<Tabs.RootProps, "children"> & {
  items: readonly Item[];
};
```

Prefer data props for repeated product structures and ordinary `ReactNode` slots for content whose structure remains feature-owned.

Forward:

- controlled and uncontrolled root state;
- package callbacks and detail types;
- refs where consumers need focus or measurement;
- `className` and supported style props at the intended root;
- native attributes not replaced by product props.

## Composition

Build the package hierarchy directly inside the wrapper. Keep stable item identity and pass one data model through root configuration, rendered items, and event handling.

If advanced consumers need custom composition, export the package namespace under a clear `Parts` name. The ordinary wrapper remains the recommended product path.

## Naming

Name wrappers after product meaning, not their underlying mechanism:

- `FrequentlyAskedQuestions` communicates content and use.
- `DeleteAccountDialog` communicates consequence and task.
- `PlanSelector` communicates the domain choice.

Generic package-level names belong to `@fullsnacklab/components`.

## Completion check

- The wrapper removes repeated product decisions.
- Package types remain visible rather than recreated.
- Root state and callbacks remain available when needed.
- Data identity is stable.
- Advanced composition has an intentional escape hatch.
- A direct-use alternative was considered and rejected for a concrete reason.
