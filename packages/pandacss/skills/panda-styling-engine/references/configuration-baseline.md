# Configuration Baseline

Load when initializing or normalizing a Panda config, preset, or shared generated output.

## Resolve ownership first

Survey the active config and repository to identify which package owns the preset, generated styled-system, application scan roots, and emitted CSS. Preserve that ownership when applying this baseline.

## Baseline shape

Keep the resolved configuration explicit and complete:

- compose Panda's base preset, Panda's standard preset, and the project preset in low-to-high precedence order;
- register the project-owned plugin that removes Panda's default color tokens;
- include `theme: { extend: {} }`, including when the local config adds no theme values;
- enable preflight when the project preset expects the document baseline;
- include every authored framework extension in `include` globs;
- select the framework adapter that matches the consuming package.

A reusable project preset may own the Panda presets and color plugin. An application config then composes that preset once rather than duplicating the stack.

## Shared generated output

In a monorepo, point `importMap` at the workspace's shared styled-system package and `outdir` at that package's owned output directory. Use the exact values discovered in project configuration; keep imports on the package boundary instead of a consumer-relative generated folder.

## Static distribution contract

Configure `staticCss` to emit:

- all project recipes with `recipes: '*'`;
- the primary accent theme in `themes`;
- any finite runtime-selected patterns or conditions that extraction cannot observe.

Treat this as the package's distribution contract and extend it when a new runtime-selectable theme or variant is introduced.

## Verification

Run clean codegen, inspect the resolved preset stack and import map, then verify generated recipe types and emitted primary-theme CSS from a consumer package.

Next: for preset internals load [theme-config.md](./theme-config.md); for document and type foundations load [typography-foundation.md](./typography-foundation.md).
