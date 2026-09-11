---
title: "Pseudo Classes"
---

### Hover, Active, Focus, and Disabled

You can style the hover, active, focus, and disabled states of an element using their `_` modifier:

```jsx
<button
  className={css({
    bg: 'red.500',
    _hover: { bg: 'red.700' },
    _active: { bg: 'red.900' }
  })}
>
  Hover me
</button>
```

### First, Last, Odd, Even

You can style the first, last, odd, and even elements of a group using their `_` modifier:

```jsx
<ul>
  {items.map(item => (
    <li key={item} className={css({ _first: { color: 'red.500' } })}>
      {item}
    </li>
  ))}
</ul>
```

You can also style even and odd elements using the `_even` and `_odd` modifier:

```jsx
<table>
  <tbody>
    {items.map(item => (
      <tr
        key={item}
        className={css({
          _even: { bg: 'gray.100' },
          _odd: { bg: 'white' }
        })}
      >
        <td>{item}</td>
      </tr>
    ))}
  </tbody>
</table>
```