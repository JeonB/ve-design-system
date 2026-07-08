import { keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const spin = keyframes({
  to: { transform: "rotate(360deg)" }
});

export const spinnerStyles = recipe({
  base: {
    display: "inline-block",
    borderRadius: vars.radius.full,
    borderStyle: "solid",
    borderColor: "currentColor",
    borderTopColor: vars.color.transparent,
    animation: `${spin} ${vars.motion.duration.spinner} ${vars.motion.easing.linear} infinite`,
    flexShrink: 0
  },
  variants: {
    size: {
      sm: {
        width: vars.size.icon.sm,
        height: vars.size.icon.sm,
        borderWidth: vars.size.border.spinner
      },
      md: {
        width: vars.size.icon.md,
        height: vars.size.icon.md,
        borderWidth: vars.size.border.spinner
      },
      lg: {
        width: vars.size.icon.lg,
        height: vars.size.icon.lg,
        borderWidth: vars.size.border.spinner
      }
    }
  },
  defaultVariants: { size: "md" }
});

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerStyleVariants = RecipeVariants<typeof spinnerStyles>;

const base = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.x2,
  border: `${vars.size.border.hairline} solid ${vars.color.transparent}`,
  borderRadius: vars.radius.sm,
  fontFamily: vars.font.body,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  whiteSpace: "nowrap",
  userSelect: "none",
  cursor: "pointer",
  boxShadow: vars.shadow.sm,
  transition: vars.motion.transition.button,
  selectors: {
    "&:focus-visible": {
      outline: `${vars.focus.ringWidth} solid ${vars.color.ring}`,
      outlineOffset: vars.focus.ringOffset,
      zIndex: vars.zIndex.focus
    },
    "&:disabled, &[aria-disabled='true']": {
      cursor: "not-allowed",
      opacity: vars.opacity.disabled,
      pointerEvents: "none",
      boxShadow: vars.shadow.none
    },
    "&[data-pressed='true']:not(:disabled):not([aria-disabled='true'])": {
      transform: `translateY(${vars.effect.translate.pressed})`
    }
  }
});

export const buttonIconSlot = recipe({
  base: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    lineHeight: vars.space.x0
  },
  variants: {
    size: {
      sm: { width: vars.size.icon.sm, height: vars.size.icon.sm },
      md: { width: vars.size.icon.md, height: vars.size.icon.md },
      lg: { width: vars.size.icon.lg, height: vars.size.icon.lg },
      icon: { width: vars.size.icon.md, height: vars.size.icon.md }
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
  inset: vars.space.x0,
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
          [interactiveActive]: {
            filter: `brightness(${vars.effect.brightness.active})`
          }
        }
      },
      secondary: {
        background: vars.color.secondary,
        color: vars.color.secondaryForeground,
        borderColor: vars.color.border,
        boxShadow: vars.shadow.none,
        selectors: {
          [interactiveHover]: { background: vars.color.secondaryHover },
          [interactiveActive]: {
            filter: `brightness(${vars.effect.brightness.activeSoft})`
          }
        }
      },
      outline: {
        background: vars.color.background,
        color: vars.color.foreground,
        borderColor: vars.color.border,
        boxShadow: vars.shadow.none,
        selectors: {
          [interactiveHover]: { background: vars.color.muted },
          [interactiveActive]: { background: vars.color.ghostHover }
        }
      },
      ghost: {
        background: vars.color.transparent,
        color: vars.color.foreground,
        borderColor: vars.color.transparent,
        boxShadow: vars.shadow.none,
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
          [interactiveActive]: {
            filter: `brightness(${vars.effect.brightness.active})`
          }
        }
      },
      dangerOutline: {
        background: vars.color.dangerSubtle,
        color: vars.color.danger,
        borderColor: vars.color.dangerBorder,
        boxShadow: vars.shadow.none,
        selectors: {
          [interactiveHover]: {
            background: vars.color.dangerSubtle,
            borderColor: vars.color.danger
          },
          [interactiveActive]: {
            filter: `brightness(${vars.effect.brightness.activeSoft})`
          }
        }
      },
      link: {
        background: vars.color.transparent,
        color: vars.color.primary,
        borderColor: vars.color.transparent,
        paddingInline: vars.space.x0,
        minHeight: "auto",
        boxShadow: vars.shadow.none,
        selectors: {
          [interactiveHover]: {
            textDecoration: "underline",
            textUnderlineOffset: vars.font.decoration.underlineOffset
          }
        }
      }
    },
    size: {
      sm: {
        minHeight: vars.component.button.height.sm,
        padding: vars.component.button.padding.sm,
        fontSize: vars.font.size.sm,
        gap: vars.space.x1
      },
      md: {
        minHeight: vars.component.button.height.md,
        padding: vars.component.button.padding.md,
        fontSize: vars.font.size.md
      },
      lg: {
        minHeight: vars.component.button.height.lg,
        padding: vars.component.button.padding.lg,
        fontSize: vars.font.size.lg,
        gap: vars.space.x3
      },
      icon: {
        minHeight: vars.component.button.height.icon,
        minWidth: vars.component.button.height.icon,
        padding: vars.component.button.padding.icon
      }
    },
    fullWidth: {
      true: { width: vars.layout.full },
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
      style: { minHeight: "auto", padding: vars.space.x0, fontSize: vars.font.size.sm }
    },
    {
      variants: { variant: "link", size: "md" },
      style: { minHeight: "auto", padding: vars.space.x0, fontSize: vars.font.size.md }
    },
    {
      variants: { variant: "link", size: "lg" },
      style: { minHeight: "auto", padding: vars.space.x0, fontSize: vars.font.size.lg }
    },
    {
      variants: { size: "icon", variant: "outline" },
      style: {
        minHeight: vars.component.button.height.icon,
        minWidth: vars.component.button.height.icon
      }
    },
    {
      variants: { size: "icon", variant: "ghost" },
      style: {
        minHeight: vars.component.button.height.icon,
        minWidth: vars.component.button.height.icon
      }
    },
    {
      variants: { size: "icon", variant: "secondary" },
      style: {
        minHeight: vars.component.button.height.icon,
        minWidth: vars.component.button.height.icon
      }
    }
  ],
  defaultVariants: {
    variant: "solid",
    size: "md",
    fullWidth: false,
    loading: false
  }
});

export type ButtonVariant =
  | "solid"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dangerOutline"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";
export type ButtonStyleVariants = RecipeVariants<typeof buttonStyles>;
