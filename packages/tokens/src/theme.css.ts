import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
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
  space: {
    x0: "0",
    x1: "4px",
    x2: "8px",
    x3: "12px",
    x4: "16px",
    x5: "20px",
    x6: "24px"
  },
  radius: {
    sm: "6px",
    md: "10px",
    full: "9999px",
    none: "0"
  },
  font: {
    body: "Inter, system-ui, -apple-system, sans-serif",
    size: {
      sm: "13px",
      md: "14px",
      lg: "16px"
    },
    weight: {
      semibold: "600"
    },
    lineHeight: {
      tight: "1"
    },
    decoration: {
      underlineOffset: "3px"
    }
  },
  component: {
    button: {
      height: {
        sm: "32px",
        md: "40px",
        lg: "48px",
        icon: "40px"
      },
      padding: {
        sm: "4px 12px",
        md: "8px 16px",
        lg: "12px 24px",
        icon: "8px"
      }
    }
  },
  size: {
    icon: {
      sm: "14px",
      md: "16px",
      lg: "18px"
    },
    border: {
      hairline: "1px",
      spinner: "2px",
      overlap: "-1px"
    }
  },
  motion: {
    duration: {
      fast: "120ms",
      press: "80ms",
      spinner: "600ms"
    },
    easing: {
      standard: "ease",
      linear: "linear"
    },
    transition: {
      button:
        "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease, transform 80ms ease"
    }
  },
  effect: {
    brightness: {
      active: "0.92",
      activeSoft: "0.97"
    },
    translate: {
      pressed: "1px"
    }
  },
  opacity: {
    disabled: "0.55"
  },
  focus: {
    ringWidth: "2px",
    ringOffset: "2px"
  },
  shadow: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
    none: "none"
  },
  zIndex: {
    focus: "1"
  },
  layout: {
    full: "100%"
  }
});
