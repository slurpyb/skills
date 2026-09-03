import { styled } from "styled-system/jsx"
import { checkbox } from "styled-system/recipes"

// styled-bind on the <label> root; facade reads the native input's state. The
// `hidden`-free facade still works with no CSS (progressive enhancement) because
// the real input is present and only visually hidden via the recipe.
const CheckboxRoot = styled("label", checkbox)

export function Checkbox({ name, label, ...rest }: {
  name: string
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <CheckboxRoot data-part="root">
      <input data-part="control" type="checkbox" name={name} {...rest} />
      <span data-part="facade" aria-hidden="true"><svg><use href="#icon-check" /></svg></span>
      <span data-part="label">{label}</span>
    </CheckboxRoot>
  )
}

// usage:
// <Checkbox name="freeshipping" label="Free shipping" defaultChecked />
