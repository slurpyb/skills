import { styled } from "styled-system/jsx"
import { menu } from "styled-system/recipes"

// defineParts bound to styled — no recipe() call. ARIA menu = JS commands, NOT
// navigation. JS owns roving tabindex + aria-checked + open/close.
const MenuRoot = styled("div", menu)

export function Menu() {
  return (
    <MenuRoot data-part="root">
      <div data-part="menu" role="menu">
        <div data-part="item" role="menuitem" tabIndex={0}>Rename</div>
        <hr data-part="separator" role="presentation" />
        <div data-part="item" role="menuitemradio" aria-checked="true"  tabIndex={-1}>View: List</div>
        <div data-part="item" role="menuitemradio" aria-checked="false" tabIndex={-1}>View: Grid</div>
      </div>
    </MenuRoot>
  )
}
