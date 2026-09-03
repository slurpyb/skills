---
title: "The styled tag"
---

The `styled` tag allows you to create a component with encapsulated styles. It's similar to the `styled-components` or
`emotion` library.

```js
import { styled } from '../styled-system/jsx'

// Create a styled component
const Heading = styled.h1`
  font-size: 16px;
  font-weight: bold;
`

function Demo() {
  // Use the styled component
  return <Heading>This is a title</Heading>
}

// => <h1 class='font-size_16px font-weight_bold'>This is a title</h1>
```

Here's what the emitted atomic CSS looks like:

```css
.font-size_16px {
  font-size: 16px;
}

.font-weight_bold {
  font-weight: bold;
}
```