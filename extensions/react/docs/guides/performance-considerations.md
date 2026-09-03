---
title: "Performance Considerations"
---

Panda provides intelligent caching and memoization to optimize static CSS generation. However, **pre-generating large
numbers of styles can still impact build times**. It's important to be selective and only generate the styles you
actually need.

### Best Practices

**❌ Avoid: Generating every possible combination**

```js
export default {
  staticCss: {
    css: [
      {
        conditions: ['hover', 'focus', 'active', 'disabled'],
        properties: {
          // This expands to ALL tokens - very expensive!
          color: ['*'],
          backgroundColor: ['*'],
          borderColor: ['*'],
          width: ['*'],
          height: ['*']
          // ... 20+ more properties with wildcards
        }
      }
    ]
  }
}
```

**✅ Better: Only generate what you need**

```js
export default {
  staticCss: {
    css: [
      {
        conditions: ['_hover', '_focus'],
        properties: {
          // Only the colors you actually use
          color: ['red.500', 'blue.500', 'gray.600'],
          backgroundColor: ['white', 'gray.50', 'blue.50'],
          borderColor: ['gray.200', 'blue.500']
        }
      }
    ]
  }
}
```

### When to Use Wildcards

Wildcards (`['*']`) are appropriate when:

- **Small token sets**: Properties with < 20 values (e.g., `fontWeight: ['*']`)
- **Critical utilities**: Styles you genuinely need in all variants
- **Testing scenarios**: Storybook or visual regression testing

### Use Responsive Selectively

The `responsive` property multiplies the number of generated classes by your breakpoints. Only enable it for properties
that genuinely need responsive behavior.

**❌ Avoid: Responsive for all properties**

```js
export default {
  staticCss: {
    css: [
      {
        // This generates classes for ALL breakpoints (sm, md, lg, xl, 2xl)
        responsive: true,
        properties: {
          color: ['red.500', 'blue.500'],
          backgroundColor: ['white', 'gray.50'],
          fontWeight: ['400', '500', '600'],
          borderRadius: ['sm', 'md', 'lg']
        }
      }
    ]
  }
}
```

**✅ Better: Responsive only for layout properties**

```js
export default {
  staticCss: {
    css: [
      {
        // Responsive for layout properties that change across breakpoints
        responsive: true,
        properties: {
          display: ['none', 'block', 'flex'],
          flexDirection: ['row', 'column'],
          width: ['full', '1/2', '1/3']
        }
      },
      {
        // No responsive needed for colors/typography that stay the same
        properties: {
          color: ['red.500', 'blue.500'],
          fontWeight: ['400', '500', '600']
        }
      }
    ]
  }
}
```

Properties that commonly need `responsive: true`:

- Layout: `display`, `flexDirection`, `gridTemplateColumns`
- Sizing: `width`, `height`, `maxWidth`
- Spacing: `padding`, `margin`, `gap`
- Positioning: `position`, `top`, `left`

Properties that rarely need `responsive: true`:

- Colors: `color`, `backgroundColor`, `borderColor`
- Typography: `fontWeight`, `textDecoration`, `fontFamily`
- Effects: `boxShadow`, `opacity`, `cursor`