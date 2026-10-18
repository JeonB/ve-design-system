import { style, styleVariants } from "@vanilla-extract/css";
import { font, jira, radius } from "./jira-theme.css";

const focusRing = {
  outline: `2px solid ${jira.color.link}`,
  outlineOffset: "2px"
} as const;

export const topNav = style({
  height: "48px",
  flex: "none",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  gap: "12px",
  padding: "0 12px",
  borderBottom: `1px solid ${jira.color.border}`,
  background: jira.color.surface,
  color: jira.color.text,
  font: font.body
});

export const topStart = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  minWidth: 0
});

export const topCenter = style({
  display: "flex",
  alignItems: "center",
  gap: "8px"
});

export const topEnd = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "4px",
  minWidth: 0
});

export const iconButton = style({
  width: "32px",
  height: "32px",
  flex: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  border: "none",
  borderRadius: radius.small,
  background: "transparent",
  color: jira.color.textSubtle,
  cursor: "pointer",
  textDecoration: "none",
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&:focus-visible": focusRing
  }
});

export const iconButtonOutline = style({
  border: `1px solid ${jira.color.border}`,
  borderRadius: radius.medium
});

export const badgeCount = style({
  position: "absolute",
  top: "2px",
  right: "0",
  minWidth: "16px",
  height: "16px",
  padding: "0 4px",
  borderRadius: "8px",
  background: jira.color.brand,
  color: jira.color.textInverse,
  font: font.headingXxsmall,
  fontSize: "11px",
  lineHeight: "16px",
  textAlign: "center"
});

export const appHome = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  height: "32px",
  padding: "0 4px",
  marginLeft: "4px",
  borderRadius: radius.small,
  color: jira.color.text,
  textDecoration: "none",
  font: font.headingXsmall,
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&:focus-visible": focusRing
  }
});

export const appMark = style({
  width: "24px",
  height: "24px",
  borderRadius: radius.medium,
  background: jira.color.brand,
  color: jira.color.textInverse,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  font: font.headingXsmall
});

export const searchBox = style({
  position: "relative",
  width: "777px",
  maxWidth: "calc(100vw - 760px)",
  minWidth: "120px"
});

export const searchIcon = style({
  position: "absolute",
  left: "8px",
  top: "8px",
  color: jira.color.textSubtle,
  pointerEvents: "none"
});

export const searchInput = style({
  width: "100%",
  height: "32px",
  padding: "0 8px 0 32px",
  border: `1px solid ${jira.color.borderInput}`,
  borderRadius: radius.medium,
  background: jira.color.surface,
  color: jira.color.text,
  font: font.body,
  selectors: {
    "&::placeholder": { color: jira.color.textSubtle },
    "&:hover": { background: jira.color.neutral },
    "&:focus": {
      outline: "none",
      borderColor: jira.color.link,
      boxShadow: `inset 0 0 0 1px ${jira.color.link}`,
      background: jira.color.surface
    }
  }
});

export const createButton = style({
  height: "32px",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  padding: "0 12px 0 10px",
  border: "none",
  borderRadius: radius.small,
  background: jira.color.brand,
  color: jira.color.textInverse,
  font: font.headingXsmall,
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: jira.color.brandHovered },
    "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
    "&:focus-visible": focusRing
  }
});

export const actorSelect = style({
  height: "32px",
  maxWidth: "160px",
  padding: "0 4px",
  border: "1px solid transparent",
  borderRadius: radius.small,
  background: jira.color.surface,
  color: jira.color.textSubtle,
  font: font.body,
  fontWeight: 500,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&:focus-visible": focusRing
  }
});

export const avatar = style({
  width: "24px",
  height: "24px",
  flex: "none",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: jira.color.track,
  color: jira.color.textSubtle,
  font: font.headingXxsmall,
  fontSize: "10px"
});

export const sideNav = style({
  width: "320px",
  flex: "none",
  overflow: "auto",
  padding: "12px",
  borderRight: `1px solid ${jira.color.border}`,
  background: jira.color.surface,
  color: jira.color.textSubtle,
  font: font.body,
  "@media": {
    "screen and (max-width: 800px)": {
      width: "100%",
      maxHeight: "40vh",
      borderRight: "none",
      borderBottom: `1px solid ${jira.color.border}`
    }
  }
});

export const sideList = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column"
});

export const sideRow = style({
  position: "relative",
  height: "32px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "0 8px",
  borderRadius: radius.small,
  color: jira.color.textSubtle,
  textDecoration: "none",
  font: font.body,
  fontWeight: 500,
  selectors: {
    "&:hover": { background: jira.color.neutral },
    "&:focus-visible": focusRing
  }
});

export const sideRowNested = style({
  marginLeft: "12px"
});

export const sideRowActive = style({
  background: jira.color.selected,
  color: jira.color.link,
  selectors: {
    "&:hover": { background: jira.color.selected },
    "&::before": {
      content: "",
      position: "absolute",
      left: 0,
      top: "8px",
      bottom: "8px",
      width: "2px",
      borderRadius: "1px",
      background: jira.color.link
    }
  }
});

export const sideRowEnd = style({
  marginLeft: "auto",
  color: jira.color.textSubtlest,
  font: font.bodySmall
});

export const sideGroup = style({
  margin: 0,
  height: "32px",
  display: "flex",
  alignItems: "center",
  padding: "0 8px 0 20px",
  color: jira.color.textSubtlest,
  font: font.headingXxsmall
});

export const spaceIcon = style({
  width: "20px",
  height: "20px",
  flex: "none",
  borderRadius: radius.small,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#FFFFFF",
  font: font.headingXxsmall,
  fontSize: "11px"
});

export const TONE_COUNT = 6;

export const tone = styleVariants({
  0: { background: jira.color.chart1, color: "#FFFFFF" },
  1: { background: jira.color.chart2, color: "#FFFFFF" },
  2: { background: jira.color.chart3, color: "#FFFFFF" },
  3: { background: jira.color.chart4, color: "#FFFFFF" },
  4: { background: jira.color.chart5, color: "#FFFFFF" },
  5: { background: jira.color.chart6, color: "#FFFFFF" }
});

export const spaceHeader = style({
  flex: "none",
  padding: "16px 24px 0",
  borderBottom: `1px solid ${jira.color.border}`,
  background: jira.color.surface,
  color: jira.color.text
});

export const breadcrumb = style({
  display: "inline-block",
  color: jira.color.textSubtle,
  font: font.body,
  textDecoration: "none",
  selectors: {
    "&:hover": { textDecoration: "underline" }
  }
});

export const spaceTitleRow = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "4px"
});

export const spaceTitle = style({
  margin: 0,
  font: font.headingMedium,
  color: jira.color.text
});

export const tabs = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  height: "39px",
  margin: "0 0 0 -2px",
  padding: 0,
  listStyle: "none"
});

export const tab = style({
  height: "40px",
  marginBottom: "-1px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 4px 0",
  color: jira.color.textSubtle,
  textDecoration: "none",
  font: font.body,
  fontWeight: 500,
  borderBottom: "2px solid transparent",
  selectors: {
    "&:hover": { color: jira.color.text, borderBottomColor: jira.color.border },
    "&:focus-visible": focusRing
  }
});

export const tabActive = style({
  color: jira.color.link,
  borderBottomColor: jira.color.link,
  selectors: {
    "&:hover": { color: jira.color.link, borderBottomColor: jira.color.link }
  }
});
