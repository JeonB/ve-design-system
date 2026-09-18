import { recipe } from "@vanilla-extract/recipes";
import { style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

export const drawerOverlay = style({
  position: "fixed",
  inset: vars.space.x0,
  zIndex: vars.zIndex.overlay,
  background: vars.color.overlay
});

export const drawerContent = recipe({
  base: {
    position: "fixed",
    zIndex: vars.zIndex.drawer,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    background: vars.color.background,
    color: vars.color.foreground,
    border: `${vars.size.border.hairline} solid ${vars.color.border}`,
    boxShadow: vars.shadow.md,
    fontFamily: vars.font.body,
    outline: "none",
    maxWidth: "100vw",
    maxHeight: "100vh"
  },
  variants: {
    side: {
      right: {
        top: vars.space.x0,
        right: vars.space.x0,
        bottom: vars.space.x0,
        width: "min(100%, 24rem)",
        borderRight: "none"
      },
      left: {
        top: vars.space.x0,
        left: vars.space.x0,
        bottom: vars.space.x0,
        width: "min(100%, 24rem)",
        borderLeft: "none"
      },
      top: {
        top: vars.space.x0,
        left: vars.space.x0,
        right: vars.space.x0,
        height: "min(100%, 20rem)",
        borderTop: "none"
      },
      bottom: {
        bottom: vars.space.x0,
        left: vars.space.x0,
        right: vars.space.x0,
        height: "min(100%, 20rem)",
        borderBottom: "none"
      }
    }
  },
  defaultVariants: { side: "right" }
});

export const drawerHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x1,
  padding: vars.space.x5,
  paddingBottom: vars.space.x3,
  borderBottom: `${vars.size.border.hairline} solid ${vars.color.border}`
});

export const drawerTitle = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight
});

export const drawerDescription = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.sm,
  color: vars.color.mutedForeground,
  lineHeight: vars.font.lineHeight.normal
});

export const drawerBody = style({
  flex: 1,
  overflow: "auto",
  padding: vars.space.x5
});

export const drawerFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space.x2,
  padding: vars.space.x5,
  paddingTop: vars.space.x3,
  borderTop: `${vars.size.border.hairline} solid ${vars.color.border}`
});

export const drawerClose = style({
  position: "absolute",
  top: vars.space.x3,
  right: vars.space.x3
});

export type DrawerSide = "left" | "right" | "top" | "bottom";
