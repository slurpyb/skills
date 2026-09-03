---
title: "Why does importing styled not exist?"
---

You should use [`config.jsxFramework`](/docs/concepts/style-props#configure-jsx) when you need to import styled
components. You can then use the [`jsxFactory`](/references/config#jsxfactory) option to set the name of the factory
component.