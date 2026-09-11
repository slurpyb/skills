---
title: "Limitations"
---

- Recipes created from `cva` cannot have responsive or conditional values. Only layer recipes can have responsive or
  conditional values.

- Due to static nature of Panda, it's not possible to track the usage of the recipes in all cases. Here are some of use
  cases that Panda won't be able to track the usage of the recipe variants:

  **When you change the name of the variant prop in the JSX component**

  In below example, the `size` prop is renamed to `buttonSize`

  ```tsx
  const Button = ({ buttonSize, children }) => {
    return (
      <button {...props} className={button({ size: buttonSize })}>
        {children}
      </button>
    )
  }
  ```

  **When you use the recipe in a custom component that is not named as per the recipe name, Panda won't be able to track
  the usage of the recipe variants.**

  In below example, the component name `Button` is renamed to `Random` and we are using `button` recipe.

  ```tsx
  const Random = ({ size, children }) => {
    return (
      <button {...props} className={button({ size })}>
        {children}
      </button>
    )
  }
  ```

- When using `compoundVariants` in the recipe, you're not able to use responsive values in the variants.

```tsx
const button = defineRecipe({
  base: {
    color: 'red',
    fontSize: '1.5rem'
  },
  variants: {
    size: {
      sm: {
        fontSize: '1rem'
      },
      md: {
        fontSize: '2rem'
      }
    }
  },
  // this  will disable responsive values for the variants
  compoundVariants: [
    {
      size: 'sm',
      visual: 'funky',
      css: {
        color: 'blue'
      }
    },
    {
      size: 'md',
      visual: 'funky',
      css: {
        color: 'green'
      }
    }
  ]
})
```