# Package integration

Use this reference when adding or updating `@fullsnacklab/components` and `@fullsnacklab/design-system` in an application or workspace package.

## Dependencies

Install the packages in the workspace that imports them. Keep React and React DOM versions compatible with the component package peer range. Keep the project's existing package manager and workspace protocol conventions.

The package responsibilities are:

- `@fullsnacklab/components` — React exports and compiled component CSS.
- `@fullsnacklab/design-system` — shared preset, plugin, colors, and theme contracts.

## Public entry points

Component package:

- `@fullsnacklab/components`
- `@fullsnacklab/components/styles.css`
- `@fullsnacklab/components/index.css`
- packaged style and specification subpaths exposed by the installed version

Design-system package:

- `@fullsnacklab/design-system`
- `@fullsnacklab/design-system/preset`
- `@fullsnacklab/design-system/plugin`
- `@fullsnacklab/design-system/colors`

Use package-root component imports. Use one design-system import style consistently within a configuration file.

## Stylesheet boundary

Import the component stylesheet once at the established global style entry point:

```ts
import "@fullsnacklab/components/styles.css";
```

Before adding it, search the application entry points and shared layout. Duplicate global imports make ownership unclear and can disturb layer order.

## Workspace wrappers

An application may expose its own workspace package that composes `@fullsnacklab/components`. Feature code should use that workspace wrapper when it already owns the product contract. The wrapper package itself imports the Full Snack Lab package directly.

Keep the dependency graph one-directional:

```text
@fullsnacklab/design-system
            ↓
@fullsnacklab/components
            ↓
workspace application wrappers
            ↓
feature code
```

## Version updates

When versions change:

1. read the package change notes available in the installation;
2. compare package export maps with this skill's version header;
3. run theme generation before type checks;
4. type-check shared wrappers before applications;
5. test representative leaf, family, form, and overlay components;
6. update affected local references when exports or defaults changed.

## Verification order

1. package resolution;
2. shared theme generation;
3. wrapper package type check;
4. application type check;
5. lint;
6. executable interaction test;
7. production build when integration boundaries changed.

A successful import is not enough. The change is complete when styles resolve, generated imports resolve, interaction behavior works, and production assembly succeeds.
