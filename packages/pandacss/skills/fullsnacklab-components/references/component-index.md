# Component index

Use this cached, version-sensitive index to orient package consumption. For authoring or styling work, load `panda-styling-engine` before using this package map. Always verify names and exports against the declared dependency and exact installed package.

## Selection workflow

1. Find the user intent in the tables below.
2. Read the linked component reference and its linked cross-cutting reference.
3. Prefer an existing application wrapper when it already owns the same product contract.
4. Compose only the verified exports listed in the component reference.
5. Complete the component-specific and cross-cutting checks before returning code.

## Actions

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Button | direct | Trigger an action, submit intent, or group related actions. | [`button`](components/button.md) |
| Close Button | direct | Expose a compact, labelled close action. | [`close-button`](components/close-button.md) |
| Icon Button | direct | Trigger an action whose visible content is an icon. | [`icon-button`](components/icon-button.md) |

## Content

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Alert | family | Present an inline status, warning, success, or error message. | [`alert`](components/alert.md) |
| Avatar | family | Represent a person or entity with an image and fallback. | [`avatar`](components/avatar.md) |
| Badge | direct | Attach a compact status or category label to nearby content. | [`badge`](components/badge.md) |
| Breadcrumb | family | Show hierarchical location and provide links to ancestor pages. | [`breadcrumb`](components/breadcrumb.md) |
| Card | family | Group a bounded piece of content with optional header and footer. | [`card`](components/card.md) |
| Code | direct | Render short inline code or machine-readable text. | [`code`](components/code.md) |
| Display Value | direct | Render a value with the package's display treatment. | [`display-value`](components/display-value.md) |
| Heading | direct | Render a semantic heading with design-system typography. | [`heading`](components/heading.md) |
| Icon | direct | Apply consistent sizing and color behavior to an icon child. | [`icon`](components/icon.md) |
| Image | direct | Render an image with the package's visual treatment. | [`image`](components/image.md) |
| Kbd | direct | Represent a keyboard key or shortcut. | [`kbd`](components/kbd.md) |
| Link | direct | Navigate to another location with design-system styling. | [`link`](components/link.md) |
| Span | direct | Render inline text with design-system style props. | [`span`](components/span.md) |
| Table | family | Render structured row-and-column data semantically. | [`table`](components/table.md) |
| Text | direct | Render body or supporting text with semantic typography. | [`text`](components/text.md) |

## Layout

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Absolute Center | direct | Center content over its nearest positioned container. | [`absolute-center`](components/absolute-center.md) |
| Group | direct | Arrange related elements with shared spacing and attachment behavior. | [`group`](components/group.md) |
| Scroll Area | family | Provide a styled viewport and scrollbars for overflow content. | [`scroll-area`](components/scroll-area.md) |
| Splitter | family | Divide space into resizable panels. | [`splitter`](components/splitter.md) |

## Disclosure

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Accordion | family | Show sections that expand and collapse independently or as a group. | [`accordion`](components/accordion.md) |
| Collapsible | family | Reveal or hide one region from a single trigger. | [`collapsible`](components/collapsible.md) |

