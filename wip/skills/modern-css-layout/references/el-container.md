# The Container

Container queries as an escape hatch for layouts that cannot be solved intrinsically, and when to prefer intrinsic layouts instead.

## Container Queries vs. Intrinsic Layout

Every Layout's core thesis: the less manual intervention, the better. Both `@media` and `@container` queries are manual circuit breakers wired into layouts you know will error.

Media queries measure the *viewport*, not the element's actual space. Container queries measure a containing element, which is more useful. But intrinsic layouts need *neither*:

```css
/* Media query approach */
.layout > * {
  flex-basis: 50%;
}
@media (max-width: 360px) {
  .layout > * { flex-basis: 100%; }
}

/* Container query approach */
.layout {
  container-type: inline-size;
}
@container (width < 360px) {
  .layout > * { flex-basis: 100%; }
}

/* Intrinsic approach -- no queries needed */
.layout {
  display: flex;
  flex-wrap: wrap;
}
.layout > * {
  flex-basis: 180px;
  flex-grow: 1;
}
```

The intrinsic approach is less code, more backwards compatible, and revolves around the elements themselves rather than external measurements.

## When Intrinsic Layouts Win

The Sidebar layout intrinsically switches between 1 and 2-column states based on the *comparative widths of the two elements*. Increasing the sidebar width automatically moves the switch point. Container queries cannot do this because they only know the container's state, not the states of elements inside it.

## When to Use Container Queries

Use them for layouts where an intrinsically sound solution cannot be easily devised -- as an escape hatch when composing Every Layout primitives does not fully solve the problem.

## Setting Up Containers

### Unnamed

```css
.container {
  container-type: inline-size;
}
```

Nested containers: queries correspond to the closest ancestral container by default.

### Named

```css
.layout {
  container: myContainer / inline-size;
}

@container myContainer (width < 360px) {
  .layout > * {
    /* styles */
  }
}
```

Named containers can be queried from any nested depth.

## Container Units

Container units (e.g., `cqi`, `cqw`) let typography and spacing scale with the container rather than the viewport.

## Generator CSS

```css
.container {
  container-name: myContainer;
  container-type: inline-size;
}
```

## Component API

| Prop | Type | Description |
|------|------|-------------|
| name | `string` | CSS container-name value (optional) |

## Examples

```html
<container-l></container-l>
<container-l name="myContainer"></container-l>
```

## Use Cases

Any layout where intrinsic solutions fall short. Relevant container query properties include size, wrapping, and typography -- not color or font-family. Use container queries to affect styles that are *relevant to changing container dimensions*.
