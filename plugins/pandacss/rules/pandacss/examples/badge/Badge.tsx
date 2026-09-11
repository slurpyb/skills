import { cva, cx } from "styled-system/css"
import { css } from "styled-system/css"

// splitVariantProps escape hatch: when a custom component must do EXTRA work
// (here: merge a conditional className) you can't use a plain styled-bind, so you
// split variant props from DOM props, then apply the recipe. This is the one
// blessed in-body recipe call — for a simple variant component, prefer
// `styled("span", badgeRecipe)` instead.
const badgeRecipe = cva({
  base: { display: "inline-flex", alignItems: "center", rounded: "full",
          paddingInline: "2", paddingBlock: "0.5", textStyle: "label.upper" },
  variants: {
    tone: {
      neutral: { bg: "bg.muted",   color: "fg.default" },
      info:    { bg: "accent.100", color: "accent.800" },
      success: { bg: "green.100",  color: "green.800" },
    },
  },
  defaultVariants: { tone: "neutral" },
})

export function Badge({ pulse, className, ...props }: {
  tone?: "neutral" | "info" | "success"
  pulse?: boolean
} & React.HTMLAttributes<HTMLSpanElement>) {
  const [variantProps, rest] = badgeRecipe.splitVariantProps(props)
  return (
    <span
      className={cx(
        badgeRecipe(variantProps),
        pulse && css({ animationStyle: "fade-in" }),
        className,
      )}
      {...rest}
    />
  )
}

// usage:
// <Badge tone="success">Live</Badge>
// <Badge tone="info" pulse>New</Badge>
