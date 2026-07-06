import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    background: "#ffffff",
    foreground: "#111827",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    primaryHover: "#1d4ed8",
    primarySubtle: "#eff6ff",
    secondary: "#f3f4f6",
    secondaryForeground: "#374151",
    secondaryHover: "#e5e7eb",
    danger: "#dc2626",
    dangerForeground: "#ffffff",
    dangerHover: "#b91c1c",
    dangerSubtle: "#fef2f2",
    dangerBorder: "#fecaca",
    muted: "#f3f4f6",
    mutedForeground: "#6b7280",
    border: "#e5e7eb",
    ring: "#2563eb",
    ghostHover: "rgba(17, 24, 39, 0.06)"
  },
  space: {
    x1: "4px",
    x2: "8px",
    x3: "12px",
    x4: "16px",
    x5: "20px",
    x6: "24px"
  },
  radius: {
    sm: "6px",
    md: "10px"
  },
  font: {
    body: "Inter, system-ui, -apple-system, sans-serif"
  },
  size: {
    iconSm: "14px",
    iconMd: "16px",
    iconLg: "18px"
  },
  shadow: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.06)"
  }
});
