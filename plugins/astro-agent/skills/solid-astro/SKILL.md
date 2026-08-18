---
name: solid-astro
description: SOLID and DRY structure for an Astro `src/` tree — where files live, size limits, and typed props. Use when deciding where new code belongs, adding or splitting an `.astro` page, layout, or component, or placing a service in `src/lib/` or a type in `src/interfaces/`.
license: MIT
metadata:
  author: Fusengine
  author_url: https://github.com/fusengine
  origin: https://github.com/fusengine/agents
---

# SOLID Astro

The SOLID principles as house structure for the code that uses Astro's APIs. Follow these unless the project already does otherwise. Installing and configuring a UI framework, SolidJS among them, belongs to `astro-integrations`.

## Work the project

1. Read `src/` and the files nearest this change — the component, the service, and the interface file for the same feature. Done when you can name the directory each of those three lives in and the naming convention it follows.
2. Grep `src/` for every name you are about to write — the function, the component, the interface, and the concept behind them. Done when each name either returns no match or returns a file you have read and decided to extend.
3. Write against what you found: extend the existing helper, import the existing type. Done when the change adds no second copy of logic already in `src/lib/` and no second definition of a type already in `src/interfaces/`.

Load [dry.md](references/dry.md) for the grep patterns and the extraction thresholds.

## Where code lives

`src/pages/` routes and composes — imports, one call into `src/lib/`, and markup made of components.
`src/lib/` holds the data services: collection queries, API calls, shared helpers.
`src/components/` and `src/layouts/` turn props into markup.
`src/interfaces/` holds every exported type, one `[domain].interface.ts` per domain.

Load [architecture.md](references/architecture.md) for the full tree, import directions, and naming.

## Size

Limits by kind: pages 50 lines, components 60, layouts and services 80, interface files 50. Anything else splits at 90 and stays under 100.

A file at its limit is a file holding a second responsibility — lift that responsibility into its own component or module rather than compressing lines.

## Types and JSDoc

A component imports its props type from `src/interfaces/` and aliases it: `type Props = BlogCardProps`. Every exported function, type, and interface field carries a JSDoc block, and every value carries a concrete named type.

Load [templates.md](references/templates.md) for the canonical interface, component, and service shapes.
