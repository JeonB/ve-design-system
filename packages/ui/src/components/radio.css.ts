import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const radioRoot = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxSizing: "border-box",
    margin: vars.space.x0,
    borderRadius: vars.radius.full,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    background: vars.color.background,
    cursor: "pointer",
    transition: vars.motion.transition.input,
    selectors: {
      "&:focus-within": {
        outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
        outlineOffset: vars.focus.ringOffset
      },
      "&:has(input:checked)": {
        borderColor: vars.color.primary
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: vars.opacity.disabled
      },
      "&[data-invalid='true']": {
        borderColor: vars.color.danger
      }
    }
  },
  variants: {
    size: {
      sm: {
        width: vars.component.checkbox.size.sm,
        height: vars.component.checkbox.size.sm
      },
      md: {
        width: vars.component.checkbox.size.md,
        height: vars.component.checkbox.size.md
      }
    }
  },
  defaultVariants: { size: "md" }
});

export const radioInput = style({
  position: "absolute",
  inset: vars.space.x0,
  width: vars.layout.full,
  height: vars.layout.full,
  margin: vars.space.x0,
  opacity: 0,
  cursor: "inherit"
});

export const radioDot = style({
  width: "50%",
  height: "50%",
  borderRadius: vars.radius.full,
  background: vars.color.primary,
  transform: "scale(0)",
  transition: "transform 120ms ease",
  pointerEvents: "none",
  selectors: {
    [`${radioRoot.classNames.base}:has(input:checked) &`]: {
      transform: "scale(1)"
    },
    [`${radioRoot.classNames.base}[data-invalid='true']:has(input:checked) &`]: {
      background: vars.color.danger
    }
  }
});
