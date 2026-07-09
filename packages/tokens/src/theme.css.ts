import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    background: "#ffffff",
    foreground: "#111827",
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    border: "#e5e7eb"
  },
  space: {
    x1: "4px",
    x2: "8px",
    x3: "12px",
    x4: "16px"
  },
  radius: {
    sm: "6px",
    md: "10px"
  },
  font: {
    body: "Inter, system-ui, -apple-system, sans-serif"
  }
});
