import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const selectShell = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    boxSizing: "border-box",
    minWidth: vars.component.input.minWidth,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    borderRadius: vars.radius.sm,
    background: vars.color.background,
    color: vars.color.foreground,
    fontFamily: vars.font.body,
    fontWeight: vars.font.weight.regular,
    lineHeight: vars.font.lineHeight.normal,
    cursor: "pointer",
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
        fontSize: vars.font.size.sm
      },
      md: {
        minHeight: vars.component.input.height.md,
        fontSize: vars.font.size.md
      },
      lg: {
        minHeight: vars.component.input.height.lg,
        fontSize: vars.font.size.lg
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

export const selectField = recipe({
  base: {
    appearance: "none",
    width: vars.layout.full,
    minWidth: vars.space.x0,
    border: vars.space.x0,
    background: vars.color.transparent,
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    outline: "none",
    cursor: "inherit",
    paddingRight: vars.space.x6,
    selectors: {
      "&:disabled": {
        cursor: "not-allowed"
      }
    }
  },
  variants: {
    size: {
      sm: { padding: vars.component.input.padding.sm },
      md: { padding: vars.component.input.padding.md },
      lg: { padding: vars.component.input.padding.lg }
    }
  },
  defaultVariants: { size: "md" }
});

export const selectIcon = style({
  position: "absolute",
  right: vars.space.x3,
  top: "50%",
  transform: "translateY(-50%)",
  width: vars.size.icon.sm,
  height: vars.size.icon.sm,
  color: vars.color.mutedForeground,
  pointerEvents: "none"
});

export type SelectSize = "sm" | "md" | "lg";
