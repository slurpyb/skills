import { defineTokens } from "@pandacss/dev"

// Raw tokens — concrete values, an implementation detail of the theme.
// Components NEVER reference these directly; they go through semantic tokens.
// Palettes (full shade scales) exist so `colorPalette` virtual color can swap them.
export const tokens = defineTokens({
  colors: {
    ink:   { value: "rgb(38 38 38)" },
    paper: { value: "rgb(252 250 246)" },

    accent: {
      50:  { value: "rgb(239 246 255)" },
      100: { value: "rgb(219 234 254)" },
      200: { value: "rgb(191 219 254)" },
      500: { value: "rgb(37 99 235)" },
      600: { value: "rgb(29 78 216)" },
      700: { value: "rgb(30 64 175)" },
      800: { value: "rgb(30 58 138)" },
    },
    green: {
      100: { value: "rgb(220 252 231)" }, 200: { value: "rgb(187 247 208)" },
      500: { value: "rgb(34 197 94)" },  600: { value: "rgb(22 163 74)" },
      700: { value: "rgb(21 128 61)" },  800: { value: "rgb(22 101 52)" },
    },
    amber: {
      100: { value: "rgb(254 243 199)" }, 200: { value: "rgb(253 230 138)" },
      500: { value: "rgb(245 158 11)" },  600: { value: "rgb(217 119 6)" },
      700: { value: "rgb(180 83 9)" },    800: { value: "rgb(146 64 14)" }, 950: { value: "rgb(69 26 3)" },
    },
    red: {
      100: { value: "rgb(254 226 226)" }, 200: { value: "rgb(254 202 202)" },
      500: { value: "rgb(204 36 36)" },   600: { value: "rgb(185 28 28)" },
      700: { value: "rgb(160 24 24)" },   800: { value: "rgb(153 27 27)" },
    },
  },

  spacing: {
    1: { value: "0.25rem" }, 2: { value: "0.5rem" }, 3: { value: "0.75rem" },
    4: { value: "1rem" },    6: { value: "1.5rem" }, 8: { value: "2rem" },
  },

  durations: {
    fast:   { value: "120ms" },
    normal: { value: "200ms" },
    slow:   { value: "320ms" },
  },
})
