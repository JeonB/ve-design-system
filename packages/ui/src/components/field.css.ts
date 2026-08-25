import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const fieldRoot = recipe({
  base: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: vars.space.x1,
    minWidth: vars.space.x0
  },
  variants: {
    fullWidth: {
      true: { width: vars.layout.full },
      false: {}
    }
  },
  defaultVariants: {
    fullWidth: false
  }
});

export const fieldLabel = style({
  fontFamily: vars.font.body,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.foreground
});

export const fieldDescription = style({
  fontFamily: vars.font.body,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground,
  margin: vars.space.x0
});

export const fieldError = style({
  fontFamily: vars.font.body,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.danger,
  margin: vars.space.x0
});
