import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

export const avatarStyles = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: vars.radius.full,
    background: vars.color.muted,
    color: vars.color.mutedForeground,
    fontFamily: vars.font.body,
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font.lineHeight.tight,
    userSelect: "none",
    verticalAlign: "middle"
  },
  variants: {
    size: {
      sm: {
        width: "24px",
        height: "24px",
        fontSize: vars.font.size.sm
      },
      md: {
        width: "32px",
        height: "32px",
        fontSize: vars.font.size.md
      },
      lg: {
        width: "40px",
        height: "40px",
        fontSize: vars.font.size.lg
      }
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export const avatarImage = style({
  width: vars.layout.full,
  height: vars.layout.full,
  objectFit: "cover",
  display: "block"
});

export const avatarFallback = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: vars.layout.full,
  height: vars.layout.full
});

export type AvatarSize = "sm" | "md" | "lg";
