import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const tabsRoot = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x3,
  width: vars.layout.full,
  fontFamily: vars.font.body,
  color: vars.color.foreground
});

export const tabsList = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  gap: vars.space.x1,
  borderBottom: `${vars.size.border.hairline} solid ${vars.color.border}`
});

export const tabsTrigger = recipe({
  base: {
    appearance: "none",
    margin: vars.space.x0,
    border: "none",
    borderBottom: `2px solid ${vars.color.transparent}`,
    background: vars.color.transparent,
    color: vars.color.mutedForeground,
    cursor: "pointer",
    fontFamily: vars.font.body,
    fontSize: vars.font.size.md,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    padding: `${vars.space.x2} ${vars.space.x3}`,
    marginBottom: "-1px",
    transition: vars.motion.transition.button,
    selectors: {
      "&:hover:not(:disabled)": {
        color: vars.color.foreground
      },
      "&:focus-visible": {
        outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
        outlineOffset: vars.focus.ringOffset
      },
      "&:disabled": {
        opacity: vars.opacity.disabled,
        cursor: "not-allowed"
      }
    }
  },
  variants: {
    active: {
      true: {
        color: vars.color.foreground,
        borderBottomColor: vars.color.primary
      },
      false: {}
    }
  },
  defaultVariants: {
    active: false
  }
});

export const tabsContent = style({
  fontSize: vars.font.size.md,
  lineHeight: vars.font.lineHeight.normal
});
