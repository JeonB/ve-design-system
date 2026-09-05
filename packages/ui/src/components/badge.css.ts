import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const badgeStyles = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.space.x1,
    boxSizing: "border-box",
    borderRadius: vars.radius.full,
    border: `${vars.size.border.hairline} solid ${vars.color.transparent}`,
    fontFamily: vars.font.body,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    whiteSpace: "nowrap",
    verticalAlign: "middle"
  },
  variants: {
    variant: {
      neutral: {
        background: vars.color.muted,
        color: vars.color.mutedForeground
      },
      primary: {
        background: vars.color.primarySubtle,
        color: vars.color.primary
      },
      success: {
        background: vars.color.successSubtle,
        color: vars.color.success
      },
      warning: {
        background: vars.color.warningSubtle,
        color: vars.color.warning
      },
      danger: {
        background: vars.color.dangerSubtle,
        color: vars.color.danger
      },
      outline: {
        background: vars.color.transparent,
        color: vars.color.foreground,
        borderColor: vars.color.border
      }
    },
    size: {
      sm: {
        minHeight: "20px",
        paddingInline: vars.space.x2,
        fontSize: vars.font.size.sm
      },
      md: {
        minHeight: "24px",
        paddingInline: vars.space.x3,
        fontSize: vars.font.size.md
      }
    }
  },
  defaultVariants: {
    variant: "neutral",
    size: "md"
  }
});

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger" | "outline";
export type BadgeSize = "sm" | "md";

export const BADGE_VARIANTS = [
  "neutral",
  "primary",
  "success",
  "warning",
  "danger",
  "outline"
] as const satisfies readonly BadgeVariant[];
