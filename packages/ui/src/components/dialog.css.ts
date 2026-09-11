import { style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

export const dialogOverlay = style({
  position: "fixed",
  inset: vars.space.x0,
  zIndex: vars.zIndex.overlay,
  background: vars.color.overlay,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space.x4
});

export const dialogContent = style({
  position: "relative",
  zIndex: vars.zIndex.dialog,
  width: "min(100%, 28rem)",
  maxHeight: "min(90vh, 40rem)",
  overflow: "auto",
  boxSizing: "border-box",
  borderRadius: vars.radius.md,
  border: `${vars.size.border.hairline} solid ${vars.color.border}`,
  background: vars.color.background,
  color: vars.color.foreground,
  boxShadow: vars.shadow.md,
  padding: vars.space.x5,
  fontFamily: vars.font.body,
  outline: "none"
});

export const dialogHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x1,
  marginBottom: vars.space.x4
});

export const dialogTitle = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font.lineHeight.tight,
  color: vars.color.foreground
});

export const dialogDescription = style({
  margin: vars.space.x0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal,
  color: vars.color.mutedForeground
});

export const dialogFooter = style({
  display: "flex",
  justifyContent: "flex-end",
  gap: vars.space.x2,
  marginTop: vars.space.x5
});

export const dialogClose = style({
  position: "absolute",
  top: vars.space.x3,
  right: vars.space.x3
});
