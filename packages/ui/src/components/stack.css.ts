import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const stackStyles = recipe({
  base: {
    display: "flex",
    minWidth: vars.space.x0,
    boxSizing: "border-box"
  },
  variants: {
    direction: {
      vertical: { flexDirection: "column" },
      horizontal: { flexDirection: "row" }
    },
    gap: {
      none: { gap: vars.space.x0 },
      sm: { gap: vars.space.x2 },
      md: { gap: vars.space.x3 },
      lg: { gap: vars.space.x5 }
    },
    align: {
      start: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" }
    },
    justify: {
      start: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      between: { justifyContent: "space-between" }
    },
    wrap: {
      true: { flexWrap: "wrap" },
      false: { flexWrap: "nowrap" }
    },
    fullWidth: {
      true: { width: vars.layout.full },
      false: {}
    }
  },
  defaultVariants: {
    direction: "vertical",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: false,
    fullWidth: false
  }
});

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "sm" | "md" | "lg";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between";
