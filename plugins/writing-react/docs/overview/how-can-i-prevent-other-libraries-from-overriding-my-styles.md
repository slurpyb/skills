---
title: "How can I prevent other libraries from overriding my styles?"
---

You can use
[Layer Imports](<https://developer.mozilla.org/en-US/docs/Web/CSS/@import#layer-name:~:text=%40import%20url%20layer(layer%2Dname)%3B>)
to prevent other libraries from overriding your styles.

First of all you cast the css from the other library(s) to a css layer:

```css
@import url('bootstrap.css') layer(bootstrap);

@import url('ionic.css') layer(ionic);
```

Then update the default layer list to deprioritize the styles from the other library(s):

```css
@layer bootstrap, reset, base, token, recipes, utilities;

@layer ionic, reset, base, token, recipes, utilities;
```