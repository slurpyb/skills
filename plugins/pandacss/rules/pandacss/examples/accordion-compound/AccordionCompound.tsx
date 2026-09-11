import { sva } from "styled-system/css"
import { createStyleContext } from "../lib/createStyleContext"

// The OTHER way to consume a slot recipe: createStyleContext distributes slot
// classes across compound subcomponents via React context — no threading the
// className map by hand. Use this when you want a <Accordion><Accordion.Item>…
// composable API. (defineParts is the alternative when you'd rather have one
// className on a single DOM subtree and no context — see ../accordion + ../tabs.)
const recipe = sva({
  slots: ["root", "item", "trigger", "content"],
  base: {
    root:    { display: "flex", flexDirection: "column" },
    item:    { borderBlockEndWidth: "1px", borderColor: "border.default" },
    trigger: { display: "flex", justifyContent: "space-between", paddingBlock: "3",
               textStyle: "label.upper", cursor: "pointer",
               _focusVisible: { focusRing: "inside" } },
    content: { paddingBlockEnd: "4", color: "fg.muted" },
  },
  variants: { size: { sm: { trigger: { paddingBlock: "2", fontSize: "sm" } }, md: {} } },
  defaultVariants: { size: "md" },
})

const { withProvider, withContext } = createStyleContext(recipe)

// withProvider injects the slot-class map into context (variant props live here).
// withContext reads its slot class from that context.
export const Accordion        = withProvider("div", "root")
export const AccordionItem    = withContext("details", "item")
export const AccordionTrigger = withContext("summary", "trigger")
export const AccordionContent = withContext("div", "content")

// usage:
// <Accordion size="sm">
//   <AccordionItem>
//     <AccordionTrigger><h3>Panel</h3></AccordionTrigger>
//     <AccordionContent>…</AccordionContent>
//   </AccordionItem>
// </Accordion>
