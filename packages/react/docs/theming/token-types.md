---
title: "Token Types"
---

Panda supports the following token types:

### Colors

Colors have meaning and support the purpose of the content, communicating things like hierarchy of information, and
states. It is mostly defined as a string value or reference to other tokens.

```jsx
const theme = {
  tokens: {
    colors: {
      red: { 100: { value: '#fff1f0' } }
    }
  }
}
```

### Gradients

Gradient tokens represent a smooth transition between two or more colors. Its value can be defined as a string or a
composite value.

```ts
type Gradient =
  | string
  | {
      type: 'linear' | 'radial'
      placement: string | number
      stops:
        | Array<{
            color: string
            position: number
          }>
        | Array<string>
    }
```

```jsx
const theme = {
  tokens: {
    gradients: {
      // string value
      simple: { value: 'linear-gradient(to right, red, blue)' },
      // composite value
      primary: {
        value: {
          type: 'linear',
          placement: 'to right',
          stops: ['red', 'blue']
        }
      }
    }
  }
}
```

### Sizes

Size tokens represent the width and height of an element. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    sizes: {
      sm: { value: '12px' }
    }
  }
}
```

> Size tokens are typically used in `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height` properties.

### Spacings

Spacing tokens represent the margin and padding of an element. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    spacing: {
      sm: { value: '12px' }
    }
  }
}
```

> Spacing tokens are typically used in `margin`, `padding`, `gap`, and `{top|right|bottom|left}` properties.

### Fonts

Font tokens represent the font family of a text element. Its value is defined as a string or an array of strings.

```jsx
const theme = {
  tokens: {
    fonts: {
      body: { value: 'Inter, sans-serif' },
      heading: { value: ['Roboto Mono', 'sans-serif'] }
    }
  }
}
```

> Font tokens are typically used in `font-family` property.

### Font Sizes

Font size tokens represent the size of a text element. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    fontSizes: {
      sm: { value: '12px' }
    }
  }
}
```

> Font size tokens are typically used in `font-size` property.

### Font Weights

Font weight tokens represent the weight of a text element. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    fontWeights: {
      bold: { value: '700' }
    }
  }
}
```

> Font weight tokens are typically used in `font-weight` property.

### Letter Spacings

Letter spacing tokens represent the spacing between letters in a text element. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    letterSpacings: {
      wide: { value: '0.1em' }
    }
  }
}
```

> Letter spacing tokens are typically used in `letter-spacing` property.

### Line Heights

Line height tokens represent the height of a line of text. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    lineHeights: {
      normal: { value: '1.5' }
    }
  }
}
```

> Line height tokens are typically used in `line-height` property.

### Radii

Radii tokens represent the radius of a border. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    radii: {
      sm: { value: '4px' }
    }
  }
}
```

> Radii tokens are typically used in `border-radius` property.

### Borders

A border is a line surrounding a UI element. You can define them as string values or as a composite value

```jsx
const theme = {
  tokens: {
    borders: {
      // string value
      subtle: { value: '1px solid red' },
      // string value with reference to color token
      danger: { value: '1px solid {colors.red.400}' },
      // composite value
      accent: { value: { width: '1px', color: 'red', style: 'solid' } }
    }
  }
}
```

> Border tokens are typically used in `border`, `border-top`, `border-right`, `border-bottom`, `border-left`, `outline`
> properties.

### Border Widths

Border width tokens represent the width of a border. Its value is defined as a string.

```jsx
const theme = {
  tokens: {
    borderWidths: {
      thin: { value: '1px' },
      thick: { value: '2px' },
      medium: { value: '1.5px' }
    }
  }
}
```

### Shadows

Shadow tokens represent the shadow of an element. Its value is defined as single or multiple values containing a string
or a composite value.

```ts
type CompositeShadow = {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset?: boolean
}

type Shadow = string | CompositeShadow | string[] | CompositeShadow[]
```

```jsx
const theme = {
  tokens: {
    shadows: {
      // string value
      subtle: { value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
      // composite value
      accent: {
        value: {
          offsetX: 0,
          offsetY: 4,
          blur: 4,
          spread: 0,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      // multiple string values
      realistic: {
        value: ['0 1px 2px 0 rgba(0, 0, 0, 0.05)', '0 1px 4px 0 rgba(0, 0, 0, 0.1)']
      }
    }
  }
}
```

> Shadow tokens are typically used in `box-shadow` property.

### Easings

Easing tokens represent the easing function of an animation or transition. Its value is defined as a string or an array
of values representing the cubic bezier.

```jsx
const theme = {
  tokens: {
    easings: {
      // string value
      easeIn: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      // array value
      easeOut: { value: [0.4, 0, 0.2, 1] }
    }
  }
}
```

> Ease tokens are typically used in `transition-timing-function` property.

### Opacity

Opacity tokens help you set the opacity of an element.

```js
const theme = {
  tokens: {
    opacity: {
      50: { value: 0.5 }
    }
  }
}
```

> Opacity tokens are typically used in `opacity` property.

### Z-Index

This token type represents the depth of an element's position on the z-axis.

```jsx
const theme = {
  tokens: {
    zIndex: {
      modal: { value: 1000 }
    }
  }
}
```

> Z-index tokens are typically used in `z-index` property.

### Assets

Asset tokens represent a url or svg string. Its value is defined as a string or a composite value.

```ts
type CompositeAsset = { type: 'url' | 'svg'; value: string }
type Asset = string | CompositeAsset
```

```js
const theme = {
  tokens: {
    assets: {
      logo: {
        value: { type: 'url', value: '/static/logo.png' }
      },
      checkmark: {
        value: { type: 'svg', value: '<svg>...</svg>' }
      }
    }
  }
}
```

> Asset tokens are typically used in `background-image` property.

### Durations

Duration tokens represent the length of time in milliseconds an animation or animation cycle takes to complete. Its
value is defined as a string.

```jsx
const theme = {
  tokens: {
    durations: {
      fast: { value: '100ms' }
    }
  }
}
```

> Duration tokens are typically used in `transition-duration` and `animation-duration` properties.

### Animations

Animation tokens represent a keyframe animation. Its value is defined as a string value.

```jsx
const theme = {
  tokens: {
    animations: {
      spin: {
        value: 'spin 1s linear infinite'
      }
    }
  }
}
```

> Animation tokens are typically used in `animation` property.

### Aspect Ratios

Aspect ratio tokens represent the aspect ratio of an element. Its value is defined as a string.

```js
const theme = {
  tokens: {
    aspectRatios: {
      '1:1': { value: '1 / 1' },
      '16:9': { value: '16 / 9' }
    }
  }
}
```

### Cursor

Cursor tokens define the style of the mouse pointer when it hovers over a specific element or area. These tokens
represent the visual behavior of interactions, indicating actions such as clickable areas, draggable elements, or
loading states. Their value is defined as a string.

```js
const theme = {
  tokens: {
    cursor: {
      click: { value: 'pointer' },
      disabled: { value: 'not-allowed' },
      // custom value
      custom: { value: 'url(cursor.svg), auto' }
    }
  }
}
```