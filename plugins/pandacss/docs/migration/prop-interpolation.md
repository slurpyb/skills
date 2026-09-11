---
title: "Prop Interpolation"
---

In styled-components, you can interpolate the component's props to conditionally set styles.

```jsx
const Button = styled.button`
  ${props =>
    props.color === 'violet' &&
    `
    background-color: 'blueviolet'
  `}

  ${props =>
    props.color === 'gray' &&
    `
    background-color: 'gainsboro'
  `}
`
```

In Panda, we model interpolations using the variants API. This allows define style groups or recipes that can be applied
to components.

````jsx
const Button = styled('button', {
  variants: {
    color: {
      violet: css`
        background-color: blueviolet;
      `,
      gray: css`
        background-color: gainsboro;
      `
    }
  }
})

// Usage
<Button color="violet">Button</Button>
``` -->