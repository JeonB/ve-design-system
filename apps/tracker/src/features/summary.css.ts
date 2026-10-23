import { style, styleVariants } from "@vanilla-extract/css";
import { font, jira, radius } from "../layout/jira-theme.css";

const focusRing = {
  outline: `2px solid ${jira.color.link}`,
  outlineOffset: "2px"
} as const;

const GAP = "22px";

export const scroll = style({
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  padding: "24px 24px 40px",
  background: jira.color.surface,
  color: jira.color.text,
  font: font.body
});

export const column = style({
  width: "100%",
  maxWidth: "1154px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column"
});

export const filterRow = style({
  position: "relative",
  height: "32px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "16px"
});

export const avatarStack = style({
  display: "flex",
  alignItems: "center"
});

export const avatarToggle = style({
  width: "24px",
  height: "24px",
  padding: 0,
  marginLeft: "-2px",
  border: `2px solid ${jira.color.surface}`,
  borderRadius: "50%",
  background: "transparent",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  selectors: {
    "&:first-child": { marginLeft: 0 },
    "&[aria-pressed='true']": { borderColor: jira.color.link },
    "&:focus-visible": focusRing
  }
});

export const outlineButton = style({
  height: "32px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "0 10px",
  border: `1px solid ${jira.color.border}`,
  borderRadius: radius.small,
  background: jira.color.surface,
  color: jira.color.textSubtle,
  font: font.body,
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&[aria-expanded='true']": { background: jira.color.selected, color: jira.color.link },
    "&:focus-visible": focusRing
  }
});

export const filterPanel = style({
  position: "absolute",
  top: "36px",
  left: 0,
  zIndex: 10,
  minWidth: "220px",
  margin: 0,
  padding: "8px 0",
  border: "none",
  borderRadius: radius.small,
  background: jira.color.surface,
  boxShadow: "0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F"
});

export const filterLegend = style({
  padding: "4px 12px",
  color: jira.color.textSubtlest,
  font: font.headingXxsmall
});

export const filterOption = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  height: "32px",
  padding: "0 12px",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: jira.color.neutral }
  }
});

export const tiles = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: GAP,
  marginBottom: GAP,
  "@media": {
    "screen and (max-width: 1100px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
  }
});

export const tile = style({
  height: "66px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px",
  border: `1px solid ${jira.color.border}`,
  borderRadius: radius.large,
  color: jira.color.text,
  textDecoration: "none",
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&:focus-visible": focusRing
  }
});

export const tileIcon = style({
  width: "40px",
  height: "40px",
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: radius.medium,
  background: jira.color.neutral,
  color: jira.color.textSubtle
});

export const tileTitle = style({
  margin: 0,
  font: font.headingSmall
});

export const tileNote = style({
  display: "block",
  color: jira.color.textSubtle,
  font: font.bodySmall
});

export const cards = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: GAP,
  "@media": {
    "screen and (max-width: 1100px)": { gridTemplateColumns: "minmax(0, 1fr)" }
  }
});

export const card = style({
  height: "322px",
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  border: `1px solid ${jira.color.border}`,
  borderRadius: radius.large,
  background: jira.color.surface
});

export const cardTitle = style({
  margin: 0,
  font: font.headingSmall,
  color: jira.color.text
});

export const cardNote = style({
  margin: 0,
  font: font.body,
  color: jira.color.text
});

export const link = style({
  color: jira.color.link,
  textDecoration: "none",
  selectors: {
    "&:hover": { textDecoration: "underline" },
    "&:focus-visible": focusRing
  }
});

export const cardBody = style({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column"
});

export const donutRow = style({
  flex: 1,
  paddingTop: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "104px"
});

export const donut = style({
  position: "relative",
  width: "210px",
  height: "210px",
  flex: "none"
});

export const donutCenter = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center"
});

export const donutTotal = style({
  font: font.headingLarge,
  color: jira.color.text
});

export const donutLabel = style({
  maxWidth: "116px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  font: font.headingXsmall,
  color: jira.color.text
});

const CHART_COLORS = [
  jira.color.chart1,
  jira.color.chart2,
  jira.color.chart3,
  jira.color.chart4,
  jira.color.chart5,
  jira.color.chart6
] as const;

export const chartStroke = styleVariants({
  0: { fill: "none", stroke: CHART_COLORS[0] },
  1: { fill: "none", stroke: CHART_COLORS[1] },
  2: { fill: "none", stroke: CHART_COLORS[2] },
  3: { fill: "none", stroke: CHART_COLORS[3] },
  4: { fill: "none", stroke: CHART_COLORS[4] },
  5: { fill: "none", stroke: CHART_COLORS[5] }
});

export const chartSwatch = styleVariants({
  0: { background: CHART_COLORS[0] },
  1: { background: CHART_COLORS[1] },
  2: { background: CHART_COLORS[2] },
  3: { background: CHART_COLORS[3] },
  4: { background: CHART_COLORS[4] },
  5: { background: CHART_COLORS[5] }
});

