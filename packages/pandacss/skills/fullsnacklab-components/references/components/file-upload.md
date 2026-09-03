# File Upload

Select, drop, preview, list, and remove files.

## Import

```tsx
import { FileUpload } from "@fullsnacklab/components";
```

Export shape: **family**.

## Verified API

- Components and helpers: `Root`, `RootProvider`, `ClearTrigger`, `Dropzone`, `HiddenInput`, `Item`, `ItemDeleteTrigger`, `ItemGroup`, `ItemName`, `ItemPreview`, `ItemPreviewImage`, `ItemSizeText`, `Label`, `Trigger`, `Items`, `List`, `FileText`, `Context`.
- Exported contract types: `RootProps`, `ItemProps`, `FileTextProps`.

Source defaults:

- Delete and clear actions provide close icons; FileText provides a file icon.

## Composition skeleton

```text
FileUpload.Root
FileUpload.Label
FileUpload.Dropzone or Trigger
FileUpload.HiddenInput
FileUpload.List
FileUpload.ItemGroup
FileUpload.Item
FileUpload.ItemPreview + ItemName + ItemSizeText + ItemDeleteTrigger
FileUpload.ClearTrigger
```

## Contract

The root or native control owns value state. Connect labels, help, errors, and hidden form controls through the exported parts. Preserve controlled and uncontrolled usage rather than translating between them in a thin wrapper.

- Keep HiddenInput even when Trigger or Dropzone provides the visible interaction.
- Render Item from the file model supplied by Root rather than a separate application copy.

## Accessibility check

Verify label association, instructions, error announcement, disabled and required state, keyboard operation, and hidden native form participation.

## Agent completion check

- Import only names listed above.
- Preserve the composition order and ownership described here.
- Forward the exported contract type instead of recreating package props.
- Verify the relevant interaction states in the consuming application.
- Apply the cross-cutting rules in [`forms-and-selection.md`](../forms-and-selection.md).
