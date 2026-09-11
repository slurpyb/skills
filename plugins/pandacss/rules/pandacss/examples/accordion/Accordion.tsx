import { accordion } from "styled-system/recipes"
import { createStyleContext } from "../lib/createStyleContext"

// Config slot recipe consumed via createStyleContext — compound API, per-slot
// classes distributed through context, no recipe() call in render. Variant props
// (size) live on the provider root. Behavior stays the native <details>'s.
const { withProvider, withContext } = createStyleContext(accordion)

export const Accordion        = withProvider("ul", "root")       // role="list"
export const AccordionItem    = withContext("li", "item")
export const AccordionSummary = withContext("summary", "summary")
export const AccordionPanel   = withContext("div", "panel")

// usage — native <details> owns open/close; styling reacts to its [open] attribute:
// <Accordion size="sm" role="list">
//   <AccordionItem>
//     <details>
//       <AccordionSummary>
//         <h3>Panel 1</h3>
//         <svg aria-hidden="true"><use href="#icon-chevron-down" /></svg>
//       </AccordionSummary>
//       <AccordionPanel>…</AccordionPanel>
//     </details>
//   </AccordionItem>
// </Accordion>
