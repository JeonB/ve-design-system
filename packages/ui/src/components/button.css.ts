import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const spin = keyframes({
  to: { transform: "rotate(360deg)" }
});

export const spinnerStyles = recipe({
  base: {
    display: "inline-block",
    borderRadius: "50%",
    borderStyle: "solid",
    borderColor: "currentColor",
    borderTopColor: "transparent",
    animation: `${spin} 600ms linear infinite`,
    flexShrink: 0
  },
  variants: {
    size: {
      sm: {
        width: "14px",
        height: "14px",
        borderWidth: "2px"
      },
      md: {
        width: "16px",
        height: "16px",
        borderWidth: "2px"
      },
      lg: {
        width: "18px",
        height: "18px",
        borderWidth: "2px"
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export type SpinnerStyleVariants = RecipeVariants<typeof spinnerStyles>;

const base = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.x2,
  border: "1px solid transparent",
  borderRadius: vars.radius.sm,
  fontFamily: vars.font.body,
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap",
  userSelect: "none",
  cursor: "pointer",
  transition:
    "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: "2px"
    },
    "&:disabled, &[aria-disabled='true']": {
      cursor: "not-allowed",
      opacity: 0.55,
      pointerEvents: "none"
    }
  }
});

export const buttonIconSlot = style({
  display: "inline-flex",
  flexShrink: 0,
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 0
});

export const buttonLabel = style({
  display: "inline-flex",
  alignItems: "center",
  selectors: {
    [`${base}[data-loading='true'] &`]: {
      visibility: "hidden"
    }
  }
});

export const buttonSpinnerOverlay = style({
  position: "absolute",
  inset: 0,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center"
});

export const buttonStyles = recipe({
  base,
  variants: {
    variant: {
      solid: {
        background: vars.color.primary,
        color: vars.color.primaryForeground,
        borderColor: vars.color.primary,
        selectors: {
          "&:hover:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.primaryHover,
            borderColor: vars.color.primaryHover
          },
          "&:active:not(:disabled):not([aria-disabled='true'])": {
            filter: "brightness(0.92)"
          }
        }
      },
      outline: {
        background: vars.color.background,
        color: vars.color.foreground,
        borderColor: vars.color.border,
        selectors: {
          "&:hover:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.muted
          },
          "&:active:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.ghostHover
          }
        }
      },
      ghost: {
        background: "transparent",
        color: vars.color.foreground,
        borderColor: "transparent",
        selectors: {
          "&:hover:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.ghostHover
          },
          "&:active:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.muted
          }
        }
      },
      danger: {
        background: vars.color.danger,
        color: vars.color.dangerForeground,
        borderColor: vars.color.danger,
        selectors: {
          "&:hover:not(:disabled):not([aria-disabled='true'])": {
            background: vars.color.dangerHover,
            borderColor: vars.color.dangerHover
          },
          "&:active:not(:disabled):not([aria-disabled='true'])": {
            filter: "brightness(0.92)"
          }
        }
      },
      link: {
        background: "transparent",
        color: vars.color.primary,
        borderColor: "transparent",
        paddingInline: 0,
        minHeight: "auto",
        selectors: {
          "&:hover:not(:disabled):not([aria-disabled='true'])": {
            textDecoration: "underline",
            textUnderlineOffset: "3px"
          }
        }
      }
    },
    size: {
      sm: {
        minHeight: "32px",
        padding: `${vars.space.x1} ${vars.space.x3}`,
        fontSize: "13px",
        gap: vars.space.x1
      },
      md: {
        minHeight: "40px",
        padding: `${vars.space.x2} ${vars.space.x4}`,
        fontSize: "14px"
      },
      lg: {
        minHeight: "48px",
        padding: `${vars.space.x3} ${vars.space.x6}`,
        fontSize: "16px",
        gap: vars.space.x3
      },
      icon: {
        minHeight: "40px",
        minWidth: "40px",
        padding: vars.space.x2
      }
    },
    fullWidth: {
      true: { width: "100%" },
      false: {}
    },
    loading: {
      true: { cursor: "wait" },
      false: {}
    }
  },
  compoundVariants: [
    {
      variants: { variant: "link", size: "sm" },
      style: { minHeight: "auto", padding: 0, fontSize: "13px" }
    },
    {
      variants: { variant: "link", size: "md" },
      style: { minHeight: "auto", padding: 0, fontSize: "14px" }
    },
    {
      variants: { variant: "link", size: "lg" },
      style: { minHeight: "auto", padding: 0, fontSize: "16px" }
    },
    {
      variants: { size: "icon", variant: "solid" },
      style: { borderRadius: vars.radius.sm }
    },
    {
      variants: { size: "icon", variant: "outline" },
      style: { minHeight: "40px", minWidth: "40px" }
    },
    {
      variants: { size: "icon", variant: "ghost" },
      style: { minHeight: "40px", minWidth: "40px" }
    },
    {
      variants: { size: "sm", variant: "solid" },
      style: { minHeight: "32px" }
    },
    {
      variants: { size: "lg", variant: "solid" },
      style: { minHeight: "48px" }
    }
  ],
  defaultVariants: {
    variant: "solid",
    size: "md",
    fullWidth: false,
    loading: false
  }
});

export type ButtonStyleVariants = RecipeVariants<typeof buttonStyles>;
