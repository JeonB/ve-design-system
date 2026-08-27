/** 모드 비의존 정적 토큰 (:root). color / shadow는 color-theme에서 관리한다. */
import { createGlobalTheme } from "@vanilla-extract/css";

export const staticVars = createGlobalTheme(":root", {
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
      regular: "400",
      semibold: "600"
    },
    lineHeight: {
      tight: "1",
      normal: "1.4"
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
    },
    input: {
      height: {
        sm: "32px",
        md: "40px",
        lg: "48px"
      },
      padding: {
        sm: "4px 10px",
        md: "8px 12px",
        lg: "10px 14px"
      },
      minWidth: "12rem"
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
        "background 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease, transform 80ms ease",
      input: "background 120ms ease, border-color 120ms ease, box-shadow 120ms ease, opacity 120ms ease"
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
  zIndex: {
    focus: "1"
  },
  layout: {
    full: "100%"
  }
});
