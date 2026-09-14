---
title: "Server-Side Rendering"
---

In styled components, you need to configure the server-side rendering for your framework.

```tsx
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

const sheet = new ServerStyleSheet()
try {
  const html = renderToString(sheet.collectStyles(<YourApp />))
  const styleTags = sheet.getStyleTags() // or sheet.getStyleElement();
} catch (error) {
  // handle error
  console.error(error)
} finally {
  sheet.seal()
}
```

In Panda, you don't need to configure anything. Panda automatically extracts the styles and injects them at build time
using PostCSS.