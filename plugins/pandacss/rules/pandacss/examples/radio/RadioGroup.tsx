import { css } from "styled-system/css"
import { Stack, styled } from "styled-system/jsx"
import { radio } from "styled-system/recipes"

// Layout at the call site = the built-in Stack PATTERN (not a hand-rolled flex).
// fieldset/legend own the grouping semantics natively.
export function RadioGroup({ name, legend, options }: {
  name: string
  legend: string
  options: { value: string; label: string; defaultChecked?: boolean }[]
}) {
  return (
    <Stack as="fieldset" gap="2">
      <styled.legend textStyle="label.upper" color="fg.muted">{legend}</styled.legend>
      {options.map(o => (
        <label key={o.value} className={radio()} data-part="root">
          <input type="radio" name={name} value={o.value} defaultChecked={o.defaultChecked}
                 className={css({ srOnly: true })} />
          <span data-part="control" aria-hidden="true" />
          <span data-part="label">{o.label}</span>
        </label>
      ))}
    </Stack>
  )
}
