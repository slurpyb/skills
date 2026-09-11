# Utilities

Load when using Panda's generated property vocabulary or when one repeated property transformation deserves a typed project-wide prop.

## Using Utilities

Generated utilities cover these styling domains:

- background and gradients;
- border, divide, outline, and focus ring;
- display, layout, sizing, spacing, flex, and grid;
- effects, transforms, and transitions;
- interactivity;
- list, table, SVG, and typography;
- helpers for common CSS behaviors.

Use the generated property or shorthand whose semantics match the declaration. Prefer logical properties and project tokens. Use patterns when several utilities together express a named layout relationship.

## Creating Utilities

Create a custom utility only when the same property-level transformation recurs across otherwise unrelated components and patterns.

A utility may define:

- a stable generated class prefix;
- one or more shorthand names;
- accepted token categories, enums, mappings, or booleans;
- a transform from the typed input to a Panda style object;
- a deprecation marker when replacing vocabulary.

Register additions under `utilities.extend`. Keep the utility key and literal property configuration together so Panda can analyze them. Flatten focused utility exports in a barrel before adding them to a preset.

A component visual choice belongs in a recipe. A coordinated component choice belongs in a slot recipe. A layout algorithm belongs in a pattern. A utility extends the property language itself.

After adding or changing a utility, regenerate types and test both its accepted values and emitted declaration.

Next, load [theme-config.md](./theme-config.md) for registration or [patterns.md](./patterns.md) when multiple utilities form a layout concept.
