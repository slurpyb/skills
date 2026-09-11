# Algorithmic Design

Defer to the browser's built-in layout algorithms instead of hard-coding designs. Algorithms amplify design intent with consistency and fewer errors.

## Systems vs. Algorithms

A design system is both a set of principles *and* interconnecting parts working together. But documenting things within a system without systems thinking leads to contradiction and duplication.

An algorithmic approach automates intent. Algorithms constitute rules devised by humans, but carried out by the machine. This means fewer errors and greater consistency without sacrificing control.

Documentation is to a system what *extrapolation* is to an algorithm. Algorithms *amplify* design.

## The Web is Already Algorithmic

Web layout is innately algorithmic. The text wrapping algorithm makes the web responsive by default: words wrap according to available space, ensuring no content is obscured.

We break browsers' layout algorithms by applying fixed positions and dimensions. Instead, we should:

- Be deferential to the underlying algorithms that power CSS
- Think in terms of algorithms as we extrapolate layouts
- Leverage selector logic
- Harness flow and wrapping behavior
- Use calculations to adapt layout to context

## The Core Principle

If you find yourself wrestling with CSS layout, you are likely making decisions for browsers they should be making themselves. Through simple, composable layouts, you can harness the built-in algorithms that power browsers and CSS.
