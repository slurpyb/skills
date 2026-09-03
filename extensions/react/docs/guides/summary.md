---
title: "Summary"
---

### What you can do

```tsx
// ✅ Good: Conditional styles
<styled.div color={{ base: "red.100", md: "red.200" }} />

// ✅ Good: Arbitrary value
<styled.div color="#121qsd" />

// ✅ Good: Arbitrary selector
<styled.div css={{ "&[data-thing] > span": { color: "red.100" } }} />

// ✅ Good: Runtime value (with config.`staticCss`)
const Button = () => {
  const [color, setColor] = useState('red.300')
  return <styled.button color={color} />
}

// ✅ Good: Runtime condition
<styled.div color={{ base: "red.100", md: isHovered ? "red.200" : "red.300" }} />

// ✅ Good: Referenced value
<styled.div color={mainColor} />

```

### What you can't do

```tsx
// ❌ Avoid: Runtime value (without config.`staticCss`)
const Button = () => {
  const [color, setColor] = useState('red.300')
  return <styled.button color={color} />
}

// ❌ Avoid: Referenced value (not statically analyzable or from another file)
<styled.div color={getColor()} />
<styled.div color={colors[getColorName()]} />
<styled.div color={colors[colorFromAnotherFile]} />

const CustomCircle = (props) => {
  const { circleSize = '3' } = props
  return (
    <Circle
      // ❌ Avoid: Panda can't determine the value of circleSize at build-time
      size={circleSize}
    />
  )
}
```