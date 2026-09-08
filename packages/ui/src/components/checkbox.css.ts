import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const checkboxRoot = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxSizing: "border-box",
    margin: vars.space.x0,
    borderRadius: vars.radius.sm,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    background: vars.color.background,
    color: vars.color.primaryForeground,
    cursor: "pointer",
    transition: vars.motion.transition.input,
    selectors: {
      "&:focus-within": {
        outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
        outlineOffset: vars.focus.ringOffset
      },
      "&:has(input:checked), &:has(input:indeterminate)": {
        background: vars.color.primary,
        borderColor: vars.color.primary
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: vars.opacity.disabled
      },
      "&[data-invalid='true']": {
        borderColor: vars.color.danger
      },
      "&[data-invalid='true']:has(input:checked)": {
        background: vars.color.danger,
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

export const checkboxInput = style({
  position: "absolute",
  inset: vars.space.x0,
  width: vars.layout.full,
  height: vars.layout.full,
  margin: vars.space.x0,
  opacity: 0,
  cursor: "inherit"
});

export const checkboxIndicator = style({
  display: "none",
  width: "60%",
  height: "60%",
  pointerEvents: "none",
  selectors: {
    [`${checkboxRoot.classNames.base}:has(input:checked) &, ${checkboxRoot.classNames.base}:has(input:indeterminate) &`]:
      {
        display: "block"
      }
  }
});

export type CheckboxSize = "sm" | "md";
