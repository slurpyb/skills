import { styled } from "styled-system/jsx"
import { tabs } from "styled-system/recipes"

// defineParts recipe bound to styled — single className on the root, parts via
// data-part, no recipe() call in render. STATEFUL component (vs "fake tabs" =
// nav links): owes a keyboard model — arrows move focus + selection, roving
// tabindex keeps one tab tabbable. JS owns aria-selected + tabindex.
const TabsRoot = styled("div", tabs)

export function Tabs({ items }: { items: { id: string; label: string; content: React.ReactNode }[] }) {
  return (
    <TabsRoot data-part="root">
      <div data-part="list" role="tablist">
        {items.map((t, i) => (
          <button key={t.id} data-part="tab" role="tab"
                  id={`${t.id}-tab`} aria-controls={`${t.id}-panel`}
                  aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1}>
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div key={t.id} data-part="panel" role="tabpanel"
             id={`${t.id}-panel`} aria-labelledby={`${t.id}-tab`} hidden={i !== 0} tabIndex={0}>
          {t.content}
        </div>
      ))}
    </TabsRoot>
  )
}
