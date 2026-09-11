# The Frame

Enforces an aspect ratio on any element using `aspect-ratio`, with `object-fit: cover` for media cropping and flexbox centering for non-replaced content.

## Aspect Ratio

The `aspect-ratio` property sets a ratio without hard-coding width and height:

```css
.frame {
  aspect-ratio: 16 / 9;
}
```

### Legacy Padding Technique

Before `aspect-ratio`, vertical padding (relative to element width) was used:

```css
.frame {
  padding-bottom: calc(var(--n) / var(--d) * 100%);
}
```

`padding-bottom: 56.25%` creates a 16:9 ratio (9 / 16 = 0.5625).

## Cropping Media

For `<img>` and `<video>`, use `object-fit: cover` to crop without distortion:

```css
.frame {
  aspect-ratio: 16 / 9;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

## Non-Replaced Content

For normal elements, use Flexbox centering with `overflow: hidden`:

```css
.frame {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

Any element placed inside will be centered and cropped where it exceeds the frame dimensions.

## Responsive Aspect Ratio

Change the ratio based on viewport orientation:

```css
@media (orientation: portrait) {
  .frame {
    aspect-ratio: 1 / 1;
  }
}
```

## Generator CSS

```css
.frame {
  --n: 16;
  --d: 9;
  aspect-ratio: var(--n) / var(--d);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.frame > img,
.frame > video {
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

## Component API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ratio | `string` | `"16:9"` | The element's aspect ratio |

## Examples

```html
<frame-l ratio="4:3">
  <img src="/path/to/image" alt="description" />
</frame-l>
```

## Use Cases

Cropping images and videos to a consistent aspect ratio. Cards with image placeholders where some cards have text fallbacks instead. Canvas elements.
