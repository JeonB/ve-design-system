import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

export const cardRoot = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    borderRadius: vars.radius.md,
    color: vars.color.foreground,
    fontFamily: vars.font.body,
    minWidth: vars.space.x0
  },
  variants: {
    variant: {
      elevated: {
        background: vars.color.background,
        border: `${vars.size.border.hairline} solid ${vars.color.border}`,
        boxShadow: vars.shadow.sm
      },
      outline: {
        background: vars.color.background,
        border: `${vars.size.border.hairline} solid ${vars.color.border}`,
        boxShadow: vars.shadow.none
      },
      muted: {
        background: vars.color.muted,
        border: `${vars.size.border.hairline} solid ${vars.color.transparent}`,
        boxShadow: vars.shadow.none
      }
    },
    padding: {
      sm: { padding: vars.space.x3 },
      md: { padding: vars.space.x4 },
      lg: { padding: vars.space.x6 }
    },
    fullWidth: {
      true: { width: vars.layout.full },
      false: {}
    }
  },
  defaultVariants: {
    variant: "elevated",
    padding: "md",
    fullWidth: false
  }
});

export const cardHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x1,
  marginBottom: vars.space.x3
});

export const cardTitle = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.foreground
});

export const cardDescription = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground
});

export const cardBody = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x3,
  flex: 1
});

export const cardFooter = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: vars.space.x2,
  marginTop: vars.space.x4
});

export type CardVariant = "elevated" | "outline" | "muted";
export type CardPadding = "sm" | "md" | "lg";
