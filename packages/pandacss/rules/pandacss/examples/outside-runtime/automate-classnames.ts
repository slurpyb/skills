// Automating hand-applied class names from Panda's own metadata.
//
// Instead of hardcoding "icon-btn icon-btn--tone-danger" in templates, derive the
// strings from what `panda spec` / `panda ship` emit, so a non-runtime surface
// tracks the recipes automatically — change a variant, regenerate, done.
//
//   panda spec                                   # theme/recipe/slot/part spec files
//   panda ship --outfile dist/panda.buildinfo.json   # extract/build info
//
// Field names below model the parts that matter (className, variants, slots).
// Read the actual keys from the emitted file in your project — this is the shape,
// not a fixed schema.

type RecipeMeta = {
  className: string
  variants: Record<string, string[]>            // key -> values
}
type SlotRecipeMeta = {
  className: string
  slots: string[]
  variants: Record<string, string[]>
}
type PartsRecipeMeta = {
  className: string
  parts: string[]                                // for reference / data-part emission
}

// ── class-name builders (mirror what the runtime recipe fns return) ───────────

// defineRecipe → base + `name--key-value` per chosen variant
export function recipeClass(meta: RecipeMeta, props: Record<string, string>): string {
  const out = [meta.className]
  for (const [key, value] of Object.entries(props)) {
    if (meta.variants[key]?.includes(value)) out.push(`${meta.className}--${key}-${value}`)
  }
  return out.join(" ")
}

// defineSlotRecipe → per-slot: `name__slot` + `name__slot--key-value`
export function slotClasses(meta: SlotRecipeMeta, props: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const slot of meta.slots) {
    const out = [`${meta.className}__${slot}`]
    for (const [key, value] of Object.entries(props)) {
      if (meta.variants[key]?.includes(value)) out.push(`${meta.className}__${slot}--${key}-${value}`)
    }
    map[slot] = out.join(" ")
  }
  return map
}

// defineParts → a single class; parts are addressed by attribute, not class
export function partsClass(meta: PartsRecipeMeta): string {
  return meta.className
}

// ── example: fed by spec/ship metadata, reproduces the .html strings ──────────

const iconBtn: RecipeMeta = { className: "icon-btn", variants: { tone: ["neutral", "danger"], size: ["sm", "md"] } }
const dialog:  SlotRecipeMeta = { className: "dialog", slots: ["backdrop", "window", "header", "title", "main", "footer"], variants: { tone: ["neutral", "danger"] } }
const combobox: PartsRecipeMeta = { className: "combobox", parts: ["root", "control", "input", "trigger", "overlay", "listbox", "option"] }

recipeClass(iconBtn, { tone: "danger", size: "md" })
// → "icon-btn icon-btn--tone-danger icon-btn--size-md"      (recipe.html)

slotClasses(dialog, { tone: "danger" }).title
// → "dialog__title dialog__title--tone-danger"               (slot-recipe.html)

partsClass(combobox)
// → "combobox"  (root); descendants carry data-part="..."    (recipe-parts.html)

// In a real pipeline these builders are generated FROM the spec/ship output (a
// codegen step), then emitted as a template helper / JSON map the non-runtime
// surface consumes — no string is hand-written or hand-maintained.
