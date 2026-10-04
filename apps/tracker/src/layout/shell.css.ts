import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@ve/tokens";

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box"
});

globalStyle("body", {
  margin: 0
});

globalStyle("a", {
  color: "inherit"
});

export const page = style({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: vars.color.background,
  color: vars.color.foreground,
  fontFamily: vars.font.body,
  fontSize: vars.font.size.md
});

export const topbar = style({
  minHeight: "56px",
  flex: "none",
  display: "flex",
  alignItems: "center",
  gap: vars.space.x3,
  padding: `${vars.space.x2} ${vars.space.x4}`,
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  flexWrap: "wrap"
});

export const wordmark = style({
  fontWeight: vars.font.weight.semibold,
  fontSize: vars.font.size.lg,
  textDecoration: "none",
  color: vars.color.primary,
  marginRight: vars.space.x2
});

export const searchForm = style({
  flex: 1,
  maxWidth: "720px",
  margin: "0 auto"
});

export const topActions = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2,
  marginLeft: "auto"
});

export const frame = style({
  flex: 1,
  minHeight: 0,
  display: "flex",
  "@media": {
    "screen and (max-width: 800px)": {
      flexDirection: "column"
    }
  }
});

export const sidebar = style({
  width: "240px",
  flex: "none",
  borderRight: `1px solid ${vars.color.border}`,
  background: vars.color.background,
  overflow: "auto",
  padding: `${vars.space.x4} ${vars.space.x2}`,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x1,
  "@media": {
    "screen and (max-width: 800px)": {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      borderRight: "none",
      borderBottom: `1px solid ${vars.color.border}`,
      padding: vars.space.x2
    }
  }
});

export const sideLabel = style({
  margin: 0,
  padding: `0 ${vars.space.x2}`,
  color: vars.color.mutedForeground,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold
});

export const sideItem = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2,
  padding: `${vars.space.x2} ${vars.space.x2}`,
  borderRadius: vars.radius.sm,
  textDecoration: "none",
  color: vars.color.foreground,
  fontSize: vars.font.size.md,
  selectors: {
    "&:hover": {
      background: vars.color.ghostHover
    }
  }
});

export const sideItemActive = style({
  background: vars.color.primarySubtle,
  color: vars.color.primary,
  fontWeight: vars.font.weight.semibold
});

export const spaceMark = style({
  width: "20px",
  height: "20px",
  borderRadius: vars.radius.sm,
  background: vars.color.primary,
  color: vars.color.primaryForeground,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  flex: "none"
});

export const main = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

export const padded = style({
  padding: vars.space.x6,
  overflow: "auto"
});

export const space = style({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column"
});

export const spaceHeader = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x3,
  padding: `${vars.space.x4} ${vars.space.x6} 0`
});

export const spaceTitle = style({
  margin: 0,
  fontSize: "20px",
  fontWeight: vars.font.weight.semibold
});

export const viewNav = style({
  display: "flex",
  gap: vars.space.x1,
  padding: `0 ${vars.space.x4}`,
  borderBottom: `1px solid ${vars.color.border}`
});

export const viewLink = style({
  padding: `${vars.space.x3} ${vars.space.x3}`,
  textDecoration: "none",
  color: vars.color.mutedForeground,
  fontSize: vars.font.size.md,
  borderBottom: "2px solid transparent",
  selectors: {
    "&:hover": {
      color: vars.color.foreground
    }
  }
});

export const viewLinkActive = style({
  color: vars.color.primary,
  fontWeight: vars.font.weight.semibold,
  borderBottomColor: vars.color.primary
});

export const spaceBody = style({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
});

export const toolbar = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2,
  padding: vars.space.x3,
  flexWrap: "wrap"
});

export const toolbarGrow = style({
  width: "280px",
  maxWidth: "100%"
});

export const boardCanvas = style({
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  background: vars.color.muted,
  padding: vars.space.x3
});

export const lane = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2,
  marginBottom: vars.space.x4
});

export const laneTitle = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.semibold,
  color: vars.color.mutedForeground
});

export const board = style({
  display: "flex",
  gap: vars.space.x2,
  alignItems: "flex-start",
  minWidth: "min-content"
});

export const column = style({
  width: "272px",
  flex: "none",
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2,
  minHeight: "8rem",
  borderRadius: vars.radius.md,
  padding: vars.space.x1,
  selectors: {
    "&[data-drop='true']": {
      outline: `2px solid ${vars.color.ring}`,
      background: vars.color.primarySubtle
    }
  }
});

export const columnHead = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2,
  padding: `${vars.space.x2} ${vars.space.x2} 0`
});

export const columnCount = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.size.sm
});

