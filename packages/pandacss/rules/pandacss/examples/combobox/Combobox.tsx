import { useId, useState } from "react"
import { css } from "styled-system/css"
import { styled } from "styled-system/jsx"
import { combobox } from "styled-system/recipes"

// Root binds the recipe via styled — `size` is a prop, no recipe() call in render.
// data-part/data-state pass straight through. JS owns every dynamic a11y attribute
// (data-state on root, aria-expanded + aria-activedescendant on input, aria-selected
// on option); one owner each; the recipe owns appearance only.
const ComboRoot = styled("div", combobox)

export function Combobox({ label, options, size }: {
  label: string
  options: string[]
  size?: "sm" | "md"
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const baseId = useId()

  const matches = options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
  const commit = (value: string) => { setQuery(value); setOpen(false) }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { setOpen(true); setActive(i => Math.min(i + 1, matches.length - 1)); e.preventDefault() }
    else if (e.key === "ArrowUp") { setActive(i => Math.max(i - 1, 0)); e.preventDefault() }
    else if (e.key === "Enter" && open && matches[active]) { commit(matches[active]); e.preventDefault() }
    else if (e.key === "Escape") { setOpen(false) }
  }

  return (
    <ComboRoot size={size} data-part="root" data-state={open ? "expanded" : "collapsed"}>
      <label htmlFor={`${baseId}-input`} className={css({ srOnly: true })}>{label}</label>

      <div data-part="control">
        <input
          data-part="input" id={`${baseId}-input`}
          type="text" role="combobox" autoComplete="off"
          aria-expanded={open} aria-controls={`${baseId}-listbox`}
          aria-activedescendant={open && matches.length ? `${baseId}-opt-${active}` : undefined}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActive(0) }}
          onKeyDown={onKeyDown}
        />
        <button data-part="trigger" type="button" tabIndex={-1}
                aria-label="Toggle options" onClick={() => setOpen(o => !o)}>
          <svg aria-hidden="true"><use href="#icon-chevron-down" /></svg>
        </button>
      </div>

      <div data-part="overlay">
        {matches.length ? (
          <ul data-part="listbox" id={`${baseId}-listbox`} role="listbox">
            {matches.map((opt, i) => (
              <li key={opt} data-part="option" id={`${baseId}-opt-${i}`}
                  role="option" aria-selected={i === active}
                  onMouseDown={e => { e.preventDefault(); commit(opt) }}>
                {opt}
              </li>
            ))}
          </ul>
        ) : (
          <p data-part="empty">No matches</p>
        )}
      </div>
    </ComboRoot>
  )
}
