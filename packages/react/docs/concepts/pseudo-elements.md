---
title: "Pseudo Elements"
---

### Before and After

You can style the `::before` and `::after` pseudo elements of an element using their `_before` and `_after` modifier:

```jsx
<div
  className={css({
    _before: { content: '"👋"' }
  })}
>
  Hello
</div>
```

#### Notes

- **Before and After**: Ensure you wrap the content value in double quotes.
- **Mixing with Conditions**: When using condition and pseudo elements, prefer to place the condition **before** the
  pseudo element.

```jsx
css({
  // This works ✅
  _dark: { _backdrop: { color: 'red' } }
  // This doesn't work ❌
  _backdrop: { _dark: { color: 'red' } }
})
```

The reason `_backdrop: { _dark: { color: 'red' } }` doesn't work is because it generated an invalid CSS structure that
looks like:

```css
&::backdrop {
  &.dark,
  .dark & {
    color: red;
  }
}
```

### Placeholder

Style the placeholder text of any input or textarea using the `_placeholder` modifier:

```jsx
<input
  placeholder="Enter your name"
  className={css({
    _placeholder: { color: 'gray.500' }
  })}
/>
```

### File Inputs

Style the file input button using the `_file` modifier:

```jsx
<input
  type="file"
  className={css({
    _file: { bg: 'gray.500', px: '4', py: '2', marginEnd: '3' }
  })}
/>
```