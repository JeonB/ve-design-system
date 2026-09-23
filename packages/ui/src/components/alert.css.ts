import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const ALERT_VARIANTS = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger"
] as const;

export type AlertVariant = (typeof ALERT_VARIANTS)[number];

export const alertStyles = recipe({
  base: {
    display: "grid",
    gap: vars.space.x1,
    boxSizing: "border-box",
    width: vars.layout.full,
    padding: vars.space.x4,
    borderRadius: vars.radius.md,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    fontFamily: vars.font.body,
    color: vars.color.foreground
  },
  variants: {
    variant: {
      neutral: {
        background: vars.color.muted,
        borderColor: vars.color.border
      },
      info: {
        background: vars.color.primarySubtle,
        borderColor: vars.color.primary
      },
      success: {
        background: vars.color.successSubtle,
        borderColor: vars.color.success
      },
      warning: {
        background: vars.color.warningSubtle,
        borderColor: vars.color.warning
      },
      danger: {
        background: vars.color.dangerSubtle,
        borderColor: vars.color.danger
      }
    }
  },
  defaultVariants: {
    variant: "neutral"
  }
});

export const alertTitle = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight
});

export const alertTitleTone = recipe({
  base: {},
  variants: {
    variant: {
      neutral: { color: vars.color.foreground },
      info: { color: vars.color.primary },
      success: { color: vars.color.success },
      warning: { color: vars.color.warning },
      danger: { color: vars.color.danger }
    }
  },
  defaultVariants: { variant: "neutral" }
});

export const alertDescription = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground
});
