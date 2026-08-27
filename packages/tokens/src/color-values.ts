/** light / dark에서 값이 달라지는 토큰 페이로드. */
export const lightColorTokens = {
  color: {
    background: "#ffffff",
    foreground: "#111827",
    transparent: "transparent",
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
  shadow: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
    none: "none"
  }
} as const;

export const darkColorTokens = {
  color: {
    background: "#0b1220",
    foreground: "#f3f4f6",
    transparent: "transparent",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    primaryHover: "#60a5fa",
    primarySubtle: "#1e3a5f",
    secondary: "#1f2937",
    secondaryForeground: "#e5e7eb",
    secondaryHover: "#374151",
    danger: "#f87171",
    dangerForeground: "#111827",
    dangerHover: "#fca5a5",
    dangerSubtle: "#3f1d1d",
    dangerBorder: "#7f1d1d",
    muted: "#1f2937",
    mutedForeground: "#9ca3af",
    border: "#374151",
    ring: "#60a5fa",
    ghostHover: "rgba(255, 255, 255, 0.08)"
  },
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.45)",
    none: "none"
  }
} as const;
