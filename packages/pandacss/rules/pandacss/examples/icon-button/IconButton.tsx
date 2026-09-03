import { styled } from "styled-system/jsx"
import { iconButton } from "styled-system/recipes"

// Bind the recipe to a styled element. `tone`/`size` surface as typed props;
// the recipe is NEVER called in a component body. Ref forwards automatically.
export const IconButton = styled("button", iconButton)

// usage — variants are props, behavior is the native button's:
// <IconButton tone="danger" size="sm" type="button" aria-label="Delete">
//   <svg aria-hidden="true"><use href="#icon-trash" /></svg>
// </IconButton>
