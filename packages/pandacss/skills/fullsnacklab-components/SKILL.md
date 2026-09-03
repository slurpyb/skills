---
name: fullsnacklab-components
description: Work with @fullsnacklab/components and @fullsnacklab/design-system. Use when selecting, authoring, extending, composing, wrapping, integrating, or diagnosing Full Snack Lab component families and theme contracts.
---

# Full Snack Lab component system

This skill is a local API index and working reference. Start here instead of relying on memory or searching external documentation.

The checked-in catalog is an orientation layer, not the version authority. Resolve the declared dependency from the nearest consuming `package.json`, the exact installed version from `node_modules/@fullsnacklab/components/package.json`, and any local workspace source before relying on a cached contract.

## Required workflow

### Author, extend, or restyle

Load `panda-styling-engine` before Panda styling research and follow its SURVEY → CLASSIFY → ROUTE → APPLY → VERIFY workflow. If the extension is not registered in the session, read `~/.agents/extensions/pandacss/skills/panda-styling-engine/SKILL.md` and only the references selected by its routing table.

This skill owns the Full Snack Lab integration only: after the Panda SURVEY, resolve the declared and installed package contracts, use this catalog to find the existing façade, and apply the composition, wrapper, ownership, accessibility, and testing references below. The branch is complete when the selected package surface and every changed public contract have current evidence.

### Select, compose, or diagnose an existing package component

1. **Open the index.** Read [`references/component-index.md`](references/component-index.md) and choose the component by user intent. The step is complete when one component or one deliberate composition owns the interaction.
2. **Read the component reference.** Open the linked file under `references/components/`. It contains the current import shape, verified exports, contract types, composition skeleton, defaults, and checks. Compare it with installed declarations whenever versions or exports differ. The step is complete when every name in the planned JSX is verified against the installed contract.
3. **Read the linked cross-cutting reference.** Apply the rules for forms, overlays, feedback, content, composition, or accessibility. The step is complete when state ownership, semantics, focus, and integration boundaries are explicit.
4. **Choose direct use or a wrapper.** Read [`references/wrapper-design.md`](references/wrapper-design.md). Reuse an existing application wrapper when it already expresses the product contract. Add a wrapper only when it removes repeated product decisions rather than merely renaming package exports.
5. **Implement from the verified contract.** Import from `@fullsnacklab/components` or `@fullsnacklab/design-system`; preserve package part hierarchy and exported prop types. Keep feature data and business state in the application.
6. **Verify the whole path.** Apply [`references/testing.md`](references/testing.md) and [`references/accessibility.md`](references/accessibility.md). Run the narrowest type, lint, and behavior checks and exercise the changed interaction.

## Fast routes

| Task | Read |
| --- | --- |
| Author, extend, or restyle a component | `panda-styling-engine`, then this package catalog |
| Find a component | [`component-index.md`](references/component-index.md) |
| Compose a component family | [`composition.md`](references/composition.md) |
| Build fields or selection controls | [`forms-and-selection.md`](references/forms-and-selection.md) |
| Build modal or anchored surfaces | [`overlays.md`](references/overlays.md) |
| Handle loading, progress, or transient messages | [`feedback.md`](references/feedback.md) |
| Choose semantic content or layout helpers | [`layout-and-content.md`](references/layout-and-content.md) |
| Create an application wrapper | [`wrapper-design.md`](references/wrapper-design.md) |
| Cross server and client boundaries | [`server-client.md`](references/server-client.md) |
| Integrate packages and shared CSS | [`package-integration.md`](references/package-integration.md) |
| Change theme contracts | [`design-system.md`](references/design-system.md) |
| Diagnose unexpected behavior | [`troubleshooting.md`](references/troubleshooting.md) |

## Package ownership

- `@fullsnacklab/components` owns reusable React components, component-family structure, interaction defaults, and compiled component styles.
- `@fullsnacklab/design-system` owns shared theme primitives, preset and plugin entry points, colors, tokens, recipes, and reusable semantic styling contracts.
- Application wrappers own product vocabulary, data mapping, copy, feature defaults, and repeated application composition.
- Feature code owns business state, requests, permissions, and operation results.

## Non-negotiable completion criteria

- Every imported component, helper, part, and prop type appears in the local component reference or current installed declarations.
- Component families retain the documented root, control, content, hidden-control, and positioning relationships.
- One layer owns each piece of state; wrappers do not mirror package state without a product reason.
- Labels, descriptions, errors, focus, keyboard behavior, and announcements remain intact.
- Shared styles and providers are integrated once at the established application boundary.
- The changed behavior passes the nearest executable check.
