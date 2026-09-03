---
title: "Installation and Syntax"
---

In styled-components, you can use both tagged template literals and object syntax to style components.

In Panda, you need to decide which syntax you want to use. Panda recommends using the object syntax, but provides a way
to opt-in to tagged template literals.

To initialize a project with the object syntax, run the following command.

```bash
panda init -p --jsx-framework react
```

To initialize a project with the tagged template literal syntax, run the following command.

```bash
panda init -p --syntax template-literal --jsx-framework react
```

Then you need to add the cascade layers to the global styles of your project.

```css
@layer reset, base, tokens, recipes, utilities;
```