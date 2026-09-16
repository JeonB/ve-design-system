import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const choiceGroupRoot = recipe({
  base: {
    display: "flex",
    border: "none",
    margin: vars.space.x0,
    padding: vars.space.x0,
    minWidth: vars.space.x0
  },
  variants: {
    orientation: {
      vertical: { flexDirection: "column" },
      horizontal: { flexDirection: "row", flexWrap: "wrap" }
    },
    gap: {
      sm: { gap: vars.space.x2 },
      md: { gap: vars.space.x3 }
    },
    fullWidth: {
      true: { width: vars.layout.full },
      false: {}
    }
  },
  defaultVariants: {
    orientation: "vertical",
    gap: "sm",
    fullWidth: false
  }
});

export const choiceGroupLegend = style({
  padding: vars.space.x0,
  marginBottom: vars.space.x2,
  fontFamily: vars.font.body,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.foreground
});

export const choiceGroupItem = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.x2,
  fontFamily: vars.font.body,
  fontSize: vars.font.size.md,
  color: vars.color.foreground,
  cursor: "pointer",
  selectors: {
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: vars.opacity.disabled
    }
  }
});
