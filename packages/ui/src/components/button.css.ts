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
      sm: { width: "14px", height: "14px", borderWidth: "2px" },
      md: { width: "16px", height: "16px", borderWidth: "2px" },
      lg: { width: "18px", height: "18px", borderWidth: "2px" }
    }
  },
  defaultVariants: { size: "md" }
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
  boxShadow: vars.shadow.sm,
  transition:
    "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease, transform 80ms ease",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.ring}`,
      outlineOffset: "2px",
      zIndex: 1
    },
    "&:disabled, &[aria-disabled='true']": {
      cursor: "not-allowed",
      opacity: 0.55,
      pointerEvents: "none",
      boxShadow: "none"
    },
    "&[data-pressed='true']:not(:disabled):not([aria-disabled='true'])": {
      transform: "translateY(1px)"
    }
  }
});

export const buttonIconSlot = recipe({
  base: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0
  },
  variants: {
    size: {
      sm: { width: vars.size.iconSm, height: vars.size.iconSm },
      md: { width: vars.size.iconMd, height: vars.size.iconMd },
      lg: { width: vars.size.iconLg, height: vars.size.iconLg },
      icon: { width: vars.size.iconMd, height: vars.size.iconMd }
    }
  },
  defaultVariants: { size: "md" }
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

const interactiveHover = "&:hover:not(:disabled):not([aria-disabled='true'])";
const interactiveActive = "&:active:not(:disabled):not([aria-disabled='true'])";

export const buttonStyles = recipe({
  base,
  variants: {
    variant: {
      solid: {
        background: vars.color.primary,
        color: vars.color.primaryForeground,
        borderColor: vars.color.primary,
        selectors: {
          [interactiveHover]: {
            background: vars.color.primaryHover,
            borderColor: vars.color.primaryHover
          },
          [interactiveActive]: { filter: "brightness(0.92)" }
        }
      },
      secondary: {
        background: vars.color.secondary,
        color: vars.color.secondaryForeground,
        borderColor: vars.color.border,
        boxShadow: "none",
        selectors: {
          [interactiveHover]: { background: vars.color.secondaryHover },
          [interactiveActive]: { filter: "brightness(0.97)" }
        }
      },
      outline: {
        background: vars.color.background,
        color: vars.color.foreground,
        borderColor: vars.color.border,
        boxShadow: "none",
        selectors: {
          [interactiveHover]: { background: vars.color.muted },
          [interactiveActive]: { background: vars.color.ghostHover }
        }
      },
      ghost: {
        background: "transparent",
        color: vars.color.foreground,
        borderColor: "transparent",
        boxShadow: "none",
        selectors: {
          [interactiveHover]: { background: vars.color.ghostHover },
          [interactiveActive]: { background: vars.color.muted }
        }
      },
      danger: {
        background: vars.color.danger,
        color: vars.color.dangerForeground,
        borderColor: vars.color.danger,
        selectors: {
          [interactiveHover]: {
            background: vars.color.dangerHover,
            borderColor: vars.color.dangerHover
          },
          [interactiveActive]: { filter: "brightness(0.92)" }
        }
      },
      dangerOutline: {
        background: vars.color.dangerSubtle,
        color: vars.color.danger,
        borderColor: vars.color.dangerBorder,
        boxShadow: "none",
        selectors: {
          [interactiveHover]: {
            background: vars.color.dangerSubtle,
            borderColor: vars.color.danger
          },
          [interactiveActive]: { filter: "brightness(0.97)" }
        }
      },
      link: {
        background: "transparent",
        color: vars.color.primary,
        borderColor: "transparent",
        paddingInline: 0,
        minHeight: "auto",
        boxShadow: "none",
        selectors: {
          [interactiveHover]: {
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
    { variants: { variant: "link", size: "sm" }, style: { minHeight: "auto", padding: 0, fontSize: "13px" } },
    { variants: { variant: "link", size: "md" }, style: { minHeight: "auto", padding: 0, fontSize: "14px" } },
    { variants: { variant: "link", size: "lg" }, style: { minHeight: "auto", padding: 0, fontSize: "16px" } },
    { variants: { size: "icon", variant: "solid" }, style: { borderRadius: vars.radius.sm } },
    { variants: { size: "icon", variant: "outline" }, style: { minHeight: "40px", minWidth: "40px" } },
    { variants: { size: "icon", variant: "ghost" }, style: { minHeight: "40px", minWidth: "40px" } },
    { variants: { size: "icon", variant: "secondary" }, style: { minHeight: "40px", minWidth: "40px" } },
    { variants: { size: "sm", variant: "solid" }, style: { minHeight: "32px" } },
    { variants: { size: "lg", variant: "solid" }, style: { minHeight: "48px" } },
    { variants: { size: "sm", variant: "secondary" }, style: { minHeight: "32px" } },
    { variants: { size: "lg", variant: "secondary" }, style: { minHeight: "48px" } }
  ],
  defaultVariants: {
    variant: "solid",
    size: "md",
    fullWidth: false,
    loading: false
  }
});

export type ButtonStyleVariants = RecipeVariants<typeof buttonStyles>;
