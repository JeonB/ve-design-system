import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const separatorStyles = recipe({
  base: {
    border: "none",
    margin: vars.space.x0,
    background: vars.color.border,
    flexShrink: 0
  },
  variants: {
    orientation: {
      horizontal: {
        width: vars.layout.full,
        height: vars.size.border.hairline
      },
      vertical: {
        width: vars.size.border.hairline,
        alignSelf: "stretch",
        height: "auto",
        minHeight: vars.space.x4
      }
    }
  },
  defaultVariants: {
    orientation: "horizontal"
  }
});

export type SeparatorOrientation = "horizontal" | "vertical";
