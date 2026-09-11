# Class Grouping Convention

CUBE CSS can produce busy `class` attributes, so a grouping mechanism is recommended for readability.

## Square Bracket Grouping

```html
<article
  class="[ card ] [ section box ] [ bg-base color-primary ]"
  data-state="reversed"
></article>
```

## Pipe Grouping

```html
<article
  class="card | section box | bg-base color-primary"
  data-state="reversed"
></article>
```

## Grouping Order

1. The element's primary block class
2. Any subsequent block classes
3. Standard utility classes
4. Design token utility classes

## Consistency Is the Goal

The delimiter (square brackets, pipes, or anything else) does not matter to HTML or CSS. The priority is consistency and ease of reading across your team.
