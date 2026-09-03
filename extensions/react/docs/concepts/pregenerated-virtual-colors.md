---
title: "Pregenerated Virtual Colors"
---

Use the `staticCss` option in the config to pre-generate values for the `colorPalette` property.

This is useful when you want to use a color palette that can be changed at runtime (e.g. in Storybook knobs).

> Learn more about [static css generation](/docs/guides/static).

```tsx
export default defineConfig({
  staticCss: {
    css: [
      {
        properties: { colorPalette: ['red', 'blue'] }
      }
    ]
  }
})
```

Then in your code, you can design components that use the `colorPalette` property:

```tsx
import { css } from '../styled-system/css'

function ButtonShowcase() {
  const [colorPalette, setColorPalette] = useState('red')
  return (
    <div>
      <select value={colorPalette} onChange={e => setColorPalette(e.currentTarget.value)}>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
      </select>

      <button
        className={css({
          bg: 'colorPalette.50',
          color: 'colorPalette.500',
          colorPalette
        })}
      >
        Click me
      </button>
    </div>
  )
}
```