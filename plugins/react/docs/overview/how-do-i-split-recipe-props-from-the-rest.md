---
title: "How do I split recipe props from the rest?"
---

You can split recipe props by using `xxx.splitVariantProps`. Let's say you have a `recipe` named `button`, you can split
its props like this:

```tsx Button.tsx {8}
import { css, cx } from '../styled-system/css'
import { ButtonVariantProps, button } from '../styled-system/recipes'

interface ButtonProps extends ButtonVariantProps {
  children: React.ReactNode
}

export function Button(props: ButtonProps) {
  const { children, ...rest } = props
  const [buttonProps, cssProps] = button.splitVariantProps(rest)
  return <button className={cx(button(buttonProps), css(cssProps))}>{children}</button>
}
```

The same `xxx.splitVariantProps` method is available for both `config recipes` and `atomic recipes`.