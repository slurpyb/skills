---
title: "Customizing Patterns"
---

Panda provides the ability to customize the built-in patterns, as well as creating your own custom patterns. This is useful to create your own layout pattern abstractions that can be used in your application.

Panda allows you to customize built-in patterns and create custom patterns for reusable layout abstractions.

A pattern accepts the following parameters:

- `description` - The description of the pattern.
- `properties` - The list of properties that the pattern accepts.
- `defaultValues` - The default values for the properties. This is useful when you want to provide a default value for a
  property.
- `transform` - The function that accepts the properties and returns a css object.
- `jsx` - The name of the JSX component that will be generated (when `jsxFramework` is set). Defaults to the pascal-case
  version of the pattern name.
- `jsxElement` - The actual JSX element that will be rendered (when `jsxFramework` is set). Defaults to `div`.
- `blocklist` - The list of properties that are not allowed to be used in the pattern. Can be used to ensure strict
  typings when using the pattern.
- `strict` - Whether to only generate types for the specified properties. This will disallow css properties.