# Patterns

Load when the request is primarily about reusable layout relationships or generated layout components.

## Using Patterns

Choose the existing pattern that names the relationship:

| Situation               | Typical pattern |
| ----------------------- | --------------- |
| Vertical rhythm         | Stack or VStack |
| Horizontal alignment    | Flex or HStack  |
| Wrapping rows           | Wrap            |
| Responsive columns      | Grid            |
| Width and gutters       | Container       |
| Centering               | Center          |
| Aspect preservation     | AspectRatio     |
| Visually hidden content | VisuallyHidden  |

Pass layout choices through typed pattern props. Keep component appearance and interaction variants in recipes.

Prefer intrinsic layout inputs such as gaps, minimum child widths, measures, and container behavior before adding viewport-specific branches.

## Creating Patterns

Create a pattern when a named layout algorithm recurs and existing patterns cannot express it.

1. Define typed `properties` for the layout decisions callers may control.
2. Set `defaultValues` for a useful zero-configuration result.
3. Use `transform` to convert those inputs into one style object.
4. Preserve unrelated style props by forwarding the remaining properties.
5. Register the pattern under `patterns.extend` in the owning preset.
6. Run codegen and consume the generated function or JSX component.

A pattern owns arrangement: display mode, flow, tracks, gaps, alignment, intrinsic sizing, and placement. It does not own a component's color, surface, typography, or interaction state.

Next, load [style-props.md](./style-props.md) for call-site props or [theme-config.md](./theme-config.md) when registering a custom pattern.
