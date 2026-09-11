import { dialog } from "styled-system/recipes"
import { createStyleContext } from "../lib/createStyleContext"

// Consumed via context — tone variant on the provider, parts via subcomponents,
// no recipe() call in render. JS owns focus trap + the data-state attribute.
const { withProvider, withContext } = createStyleContext(dialog)

export const DialogWindow = withProvider("div", "window")   // provider on the window
export const DialogHeader = withContext("div", "header")
export const DialogTitle  = withContext("h2", "title")
export const DialogMain   = withContext("div", "main")
export const DialogFooter = withContext("div", "footer")

// usage — alert vs confirm = the SAME anatomy, only tone + footer buttons differ:
// <DialogWindow tone="danger" role="alertdialog" aria-modal="true" aria-labelledby="t">
//   <DialogHeader><DialogTitle id="t">Delete item?</DialogTitle></DialogHeader>
//   <DialogMain>This can't be undone.</DialogMain>
//   <DialogFooter>
//     <IconButton .../>  {/* or buttons */}
//   </DialogFooter>
// </DialogWindow>