export const columnAdd = style({
  marginLeft: "auto",
  border: "none",
  background: "transparent",
  color: vars.color.foreground,
  width: "28px",
  height: "28px",
  borderRadius: vars.radius.sm,
  cursor: "pointer",
  fontSize: vars.font.size.lg,
  selectors: {
    "&:hover": {
      background: vars.color.ghostHover
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  }
});

export const workCard = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2,
  padding: vars.space.x3,
  background: vars.color.background,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.sm,
  cursor: "grab",
  textDecoration: "none",
  color: "inherit"
});

export const workCardTop = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2
});

export const workKey = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.size.sm
});

export const workSummary = style({
  margin: 0,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.regular,
  lineHeight: vars.font.lineHeight.normal
});

export const workCardFoot = style({
  display: "flex",
  justifyContent: "flex-end"
});

export const typeMark = style({
  width: "16px",
  height: "16px",
  borderRadius: vars.radius.sm,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "10px",
  fontWeight: vars.font.weight.semibold,
  color: vars.color.primaryForeground,
  background: vars.color.primary,
  flex: "none",
  selectors: {
    "&[data-type='epic']": { background: vars.color.warning },
    "&[data-type='story']": { background: vars.color.success },
    "&[data-type='bug']": { background: vars.color.danger },
    "&[data-type='subtask']": { background: vars.color.mutedForeground }
  }
});

export const listPage = style({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: vars.color.background
});

export const tableWrap = style({
  flex: 1,
  overflow: "auto"
});

export const workTable = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: vars.font.size.sm
});

globalStyle(`${workTable} th`, {
  textAlign: "left",
  fontWeight: vars.font.weight.semibold,
  color: vars.color.mutedForeground,
  padding: `${vars.space.x2} ${vars.space.x3}`,
  borderBottom: `1px solid ${vars.color.border}`,
  whiteSpace: "nowrap",
  position: "sticky",
  top: 0,
  background: vars.color.background
});

globalStyle(`${workTable} td`, {
  padding: `${vars.space.x2} ${vars.space.x3}`,
  borderBottom: `1px solid ${vars.color.border}`,
  verticalAlign: "middle",
  whiteSpace: "nowrap"
});

globalStyle(`${workTable} tbody tr:hover`, {
  background: vars.color.ghostHover
});

export const workCell = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.x2,
  whiteSpace: "normal",
  minWidth: "240px"
});

export const emptyState = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.space.x2,
  color: vars.color.mutedForeground,
  textAlign: "center",
  padding: vars.space.x6
});

export const emptyTitle = style({
  margin: 0,
  color: vars.color.foreground,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold
});

export const listFooter = style({
  borderTop: `1px solid ${vars.color.border}`,
  padding: vars.space.x2
});

export const filterPanel = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
  gap: vars.space.x2,
  padding: `0 ${vars.space.x3} ${vars.space.x3}`,
  "@media": {
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  }
});

export const issueOverlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 40,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: vars.space.x6,
  overflow: "auto"
});

export const issueBackdrop = style({
  position: "fixed",
  inset: 0,
  border: "none",
  background: vars.color.overlay,
  cursor: "pointer"
});

export const issueDialog = style({
  position: "relative",
  zIndex: 1,
  width: "min(1040px, 100%)",
  margin: "4vh auto",
  background: vars.color.background,
  borderRadius: vars.radius.md,
  boxShadow: vars.shadow.md,
  padding: vars.space.x6,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x4
});

export const issueTop = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.x3
});

export const issueCrumb = style({
  color: vars.color.mutedForeground,
  fontSize: vars.font.size.sm
});

export const issueTitle = style({
  width: "100%",
  border: "none",
  background: "transparent",
  boxShadow: "none"
});

globalStyle(`${issueTitle} input`, {
  fontSize: "24px",
  fontWeight: vars.font.weight.semibold,
  border: "none",
  background: "transparent",
  height: "auto",
  padding: 0,
  boxShadow: "none"
});

export const detail = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 280px",
  gap: vars.space.x6,
  alignItems: "start",
  "@media": {
    "screen and (max-width: 800px)": {
      gridTemplateColumns: "minmax(0, 1fr)"
    }
  }
});

export const sidePanel = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.x4,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x3,
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

export const dropZone = style({
  border: `1px dashed ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.x4,
  display: "flex",
  justifyContent: "center"
});

export const sectionLabel = style({
  margin: 0,
  fontSize: vars.font.size.md,
  fontWeight: vars.font.weight.semibold
});

export const activityTabs = style({
  display: "flex",
  gap: vars.space.x1
});

export const chipRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.x2
});

export const summaryGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: vars.space.x3
});

export const summaryCard = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  padding: vars.space.x4,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.x2
});

export const projectGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: vars.space.x3
});

export const shell = style({
  display: "contents"
});

export const header = style({
  display: "contents"
});

export const headerStart = style({
  display: "contents"
});

export const filterBar = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
  gap: vars.space.x2
});

export const groupHead = style({
  background: vars.color.muted,
  fontWeight: vars.font.weight.semibold
});
