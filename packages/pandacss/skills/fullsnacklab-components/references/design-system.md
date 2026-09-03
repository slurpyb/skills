# Design-system package

`@fullsnacklab/design-system` owns the shared theme contract consumed by the React component package and applications. This reference covers package responsibilities and public concepts without duplicating engine-specific authoring guidance. Load `panda-styling-engine` for Panda implementation rules.

This reference is version-sensitive. Resolve the declared dependency and exact installed package before changing a consuming configuration.

## Public entry points

| Entry point | Contract |
| --- | --- |
| `@fullsnacklab/design-system` | `createPreset`, `plugin`, and `PresetOptions` |
| `@fullsnacklab/design-system/preset` | preset factory |
| `@fullsnacklab/design-system/plugin` | companion plugin |
| `@fullsnacklab/design-system/colors` | independent color exports |

`PresetOptions` is currently empty. Call `createPreset({})` unless the installed version introduces documented options.

## Preset contents

The preset assembles:

- breakpoints;
- named container sizes and names;
- custom conditions;
- global font faces;
- global styles;
- static recipe and theme output;
- animation, keyframe, layer, and text styles;
- direct recipes;
- slot recipes for component families;
- semantic tokens;
- raw tokens.

The companion plugin removes the built-in color and semantic-color sets before the Full Snack Lab color contract is applied. Preserve its established order in the consuming configuration.

## Raw token groups

- colors
- durations
- fonts
- z-index values

Use raw tokens to define the shared vocabulary. Application code should prefer semantic values when meaning is available.

## Semantic token groups

- colors
- fonts
- radii
- shadows

Semantic tokens express intent such as surface, text, border, emphasis, and state. Add a shared semantic token only when multiple consumers need the same meaning.

## Direct recipes

The package currently defines direct recipes for:

- absolute center
- badge
- button
- code
- group
- heading
- icon
- input
- input addon
- keyboard text
- link
- scroll shadow
- skeleton
- spinner
- text
- textarea

These recipes back leaf components and reusable style contracts.

## Component-family recipes

The package currently defines family recipes for:

- accordion, alert, avatar, breadcrumb, card, and carousel;
- checkbox, clipboard, collapsible, color picker, combobox, and date picker;
- dialog, drawer, editable, field, fieldset, and file upload;
- hover card, input group, menu, number input, pagination, and pin input;
- popover, progress, radio card group, radio group, rating group, and scroll area;
- segment group, select, slider, splitter, switch, table, tabs, tags input, toast, toggle group, and tooltip;
- additional shared patterns including predictive search, QR code, signature pad, sortable layouts, statistics, steps, timelines, tours, tree views, and wheel pickers.

The React package exposes the component families listed in `component-index.md`. A recipe existing here does not imply a React export exists in the installed component version.

## Style groups

The preset exposes:

- global CSS;
- text styles;
- keyframes;
- animation styles;
- layer styles.

Keep product-specific layout and brand extensions in the consuming application unless the meaning belongs across products.

## Ownership test

Change `@fullsnacklab/design-system` when the change is a reusable semantic contract or package-wide component treatment. Change the consuming project when the change expresses one application's feature, layout, copy, or brand variation.

When both layers change:

1. define the shared semantic contract;
2. generate and verify package output;
3. update `@fullsnacklab/components` when component behavior or recipe usage changes;
4. update workspace wrappers;
5. update feature consumers.

## Integration check

Before changing configuration:

1. inspect the existing preset and plugin order;
2. inspect the generated import path used by component wrappers;
3. preserve the established global style boundary;
4. run the existing generation command;
5. type-check shared wrappers;
6. exercise one affected component;
7. run the production build when output shape changed.

The change is complete when generated artifacts resolve through the established import path and consuming components use the shared semantic contract without local duplication.
