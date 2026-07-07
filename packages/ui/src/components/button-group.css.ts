import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const buttonGroupRoot = recipe({
  base: {
    display: "inline-flex",
    alignItems: "stretch",
    maxWidth: vars.layout.full
  },
  variants: {
    orientation: {
      horizontal: { flexDirection: "row" },
      vertical: { flexDirection: "column" }
    },
    fullWidth: {
      true: { width: vars.layout.full },
      false: {}
    },
    gap: {
      sm: {},
      md: {},
      none: {}
    }
  },
  compoundVariants: [
    {
      variants: { gap: "sm", orientation: "horizontal" },
      style: { gap: vars.space.x2 }
    },
    {
      variants: { gap: "md", orientation: "horizontal" },
      style: { gap: vars.space.x3 }
    },
    {
      variants: { gap: "sm", orientation: "vertical" },
      style: { gap: vars.space.x2 }
    },
    {
      variants: { gap: "md", orientation: "vertical" },
      style: { gap: vars.space.x3 }
    },
    {
      variants: { gap: "none", orientation: "horizontal" },
      style: { gap: vars.space.x0 }
    },
    {
      variants: { gap: "none", orientation: "vertical" },
      style: { gap: vars.space.x0 }
    }
  ],
  defaultVariants: {
    orientation: "horizontal",
    fullWidth: false,
    gap: "sm"
  }
});

export const buttonGroupAttachedHorizontal = style({});
export const buttonGroupAttachedVertical = style({});

globalStyle(`${buttonGroupAttachedHorizontal} > *:not(:first-child)`, {
  marginLeft: vars.size.border.overlap
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:first-child:not(:only-child)`, {
  borderTopRightRadius: vars.radius.none,
  borderBottomRightRadius: vars.radius.none
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:last-child:not(:only-child)`, {
  borderTopLeftRadius: vars.radius.none,
  borderBottomLeftRadius: vars.radius.none
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:not(:first-child):not(:last-child)`, {
  borderRadius: vars.radius.none
});

globalStyle(`${buttonGroupAttachedVertical} > *:not(:first-child)`, {
  marginTop: vars.size.border.overlap
});

globalStyle(`${buttonGroupAttachedVertical} > *:first-child:not(:only-child)`, {
  borderBottomLeftRadius: vars.radius.none,
  borderBottomRightRadius: vars.radius.none
});

globalStyle(`${buttonGroupAttachedVertical} > *:last-child:not(:only-child)`, {
  borderTopLeftRadius: vars.radius.none,
  borderTopRightRadius: vars.radius.none
});

globalStyle(`${buttonGroupAttachedVertical} > *:not(:first-child):not(:last-child)`, {
  borderRadius: vars.radius.none
});

export const buttonGroupSeparator = style({
  flexShrink: 0,
  alignSelf: "stretch",
  width: vars.size.border.hairline,
  background: vars.color.border,
  marginBlock: vars.space.x1
});
