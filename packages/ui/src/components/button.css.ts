import { style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

const base = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontFamily: vars.font.body,
  fontWeight: 600,
  transition: "filter 120ms ease",
  selectors: {
    "&:hover": {
      filter: "brightness(0.95)"
    }
  }
});

export const buttonStyles = recipe({
  base,
  variants: {
    variant: {
      solid: {
        background: vars.color.primary,
        color: vars.color.primaryForeground
      },
      outline: {
        background: vars.color.background,
        color: vars.color.foreground
      }
    },
    size: {
      sm: {
        padding: `${vars.space.x1} ${vars.space.x2}`,
        fontSize: "14px"
      },
      md: {
        padding: `${vars.space.x2} ${vars.space.x3}`,
        fontSize: "16px"
      }
    }
  },
  defaultVariants: {
    variant: "solid",
    size: "md"
  }
});

export type ButtonStyleVariants = RecipeVariants<typeof buttonStyles>;
