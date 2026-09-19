import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

const slideIn = keyframes({
  from: { opacity: 0, transform: "translateY(8px)" },
  to: { opacity: 1, transform: "translateY(0)" }
});

export const toastViewport = style({
  position: "fixed",
  right: vars.space.x4,
  bottom: vars.space.x4,
  zIndex: vars.zIndex.toast,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2,
  width: "min(100% - 2rem, 22rem)",
  pointerEvents: "none"
});

export const toastItem = recipe({
  base: {
    pointerEvents: "auto",
    display: "grid",
    gap: vars.space.x1,
    padding: vars.space.x4,
    borderRadius: vars.radius.md,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    boxShadow: vars.shadow.md,
    background: vars.color.background,
    color: vars.color.foreground,
    fontFamily: vars.font.body,
    animation: `${slideIn} 120ms ease`
  },
  variants: {
    variant: {
      neutral: {},
      success: {
        borderColor: vars.color.success,
        background: vars.color.successSubtle,
        color: vars.color.success
      },
      warning: {
        borderColor: vars.color.warning,
        background: vars.color.warningSubtle,
        color: vars.color.warning
      },
      danger: {
        borderColor: vars.color.danger,
        background: vars.color.dangerSubtle,
        color: vars.color.danger
      }
    }
  },
  defaultVariants: { variant: "neutral" }
});

export const toastTitle = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight
});

export const toastDescription = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground
});

export type ToastVariant = "neutral" | "success" | "warning" | "danger";
