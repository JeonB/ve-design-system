import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

/** Input shell과 동일 토큰·셀렉터. 멀티라인용 align/minHeight만 다르다. */
export const textareaShell = recipe({
  base: {
    display: "inline-flex",
    alignItems: "flex-start",
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
        minHeight: vars.component.textarea.minHeight.sm,
        padding: vars.component.input.padding.sm,
        fontSize: vars.font.size.sm
      },
      md: {
        minHeight: vars.component.textarea.minHeight.md,
        padding: vars.component.input.padding.md,
        fontSize: vars.font.size.md
      },
      lg: {
        minHeight: vars.component.textarea.minHeight.lg,
        padding: vars.component.input.padding.lg,
        fontSize: vars.font.size.lg
      }
    },
    fullWidth: {
      true: { width: vars.layout.full, minWidth: vars.space.x0 },
      false: {}
    },
    resize: {
      none: {},
      vertical: {},
      both: {}
    }
  },
  defaultVariants: {
    size: "md",
    fullWidth: false,
    resize: "vertical"
  }
});

export const textareaField = style({
  flex: 1,
  width: vars.layout.full,
  minWidth: vars.space.x0,
  minHeight: vars.layout.full,
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
    },
    [`${textareaShell.classNames.base}[data-resize='none'] &`]: {
      resize: "none"
    },
    [`${textareaShell.classNames.base}[data-resize='vertical'] &`]: {
      resize: "vertical"
    },
    [`${textareaShell.classNames.base}[data-resize='both'] &`]: {
      resize: "both"
    }
  }
});

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaResize = "none" | "vertical" | "both";
