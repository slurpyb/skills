# Usage

Load when Panda must be integrated with Astro, PostCSS, the CLI, codegen, or Storybook.

## Using Astro

- Include `.astro` files in Panda's content globs.
- Import generated pattern or recipe functions in component frontmatter and apply their result through Astro's `class` attribute.
- Keep reusable visual decisions in the shared preset; Astro files compose the generated vocabulary.
- Import the generated stylesheet or processed CSS once at the application boundary.
- Pre-generate finite runtime-selected values with `staticCss` when extraction cannot see them.

## Using PostCSS

- Register Panda's PostCSS plugin in the existing PostCSS configuration.
- Declare the project layer order in the root CSS entry.
- Run codegen before PostCSS, typechecking, or framework compilation consumes generated imports.
- Keep content globs aligned with every authored source extension.

## Using the CLI

Use repository scripts as the command source of truth. The common sequence is:

1. `panda codegen --clean` to refresh runtime and types.
2. `panda cssgen` or the configured build command to emit CSS.
3. `panda ship` when a distributable preset or styled-system package is produced.
4. `panda spec` when the project publishes design-system metadata.

Use watch mode during local development when the repository already provides it.

## Using Storybook

- Give Storybook its own Panda config only when its scan roots or output location differ.
- Include story and example files in extraction.
- Compose story layouts with generated Stack, Wrap, Grid, Flex, Center, and Container components.
- Resolve the generated styled-system import through the existing alias or package boundary.
- Generate styles before Storybook starts and verify representative stories in a browser.

Next, load [styled-system.md](./styled-system.md) for generated output or the task-specific pattern, recipe, token, or configuration reference.
