import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const switchRoot = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    flexShrink: 0,
    boxSizing: "border-box",
    margin: vars.space.x0,
    padding: "2px",
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    borderRadius: vars.radius.full,
    background: vars.color.muted,
    cursor: "pointer",
    transition: vars.motion.transition.input,
    selectors: {
      "&:focus-visible": {
        outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
        outlineOffset: vars.focus.ringOffset
      },
      "&[data-checked='true']": {
        background: vars.color.primary,
        borderColor: vars.color.primary,
        justifyContent: "flex-end"
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: vars.opacity.disabled
      }
    }
  },
  variants: {
    size: {
      sm: {
        width: vars.component.switch.width.sm,
        height: vars.component.switch.height.sm
      },
      md: {
        width: vars.component.switch.width.md,
        height: vars.component.switch.height.md
      }
    }
  },
  defaultVariants: { size: "md" }
});

export const switchThumb = recipe({
  base: {
    display: "block",
    borderRadius: vars.radius.full,
    background: vars.color.background,
    boxShadow: vars.shadow.sm,
    flexShrink: 0
  },
  variants: {
    size: {
      sm: { width: "12px", height: "12px" },
      md: { width: "16px", height: "16px" }
    }
  },
  defaultVariants: { size: "md" }
});

export type SwitchSize = "sm" | "md";
