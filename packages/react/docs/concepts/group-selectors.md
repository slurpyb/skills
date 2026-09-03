---
title: "Group Selectors"
---

When you need to style an element based on its parent element's state or attribute, you can add the `group` class to the
parent element, and use any of the `_group*` modifiers on the child element.

```jsx
<div className="group">
  <p className={css({ _groupHover: { bg: 'red.500' } })}>Hover me</p>
</div>
```

This modifer for every pseudo class modifiers like `_groupHover`, `_groupActive`, `_groupFocus`, and `_groupDisabled`,
etc.