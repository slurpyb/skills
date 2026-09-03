---
title: "Data Attribute"
---

### LTR and RTL

You can style an element based on the direction of the text using the `_ltr` and `_rtl` modifiers:

```jsx
<div dir="ltr">
  <div
    className={css({
      _ltr: { ml: '3' },
      _rtl: { mr: '3' }
    })}
  >
    Hello
  </div>
</div>
```

For this to work, you need to set the `dir` attribute on the parent element. In most cases,you can set this on the
`html` element.

> **Note:** Consider using logical css properties like `marginInlineStart` and `marginInlineEnd` instead their physical
> counterparts like `marginLeft` and `marginRight`. This will reduce the need to use the `_ltr` and `_rtl` modifiers.

### State

You can style an element based on its `data-{state}` attribute using the corresponding `_{state}` modifier:

```jsx
<div
  data-loading
  className={css({
    _loading: { bg: 'gray.500' }
  })}
>
  Hello
</div>
```

This also works for common states like `data-active`, `data-disabled`, `data-focus`, `data-hover`, `data-invalid`,
`data-required`, and `data-valid`.

```jsx
<div
  data-active
  className={css({
    _active: { bg: 'gray.500' }
  })}
>
  Hello
</div>
```

> Most of the `data-{state}` attributes typically mirror the corresponding browser pseudo class. For example,
> `data-hover` is equivalent to `:hover`, `data-focus` is equivalent to `:focus`, and `data-active` is equivalent to
> `:active`.

### Orientation

You can style an element based on its `data-orientation` attribute using the `_horizontal` and `_vertical` modifiers:

```jsx
<div
  data-orientation="horizontal"
  className={css({
    _horizontal: { bg: 'red.500' },
    _vertical: { bg: 'blue.500' }
  })}
>
  Hello
</div>
```