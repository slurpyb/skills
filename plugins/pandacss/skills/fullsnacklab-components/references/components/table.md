# Table

Render structured row-and-column data semantically.

## Import

```tsx
import { Table } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `Body`, `Caption`, `Cell`, `Foot`, `Head`, `Header`, `Row`.
- Exported contract types: `RootProps`.

## Composition skeleton

```text
Table.Root
Table.Caption
Table.Head
Table.Row
Table.Header
Table.Body
Table.Row
Table.Cell
Table.Foot
```

## Contract

Choose the semantic element first, then apply the visual component. Forward native attributes, references, and accessible labels instead of flattening the component into decorative markup.

- Use Header for column or row headings and Cell for data.
- Caption should explain the table when surrounding content does not already do so.

## Accessibility check

Use the semantic element that matches the content. Decorative icons and images need the correct hidden treatment; meaningful media needs text alternatives.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`layout-and-content.md`](../layout-and-content.md).
