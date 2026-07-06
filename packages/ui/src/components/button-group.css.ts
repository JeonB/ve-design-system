import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { vars } from "@ve/tokens";

export const buttonGroupRoot = recipe({
  base: {
    display: "inline-flex",
    alignItems: "stretch",
    maxWidth: "100%"
  },
  variants: {
    orientation: {
      horizontal: { flexDirection: "row" },
      vertical: { flexDirection: "column" }
    },
    fullWidth: {
      true: { width: "100%" },
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
      style: { gap: 0 }
    },
    {
      variants: { gap: "none", orientation: "vertical" },
      style: { gap: 0 }
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
  marginLeft: "-1px"
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:first-child:not(:only-child)`, {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:last-child:not(:only-child)`, {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0
});

globalStyle(`${buttonGroupAttachedHorizontal} > *:not(:first-child):not(:last-child)`, {
  borderRadius: 0
});

globalStyle(`${buttonGroupAttachedVertical} > *:not(:first-child)`, {
  marginTop: "-1px"
});

globalStyle(`${buttonGroupAttachedVertical} > *:first-child:not(:only-child)`, {
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0
});

globalStyle(`${buttonGroupAttachedVertical} > *:last-child:not(:only-child)`, {
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
});

globalStyle(`${buttonGroupAttachedVertical} > *:not(:first-child):not(:last-child)`, {
  borderRadius: 0
});

export const buttonGroupSeparator = style({
  flexShrink: 0,
  alignSelf: "stretch",
  width: "1px",
  background: vars.color.border,
  marginBlock: vars.space.x1
});
