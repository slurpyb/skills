---
title: "When to use Panda?"
---

### Styling engine

If you're building a JavaScript application with a framework that supports PostCSS, Panda is a great choice for you.

```jsx
import { css } from '../styled-system/css'
import { circle, stack } from '../styled-system/patterns'

function App() {
  return (
    <div
      className={stack({
        direction: 'row',
        p: '4',
        rounded: 'md',
        shadow: 'lg',
        bg: 'white'
      })}
    >
      <div className={circle({ size: '5rem', overflow: 'hidden' })}>
        <img src="https://via.placeholder.com/150" alt="avatar" />
      </div>
      <div className={css({ mt: '4', fontSize: 'xl', fontWeight: 'semibold' })}>John Doe</div>
      <div className={css({ mt: '2', fontSize: 'sm', color: 'gray.600' })}>john@doe.com</div>
    </div>
  )
}
```

> If your framework doesn't support PostCSS, you can use the [Panda CLI](/docs/installation/cli)

### Token generator

Panda has first-class support for design tokens. It provides a way to express raw and semantic tokens for your project.
The generator can be used to create a set of CSS variables for your design tokens.

```ts filename="panda.config.ts"
export default defineConfig({
  emitTokensOnly: true,
  theme: {
    tokens: {
      colors: {
        gray50: { value: '#F9FAFB' },
        gray100: { value: '#F3F4F6' }
      }
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.gray50}' },
        success: {
          value: { _light: '{colors.green500}', _dark: '{colors.green200}' }
        }
      }
    }
  }
})
```

Running the `panda codegen` will generate

```css filename="styled-system/tokens/index.css"
:root {
  --colors-gray50: #f9fafb;
  --colors-gray100: #f3f4f6;
  --colors-primary: var(--colors-gray50);
  --colors-success: var(--colors-green500);
}

[data-theme='dark'] {
  --colors-primary: var(--colors-gray50);
  --colors-success: var(--colors-green200);
}
```

Then you have a set of css variables that you can use in your project.

```css
@import '../styled-system/tokens/index.css';

.card {
  background-color: var(--colors-gray50);
}
```