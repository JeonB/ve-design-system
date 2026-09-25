import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box"
});

globalStyle("body", {
  margin: 0
});

export const page = style({
  minHeight: "100vh",
  background: vars.color.background,
  color: vars.color.foreground,
  fontFamily: vars.font.body
});

export const shell = style({
  maxWidth: "1120px",
  margin: "0 auto",
  padding: vars.space.x6,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x4
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.x3,
  flexWrap: "wrap"
});

export const headerStart = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x3,
  flexWrap: "wrap"
});

export const projectGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: vars.space.x3
});

export const board = style({
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(200px, 1fr))",
  gap: vars.space.x3,
  overflowX: "auto",
  alignItems: "start"
});

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2,
  minWidth: "200px"
});

export const detail = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 280px",
  gap: vars.space.x4,
  alignItems: "start",
  "@media": {
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  }
});

export const sidePanel = style({
  "@media": {
    "screen and (max-width: 800px)": {
      display: "none"
    }
  }
});

export const narrowOnly = style({
  display: "none",
  "@media": {
    "screen and (max-width: 800px)": {
      display: "inline-flex"
    }
  }
});

export const filterBar = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
  gap: vars.space.x2,
  "@media": {
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  }
});