## Forms

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Checkbox | family | Toggle one boolean choice or a set of independent choices. | [`checkbox`](components/checkbox.md) |
| Color Picker | family | Select, inspect, and edit a color value. | [`color-picker`](components/color-picker.md) |
| Combobox | family | Filter and choose from a collection with text input. | [`combobox`](components/combobox.md) |
| Date Picker | family | Choose a date or date range from calendar views. | [`date-picker`](components/date-picker.md) |
| Editable | family | Switch between a read-only preview and inline editing. | [`editable`](components/editable.md) |
| Field | family | Connect one control to its label, help, requirement, and error text. | [`field`](components/field.md) |
| Fieldset | family | Group related controls under one legend and shared messages. | [`fieldset`](components/fieldset.md) |
| File Upload | family | Select, drop, preview, list, and remove files. | [`file-upload`](components/file-upload.md) |
| Input Addon | direct | Attach contextual text or actions beside an input. | [`input-addon`](components/input-addon.md) |
| Input Group | direct | Compose an input with leading or trailing elements. | [`input-group`](components/input-group.md) |
| Input | direct | Collect a single line of textual or native input. | [`input`](components/input.md) |
| Number Input | family | Edit a numeric value with typed input and step controls. | [`number-input`](components/number-input.md) |
| Pin Input | family | Collect a fixed sequence of short characters or digits. | [`pin-input`](components/pin-input.md) |
| Radio Card Group | family | Choose one option from visually rich card choices. | [`radio-card-group`](components/radio-card-group.md) |
| Radio Group | family | Choose exactly one option from a labelled set. | [`radio-group`](components/radio-group.md) |
| Rating Group | family | Choose or display a rating across repeated items. | [`rating-group`](components/rating-group.md) |
| Segment Group | family | Choose one segment from a compact set of peers. | [`segment-group`](components/segment-group.md) |
| Select | family | Choose one or more values from a disclosed list. | [`select`](components/select.md) |
| Slider | family | Choose one or more numeric values along a track. | [`slider`](components/slider.md) |
| Switch | family | Toggle one immediate setting on or off. | [`switch`](components/switch.md) |
| Tags Input | family | Create, edit, and remove a list of text values. | [`tags-input`](components/tags-input.md) |
| Textarea | direct | Collect multi-line text. | [`textarea`](components/textarea.md) |
| Toggle Group | family | Select one or more compact toggle actions from a set. | [`toggle-group`](components/toggle-group.md) |

## Navigation

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Carousel | family | Navigate a finite collection of slides or panels. | [`carousel`](components/carousel.md) |
| Pagination | family | Move through pages of a larger result set. | [`pagination`](components/pagination.md) |
| Tabs | family | Switch among peer panels without leaving the page. | [`tabs`](components/tabs.md) |

## Overlays

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Dialog | family | Request focused input or confirmation in a modal surface. | [`dialog`](components/dialog.md) |
| Drawer | family | Present focused content from an edge-aligned modal surface. | [`drawer`](components/drawer.md) |
| Hover Card | family | Reveal supporting content while a trigger is hovered or focused. | [`hover-card`](components/hover-card.md) |
| Menu | family | Present a temporary list of actions, choices, or nested actions. | [`menu`](components/menu.md) |
| Popover | family | Reveal interactive supporting content anchored to a trigger. | [`popover`](components/popover.md) |
| Tooltip | direct | Provide a short accessible description for a trigger. | [`tooltip`](components/tooltip.md) |

## Feedback

| Component | Shape | Use | Reference |
| --- | --- | --- | --- |
| Clipboard | family | Display copyable text and provide copy-state feedback. | [`clipboard`](components/clipboard.md) |
| Loader | direct | Pair a spinner with loading text and placement behavior. | [`loader`](components/loader.md) |
| Progress | family | Communicate determinate or indeterminate task progress. | [`progress`](components/progress.md) |
| Skeleton | direct | Reserve layout while content is loading. | [`skeleton`](components/skeleton.md) |
| Spinner | direct | Show compact indeterminate activity. | [`spinner`](components/spinner.md) |
| Toast | direct | Announce transient application feedback. | [`toast`](components/toast.md) |

## Package-wide references

- [`components.md`](components.md) — how to read direct exports, families, contract types, and version drift.
- [`composition.md`](composition.md) — family structure, part ownership, wrappers, and escape hatches.
- [`forms-and-selection.md`](forms-and-selection.md) — labels, values, hidden controls, collections, validation, and submission.
- [`overlays.md`](overlays.md) — triggers, positioning, modal behavior, dismissal, and focus.
- [`feedback.md`](feedback.md) — progress, loading, transient feedback, and copy state.
- [`layout-and-content.md`](layout-and-content.md) — semantic content and layout helpers.
- [`accessibility.md`](accessibility.md) — accessible names, focus, keyboard, state, and announcements.
- [`wrapper-design.md`](wrapper-design.md) — choosing direct usage or application-level composition.
- [`server-client.md`](server-client.md) — interactive boundaries, hydration, and providers.
- [`package-integration.md`](package-integration.md) — dependencies, stylesheet placement, and verification.
- [`design-system.md`](design-system.md) — preset, plugin, colors, tokens, recipes, and ownership.
- [`testing.md`](testing.md) — executable checks for direct components, families, forms, overlays, and hydration.
- [`troubleshooting.md`](troubleshooting.md) — import, style, state, focus, form, hydration, and update failures.
