import { defineConfig } from "@pandacss/dev"

import { tokens } from "./tokens"
import { semanticTokens } from "./semantic-tokens"
import { textStyles } from "./text-styles"
import { layerStyles } from "./layer-styles"
import { animationStyles, keyframes } from "./animation-styles"

// Config recipes live in theme/preset/recipes/*.ts in real use and are wired here.
// (In this example library each widget colocates its recipe for review; the import
//  paths below show where they would resolve from in a real project.)
import { iconButton }  from "../icon-button/icon-button.recipe"
import { inlineNotice } from "../inline-notice/inline-notice.recipe"
import { pageNotice }  from "../page-notice/page-notice.recipe"
import { combobox }    from "../combobox/combobox.recipe"
import { menu }        from "../menu/menu.recipe"
import { tabs }        from "../tabs/tabs.recipe"
import { radio }       from "../radio/radio.recipe"
import { checkbox }    from "../checkbox/checkbox.recipe"
import { dialog }      from "../dialog/dialog.recipe"
import { accordion }   from "../accordion/accordion.recipe"

// Custom layout patterns (definePattern). `container` overrides the built-in.
import { appShell }     from "../patterns/app-shell/app-shell.pattern"
import { cardGrid }     from "../patterns/card-grid/card-grid.pattern"
import { container }    from "../patterns/container-override/container.pattern"
import { subgrid }      from "../patterns/subgrid/subgrid.pattern"
import { masonry }      from "../patterns/masonry/masonry.pattern"
import { textColumns }  from "../patterns/text-columns/text-columns.pattern"
import { snapRow }      from "../patterns/snap-row/snap-row.pattern"
import { stickyTop }    from "../patterns/sticky-top/sticky-top.pattern"
import { fluidSection } from "../patterns/fluid-stack/fluid-stack.pattern"
import { zIndexTokens } from "../patterns/z-index.tokens"

export default defineConfig({
  preflight: true,
  jsxFramework: "react",
  include: ["./**/*.{ts,tsx}"],

  // Custom conditions — one place for the data-attribute selectors components react to.
  conditions: {
    extend: {
      checked:  "&[aria-checked=true]",
      expanded: "&[data-state=expanded]",
      current:  "&[aria-current=page]",
    },
  },

  theme: {
    extend: {
      tokens: { ...tokens, zIndex: zIndexTokens },   // z-index is a token category, not utilities
      semanticTokens,
      textStyles,
      layerStyles,
      animationStyles,
      keyframes,
      recipes: {
        iconButton, inlineNotice, pageNotice, combobox, menu, tabs, radio, checkbox, dialog, accordion,
      },
    },
  },

  // Layout patterns live under the top-level `patterns` key (sibling of `theme`).
  // `container` here REPLACES the built-in container with our project defaults.
  patterns: {
    extend: {
      appShell, cardGrid, container, subgrid, masonry, textColumns, snapRow, stickyTop, fluidSection,
    },
  },

  // Custom utility — see define-utility/focus-ring.util.ts for the rationale.
  // A single `focusRing: "inside" | "outside"` shorthand keeps focus styling
  // consistent across every component instead of hand-writing outline rules.
  utilities: {
    extend: {
      focusRing: {
        className: "focus-ring",
        values: ["inside", "outside"],
        transform(value: string) {
          const inset = value === "inside" ? "-2px" : "2px"
          return {
            outline: "2px solid",
            outlineColor: "accent.500",
            outlineOffset: inset,
          }
        },
      },
    },
  },
})
