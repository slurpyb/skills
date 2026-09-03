---
title: "Component Styles"
---

Theme UI offers pre-defined layout components like `Box`, `Stack`, `Grid`, `Flex`

```jsx
import { Box, Grid } from 'theme-ui'

const Demo = () => (
  <Grid width={[128, null, 192]}>
    <Box bg="primary">Box</Box>
    <Box bg="muted">Box</Box>
    <Box bg="primary">Box</Box>
    <Box bg="muted">Box</Box>
  </Grid>
)
```

In Panda, these are called "layout patterns", or "patterns" for short. Panda provides similar patterns that can be used
as a function or JSX element just like Theme UI.

```jsx
import { Box, Grid } from 'styled-system/jsx'

const Demo = () => (
  <Grid width={[128, null, 192]}>
    <Box bg="primary">Box</Box>
    <Box bg="muted">Box</Box>
  </Grid>
)
```

The function approach can be handy as well

```jsx
import { css } from 'styled-system/css'
import { grid } from 'styled-system/patterns'

const Demo = () => (
  <div className={grid({ width: [128, null, 192] })}>
    <div className={css({ bg: 'primary' })}>Box</div>
    <div className={css({ bg: 'muted' })}>Box</div>
  </div>
)
```