export const legend = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: "8px"
});

export const legendItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  color: jira.color.textSubtle,
  font: font.bodySmall,
  textDecoration: "none",
  selectors: {
    "&:hover": { textDecoration: "underline" }
  }
});

export const legendSwatch = style({
  width: "10px",
  height: "10px",
  flex: "none"
});

export const empty = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  padding: "0 16px",
  textAlign: "center"
});

export const emptyArt = style({
  marginBottom: "12px"
});

export const emptyTitle = style({
  margin: 0,
  font: font.headingSmall,
  color: jira.color.text
});

export const emptyText = style({
  margin: 0,
  maxWidth: "410px",
  font: font.body,
  color: jira.color.text
});

export const artNeutral = style({ fill: jira.color.track });
export const artBrand = style({ fill: jira.color.brand });
export const artBrandDark = style({ fill: jira.color.brandHovered });
export const artMark = style({ stroke: jira.color.surface });

export const recentList = style({
  margin: "12px 0 0",
  padding: 0,
  listStyle: "none",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
});

export const recentItem = style({
  display: "flex",
  gap: "8px",
  alignItems: "flex-start"
});

export const recentText = style({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  font: font.body
});

export const recentMeta = style({
  color: jira.color.textSubtlest,
  font: font.bodySmall
});

export const barChart = style({
  flex: 1,
  minHeight: 0,
  display: "grid",
  gridTemplateColumns: "28px minmax(0, 1fr)",
  gridTemplateRows: "minmax(0, 1fr) auto",
  columnGap: "4px",
  paddingTop: "18px"
});

export const axisTicks = style({
  position: "relative",
  color: jira.color.textSubtle,
  font: font.bodySmall
});

export const axisTick = style({
  position: "absolute",
  right: "6px",
  transform: "translateY(-50%)"
});

export const axisTickTop = style({ top: 0 });
export const axisTickMid = style({ top: "50%" });
export const axisTickBottom = style({ top: "100%" });

export const plot = style({
  position: "relative",
  minHeight: 0,
  borderLeft: `1px solid ${jira.color.chartNeutral}`,
  borderBottom: `1px solid ${jira.color.chartNeutral}`
});

export const gridLine = style({ stroke: jira.color.track, strokeWidth: 1 });
export const barRect = style({
  fill: jira.color.chartNeutral,
  selectors: { "&:hover": { fill: jira.color.chartNeutralHovered } }
});

export const xAxis = style({
  gridColumn: "2",
  display: "grid",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  paddingTop: "4px"
});

export const xLabel = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  color: jira.color.textSubtle,
  font: font.body,
  textDecoration: "none",
  selectors: {
    "&:hover": { color: jira.color.text }
  }
});

export const priorityTone = styleVariants({
  highest: { color: jira.color.iconRed },
  high: { color: jira.color.iconRed },
  medium: { color: jira.color.iconOrange },
  low: { color: jira.color.iconBlue },
  lowest: { color: jira.color.iconBlue }
});

export const typeTone = styleVariants({
  task: { color: jira.color.iconBlue },
  epic: { color: jira.color.iconPurple },
  bug: { color: jira.color.iconRed },
  feature: { color: jira.color.iconLime },
  story: { color: jira.color.iconLime },
  subtask: { color: jira.color.iconBlue }
});

export const shareTable = style({
  marginTop: "16px",
  flex: 1,
  minHeight: 0,
  overflow: "auto",
  display: "grid",
  gridTemplateColumns: "180px minmax(0, 1fr)",
  alignContent: "start",
  columnGap: 0
});

export const shareHead = style({
  position: "sticky",
  top: 0,
  zIndex: 1,
  height: "24px",
  background: jira.color.surface,
  color: jira.color.textSubtle,
  font: font.headingXxsmall
});

export const shareRow = style({
  display: "contents"
});

export const shareName = style({
  height: "40px",
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: jira.color.text,
  textDecoration: "none",
  font: font.body,
  selectors: {
    "&:hover": { textDecoration: "underline" }
  }
});

export const shareNameText = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
});

export const shareBar = style({
  position: "relative",
  height: "40px",
  display: "flex",
  alignItems: "center"
});

export const barTrack = style({ fill: jira.color.track });
export const barFill = style({ fill: jira.color.chartNeutral });

export const barLabel = style({
  position: "absolute",
  left: "8px",
  font: font.body,
  color: jira.color.textInverse
});

export const barLabelOutside = style({
  color: jira.color.textSubtle
});

export const epicList = style({
  margin: "12px 0 0",
  padding: 0,
  listStyle: "none",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px"
});

export const epicHead = style({
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  marginBottom: "6px",
  font: font.body
});

export const epicDone = style({ fill: jira.color.chart2 });
export const epicProgress = style({ fill: jira.color.chart1 });
