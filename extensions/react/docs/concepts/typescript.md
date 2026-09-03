---
title: "TypeScript"
---

Use the `SystemStyleObject` type if you want to type your styles.

```ts {2}
import { css } from '../styled-system/css'
import type { SystemStyleObject } from '../styled-system/types'

const styles: SystemStyleObject = {
  color: 'red'
}
```