---
title: "Merging within JSX component"
---

Using these techniques, you can apply them to a component by exposing a `css` prop and merge with local styles.

> **Note:** For this to work, Panda requires that you set `jsxFramework` config option to `react`

```jsx
const cardStyles = css.raw({
  bg: 'red',
  color: 'white'
})

function Card({ title, description, css: cssProp }) {
  return (
    // merge the `cardStyles` with the `cssProp` passed in
    <div className={css(cardStyles, cssProp)}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

// usage
function Demo() {
  return <Card title="Hello World" description="This is a card component" css={{ bg: 'blue' }} />
}
```

If you use any other prop name other than `css`, then you must use the `css.raw(...)` function to ensure Panda extracts
the style object.

```jsx
const cardStyles = css.raw({
  bg: 'red',
  color: 'white'
})

function Card({ title, description, style }) {
  return (
    // merge the `cardStyles` with the `style` passed in
    <div className={css(cardStyles, style)}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

// usage
function Demo() {
  return (
    <Card
      title="Hello World"
      description="This is a card component"
      // use `css.raw(...)` to ensure Panda extracts the style object
      style={css.raw({ bg: 'blue' })}
    />
  )
}
```