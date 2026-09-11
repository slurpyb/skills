# Sources

Everything in this skill comes from reading real docs and real source code end to end, not from general knowledge of these libraries. Three components were used as the comparison set, chosen for different shapes: **Dialog** (overlay/portal), **Accordion** (structural, multi-part list), **Select** (the most complex, structural plus overlay plus a collection).

## Ark UI

`chakra-ui/ark` on GitHub, docs at ark-ui.com. Read: the About/Composition/Styling guide pages, and real source (`packages/react/src/components/{dialog,accordion,select}/*`, `factory.ts`). Ark is the React binding layer on top of Zag's framework-agnostic machines, and the research here is specifically about the division of labor between them: confirmed that Ark's anatomy, props, data-attributes, and CSS variables are inherited verbatim from Zag with no renaming, while Ark itself adds only the React-idiomatic layer, compound namespacing, Context, `asChild` (explicitly credited in Ark's own source as adapted from Radix), and the Root/RootProvider split.

## Zag.js

`chakra-ui/zag` on GitHub, docs at zagjs.com. Read: the Anatomy/Machines/Styling/Building-Machines guide pages, and real source (`packages/machines/{dialog,accordion,select}/src/*.anatomy.ts`, `*.connect.ts`, `*.types.ts`, `packages/anatomy/src/create-anatomy.ts`, `packages/utilities/popper/src/*`, and the generated `packages/docs/data/{data-attr,css-vars}.json`). Anatomy here is a declared, factory-generated artifact rather than something hand-rolled per component, the same factory produces the `data-scope`/`data-part` attribute pair and the props/context/api split for every machine, and the state-machine core underneath is the same kind of state/event design this repo's `state-machine-design` skill covers.

## Radix UI

`radix-ui/primitives` on GitHub, docs at radix-ui.com/primitives. Read: the Composition guide, Dialog/Accordion/Select docs pages, and real TypeScript source (`packages/react/{dialog,accordion,select,slot}/src/*.tsx`). Source for: the `createContextScope`/scope mechanism, the Collection pattern for keyboard-navigable lists, the Slot/`asChild` implementation (`mergeProps`, `cloneElement`), exact prop lists, exact `data-*` strings, exact `--radix-*` CSS variable names.

## Base UI

`mui/base-ui` on GitHub, docs at base-ui.com. Read: the About/Composition/`useRender` guide pages (unusually explicit about API-design rationale, including a direct "Migrating from Radix UI" comparison), and real TypeScript source (`packages/react/src/{dialog,accordion,select}/*`, `internals/useRenderElement.tsx`, `*CssVars.ts`, `*DataAttributes.ts` enum files). Source for: the `render`-prop mechanism as a direct, stated alternative to `asChild`, the `nativeButton` escape hatch, the boolean-per-state data-attribute convention (`data-open`/`data-closed`) as an explicit divergence from Radix's single-enum `data-state`.

## React Aria

`adobe/react-spectrum` on GitHub, docs at react-spectrum.adobe.com/react-aria. Read: the Introduction, Styling, and Advanced Customization guide pages, and real source (`packages/react-aria-components/src/{Select,Dialog,Disclosure,Modal,Popover}.tsx`, `packages/react-aria/src/{button,dialog}/`, `packages/react-stately/src/select/useSelectState.ts`, `packages/@react-types/shared/src/{inputs,selection}.d.ts`). React Aria ships two co-equal, officially documented surfaces for every component: a hooks-only layer (`useButton`, `useDialog`, `useSelect`, returning plain prop objects to spread onto your own JSX, with state itself living in a separate `react-stately` package) and a components layer (`react-aria-components`) built on top of those same hooks plus Context. It also disambiguates same-type children by position, a `slot` string prop read out of context, rather than by giving every part its own named export, and uses `is`-prefixed boolean props (`isDisabled`, `isOpen`, `isRequired`) throughout. Worth noting as a real, not-explained-away inconsistency found directly in source: React Aria's own `Select` uses generic `value`/`defaultValue`/`onChange` naming (aligned with native `<select>`/form conventions) while its own collection components (`ListBox`, `Menu`, `Tabs`) use `selectedKey(s)`/`onSelectionChange` for the same concept, one library, two names for the same idea, a live example of the naming-consistency pitfall in [CONTROLLED-UNCONTROLLED.md](CONTROLLED-UNCONTROLLED.md).

## What's universal vs. what's contested

See [GLOSSARY.md](GLOSSARY.md#terminology-conflicts) for the full breakdown. In short: the controlled/uncontrolled prop triad is universal across every library read for this skill. The compound-structure mechanism (one named export per part, versus React Aria's generic-primitive-plus-`slot`-plus-Context approach), the callback payload shape (positional vs. details object), the polymorphism mechanism (clone-based vs. render-function-based, and React Aria layers a third, separate render-as-function-of-state mechanism for styling on top of either), the data-attribute addressing scheme (bespoke vs. scope-and-part vs. single-slot-key), and the CSS variable naming convention (fully-qualified vs. generic) are all genuinely contested, with real tradeoffs on both sides, not just naming preference. Ark and Zag land on the same answer for nearly every one of these, since Ark inherits Zag's choices directly rather than making its own.
