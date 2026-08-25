import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const inputShell = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: vars.space.x2,
    boxSizing: "border-box",
    minWidth: vars.component.input.minWidth,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    borderRadius: vars.radius.sm,
    background: vars.color.background,
    color: vars.color.foreground,
    fontFamily: vars.font.body,
    fontWeight: vars.font.weight.regular,
    lineHeight: vars.font.lineHeight.normal,
    cursor: "text",
    transition: vars.motion.transition.input,
    selectors: {
      "&:focus-within": {
        outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
        outlineOffset: vars.focus.ringOffset,
        borderColor: vars.color.ring,
        zIndex: vars.zIndex.focus
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: vars.opacity.disabled,
        background: vars.color.muted
      },
      "&[data-invalid='true']": {
        borderColor: vars.color.danger
      },
      "&[data-invalid='true']:focus-within": {
        outlineColor: vars.color.danger,
        borderColor: vars.color.danger
      }
    }
  },
  variants: {
    size: {
      sm: {
        minHeight: vars.component.input.height.sm,
        padding: vars.component.input.padding.sm,
        fontSize: vars.font.size.sm,
        gap: vars.space.x1
      },
      md: {
        minHeight: vars.component.input.height.md,
        padding: vars.component.input.padding.md,
        fontSize: vars.font.size.md
      },
      lg: {
        minHeight: vars.component.input.height.lg,
        padding: vars.component.input.padding.lg,
        fontSize: vars.font.size.lg,
        gap: vars.space.x3
      }
    },
    fullWidth: {
      true: { width: vars.layout.full, minWidth: vars.space.x0 },
      false: {}
    }
  },
  defaultVariants: {
    size: "md",
    fullWidth: false
  }
});

export const inputField = style({
  flex: 1,
  width: vars.layout.full,
  minWidth: vars.space.x0,
  border: vars.space.x0,
  padding: vars.space.x0,
  background: vars.color.transparent,
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
  outline: "none",
  selectors: {
    "&::placeholder": {
      color: vars.color.mutedForeground
    },
    "&:disabled": {
      cursor: "not-allowed"
    }
  }
});

export const inputIcon = recipe({
  base: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    color: vars.color.mutedForeground,
    lineHeight: vars.space.x0,
    pointerEvents: "none"
  },
  variants: {
    size: {
      sm: { width: vars.size.icon.sm, height: vars.size.icon.sm },
      md: { width: vars.size.icon.md, height: vars.size.icon.md },
      lg: { width: vars.size.icon.lg, height: vars.size.icon.lg }
    }
  },
  defaultVariants: { size: "md" }
});

export type InputSize = "sm" | "md" | "lg";
