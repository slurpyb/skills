---
title: "Utilities"
---

The utility API is a way to create your own CSS properties, map existing properties to a set of values or tokens.

The utility API enables you to create custom CSS properties and map existing properties to specific values or tokens.
It's like building your own type-safe version of Chakra UI, Tailwind (in JS), or Styled System.

Panda comes with a set of utilities out of the box. You can customize them, or add your own.

Here are the properties you need to define or customize a utility:

- `className` : The className the property maps to
- `shorthand`: The shorthand or alias version of the property
- `values`: The possible values the property can have. Could be a token category, or an enum of values, string, number,
  or boolean.
- `transform`: A function that converts the value to a valid css object