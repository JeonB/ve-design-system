import { createGlobalTheme, createThemeContract, globalStyle } from "@vanilla-extract/css";
import { darkTheme } from "@ve/tokens";

const FONT_FAMILY =
  '"Atlassian Sans", "Inter Variable", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif';

export const jira = createThemeContract({
  color: {
    surface: null,
    text: null,
    textSubtle: null,
    textSubtlest: null,
    textInverse: null,
    link: null,
    brand: null,
    brandHovered: null,
    border: null,
    borderInput: null,
    selected: null,
    neutral: null,
    neutralHovered: null,
    track: null,
    chartNeutral: null,
    chartNeutralHovered: null,
    chart1: null,
    chart2: null,
    chart3: null,
    chart4: null,
    chart5: null,
    chart6: null,
    iconRed: null,
    iconOrange: null,
    iconBlue: null,
    iconPurple: null,
    iconLime: null
  }
});

createGlobalTheme(":root", jira, {
  color: {
    surface: "#FFFFFF",
    text: "#292A2E",
    textSubtle: "#505258",
    textSubtlest: "#6B6E76",
    textInverse: "#FFFFFF",
    link: "#1868DB",
    brand: "#1868DB",
    brandHovered: "#1558BC",
    border: "#0B120E24",
    borderInput: "#8C8F97",
    selected: "#E9F2FE",
    neutral: "#0515240F",
    neutralHovered: "#0B120E24",
    track: "#DDDEE1",
    chartNeutral: "#8C8F97",
    chartNeutralHovered: "#7D818A",
    chart1: "#357DE8",
    chart2: "#82B536",
    chart3: "#BF63F3",
    chart4: "#F68909",
    chart5: "#1558BC",
    chart6: "#964AC0",
    iconRed: "#F15B50",
    iconOrange: "#E06C00",
    iconBlue: "#4688EC",
    iconPurple: "#BF63F3",
    iconLime: "#6A9A23"
  }
});

createGlobalTheme(`:root.${darkTheme}`, jira, {
  color: {
    surface: "#1F1F21",
    text: "#CECFD2",
    textSubtle: "#A9ABAF",
    textSubtlest: "#96999E",
    textInverse: "#1F1F21",
    link: "#669DF1",
    brand: "#669DF1",
    brandHovered: "#8FB8F6",
    border: "#E3E4F21F",
    borderInput: "#7E8188",
    selected: "#1C2B42",
    neutral: "#CECED912",
    neutralHovered: "#E3E4F21F",
    track: "#3D3F43",
    chartNeutral: "#8C8F97",
    chartNeutralHovered: "#A9ABAF",
    chart1: "#4688EC",
    chart2: "#82B536",
    chart3: "#BF63F3",
    chart4: "#F68909",
    chart5: "#669DF1",
    chart6: "#BF63F3",
    iconRed: "#F87168",
    iconOrange: "#F68909",
    iconBlue: "#669DF1",
    iconPurple: "#CD86F4",
    iconLime: "#94C748"
  }
});

export const font = {
  family: FONT_FAMILY,
  body: `normal 400 14px/20px ${FONT_FAMILY}`,
  bodySmall: `normal 400 12px/16px ${FONT_FAMILY}`,
  headingXxsmall: `normal 653 12px/16px ${FONT_FAMILY}`,
  headingXsmall: `normal 653 14px/20px ${FONT_FAMILY}`,
  headingSmall: `normal 653 16px/20px ${FONT_FAMILY}`,
  headingMedium: `normal 653 20px/24px ${FONT_FAMILY}`,
  headingLarge: `normal 653 24px/28px ${FONT_FAMILY}`
} as const;

export const radius = {
  small: "4px",
  medium: "6px",
  large: "8px",
  xlarge: "12px"
} as const;

globalStyle("body", {
  font: font.body,
  color: jira.color.text,
  background: jira.color.surface
});
