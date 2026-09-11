# Component reference model

The component catalog under [`components/`](components/) is a version-sensitive working API map for `@fullsnacklab/components`. Use [`component-index.md`](component-index.md) to select a component, then verify its dedicated file against the declared dependency and exact installed declarations before writing JSX.

## Reference anatomy

Every component file contains:

- **Import** — the package-root import that consumers should use.
- **Export shape** — `direct` for a standalone component or `family` for a namespace of coordinated parts.
- **Verified API** — component, helper, and exported contract names taken from the package source.
- **Source defaults** — package behavior supplied when the consumer does not override it.
- **Composition skeleton** — the safe structural order for the common case.
- **Contract** — state and ownership rules that should survive wrapping.
- **Accessibility check** — interaction-specific checks.

## Direct components

Direct components render one semantic element or one packaged behavior. Examples include `Button`, `Input`, `Text`, `Spinner`, and `Tooltip`.

Use a direct component when:

- one component already owns the complete behavior;
- the application needs only ordinary props and children;
- wrapping would only rename the component;
- no repeated product structure needs to be encoded.

Forward its exported prop type, native attributes, ref, and `className` where the wrapper boundary permits.

## Component families

A family is imported as one namespace and composed from its listed parts.

```tsx
import { Dialog } from "@fullsnacklab/components";
```

The namespace keeps related parts discoverable and prevents accidental mixing between families. `Root` usually owns state and context. Triggers, controls, items, content, indicators, hidden controls, and positioning parts consume that context.

Use only the parts listed in the dedicated component reference. Similar families can have different names, defaults, and ownership.

## Contract types

Prefer package types such as `RootProps`, `ItemProps`, or the direct component's named props type. Extend with `Omit` only when an application wrapper intentionally replaces a package-owned field such as `children` with a data-oriented product prop.

Keep the package contract visible:

```tsx
type ProductDialogProps = Omit<Dialog.RootProps, "children"> & {
  trigger: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
};
```

A wrapper should not recreate event detail objects, state unions, or native attributes already supplied by package types.

## Version drift

When installed versions match the versions at the top of this skill, use the local references directly. When they differ:

1. identify the exact component involved;
2. compare its installed export and declaration surface with the dedicated reference;
3. update only the affected usage;
4. keep the local reference change with the package-version update when the contract changed.
