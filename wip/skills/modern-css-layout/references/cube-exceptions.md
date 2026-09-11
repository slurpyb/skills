# Exception Layer

An exception is a deviation from the rules outlined in a block, usually related to a state change.

## Usage

Exceptions use data attributes, not CSS classes. Example states: "reversed", "inactive".

Apply an exception via a data attribute:

```html
<article class="card" data-state="reversed"></article>
```

Style the exception in CSS:

```css
.card[data-state='reversed'] {
  display: flex;
  flex-direction: column-reverse;
}
```

## Why Data Attributes, Not CSS Classes

- Exceptions occur in exceptional circumstances only
- Exceptions are often caused by outside influence (e.g., JavaScript)
- Data attributes work efficiently for both CSS and JavaScript
- Exceptions map well to finite state machine concepts
- Separating exceptions into data attributes provides clarity

## What an Exception Should Do

1. Provide a concise variation to a block
2. Use data attributes

## What an Exception Should Not Do

1. Variate a block to the point where it is unrecognisable -- create a new block instead
2. Use CSS classes
