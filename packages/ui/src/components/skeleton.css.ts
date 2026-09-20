import { keyframes } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

const pulse = keyframes({
  "0%, 100%": { opacity: "1" },
  "50%": { opacity: "0.45" }
});

export const skeletonStyles = recipe({
  base: {
    display: "block",
    backgroundColor: vars.color.muted,
    animation: `${pulse} 1.5s ${vars.motion.easing.standard} infinite`
  },
  variants: {
    variant: {
      rect: {
        borderRadius: vars.radius.md
      },
      circle: {
        borderRadius: vars.radius.full
      }
    }
  },
  defaultVariants: {
    variant: "rect"
  }
});

export type SkeletonVariant = NonNullable<
  NonNullable<RecipeVariants<typeof skeletonStyles>>["variant"]
>;
