---
title: "Composite values"
---

Some CSS properties like `border`, `box-shadow` allow you to specify multiple properties in its value. Panda allows you
to reference tokens in these composite values by using either the `token()` string function (similar to the JS
equivalent) or the token reference syntax `{path.to.token}` (similar to the semantic tokens equivalent).

The `token()` function is useful when you need to provide a fallback value. The token reference syntax is useful when
you don't need a fallback value or prefer using a more concise syntax.

<Tabs items={['token', 'reference syntax']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
    ```js
    import { css } from '../styled-system/css'

    const className = css({ border: '1px solid token(colors.red.400)' })
    ```

    You can also provide a fallback value.

    ```js
    import { css } from '../styled-system/css'

    const className = css({ border: '1px solid token(colors.red.400, red)' })
    ```

  </Tab>
  <Tab>
    ```js
    import { css } from '../styled-system/css'

    const className = css({ border: '1px solid {colors.red.400}' })
    ```

  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>

You can also use it in media queries or any other CSS at-rule.

<Tabs items={['token', 'reference syntax']}>
  {/* <!-- prettier-ignore-start --> */}
  <Tab>
    ```js
    import { css } from '../styled-system/css'

    const className = css({
      '@media screen and (min-width: token(sizes.4xl))': {
        color: 'green.400'
      }
    })
    ```

  </Tab>
  <Tab>
    ```js
    import { css } from '../styled-system/css'

    const className = css({
      '@media screen and (min-width: {sizes.4xl})': {
        color: 'green.400'
      }
    })
    ```

  </Tab>
  {/* <!-- prettier-ignore-end --> */}
</Tabs>