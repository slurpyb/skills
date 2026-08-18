# Responsive images

Confirm the current props with `consult-astro-docs` before writing config. This file is the decision, not the API.

## Let Astro generate the srcset

Set `layout` on `<Image />` or `<Picture />`, or `image.layout` for the whole project, and Astro derives `srcset` and `sizes` from the image dimensions and the layout type. A project-wide `image.layout` also covers Markdown `![]()` images.

| `layout` | Behaviour | Use for |
|---|---|---|
| `constrained` | Scales down to the container, never past `width`/`height` | The default choice |
| `full-width` | Scales to the container width | Heroes, full-bleed art |
| `fixed` | Keeps the requested dimensions, `srcset` for pixel density only | Icons, logos |
| `none` | No `srcset`, no `sizes`, no styles | Opting one image out of a project-wide layout |

Every layout multiplies build output: one image becomes several. On prerendered pages that costs build time; on demand it costs a transform per view.

## Turn the styles on

`image.responsiveStyles` defaults to `false`, and a layout without it emits a `srcset` that never actually resizes. Set it to `true` unless you are styling images yourself.

Astro's rules use `:where()`, so any selector of yours outranks them — except under Tailwind 4, whose cascade layers rank *below* unlayered rules. On Tailwind 4, leave `responsiveStyles` off and size images with Tailwind.

Override per image with the `fit` and `position` props.

## Hand-written widths

Only when a layout cannot express the case:

- `widths` requires `sizes`.
- `widths` and `densities` are mutually exclusive.
- Widths above the original are dropped. The default service crops but never upscales.
