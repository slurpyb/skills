---
title: "Media Queries"
---

### Reduced Motion

Use the `_motionReduce` and `_motionSafe` modifiers to style an element based on the user's motion preference:

```jsx
<div
  className={css({
    _motionReduce: { transition: 'none' },
    _motionSafe: { transition: 'all 0.3s' }
  })}
>
  Hello
</div>
```

### Color Scheme

The `prefers-color-scheme` media feature is used to detect if the user has requested the system use a light or dark
color theme.

Use the `_osLight` and `_osDark` modifiers to style an element based on the user's color scheme preference:

```jsx
<div
  className={css({
    bg: 'white',
    _osDark: { bg: 'black' }
  })}
>
  Hello
</div>
```

Let's say your app is dark by default, but you want to allow users to switch to a light theme. You can do it like this:

```jsx
<div
  className={css({
    bg: 'black',
    _osLight: { bg: 'white' }
  })}
>
  Hello
</div>
```

### Color Contrast

The `prefers-contrast` media feature is used to detect if the user has requested the system use a high or low contrast
theme.

Use the `_highContrast` and `_lessContrast` modifiers to style an element based on the user's color contrast preference:

```jsx
<div
  className={css({
    bg: 'white',
    _highContrast: { bg: 'black' }
  })}
>
  Hello
</div>
```

### Orientation

The `orientation` media feature is used to detect if the user has a device in portrait or landscape mode.

Use the `_portrait` and `_landscape` modifiers to style an element based on the user's device orientation:

```jsx
<div
  className={css({
    pb: '4',
    _portrait: { pb: '8' }
  })}
>
  Hello
</div>
```