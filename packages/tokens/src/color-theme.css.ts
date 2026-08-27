import { createGlobalTheme, createTheme, createThemeContract } from "@vanilla-extract/css";
import { darkColorTokens, lightColorTokens } from "./color-values";

/** color / shadow 테마 contract. light는 :root 기본값, dark는 클래스 오버라이드. */
export const colorContract = createThemeContract({
  color: {
    background: null,
    foreground: null,
    transparent: null,
    primary: null,
    primaryForeground: null,
    primaryHover: null,
    primarySubtle: null,
    secondary: null,
    secondaryForeground: null,
    secondaryHover: null,
    danger: null,
    dangerForeground: null,
    dangerHover: null,
    dangerSubtle: null,
    dangerBorder: null,
    muted: null,
    mutedForeground: null,
    border: null,
    ring: null,
    ghostHover: null
  },
  shadow: {
    sm: null,
    none: null
  }
});

/** ThemeProvider 없이 로드해도 light 팔레트가 동작하도록 :root에 바인딩한다. */
createGlobalTheme(":root", colorContract, lightColorTokens);

/** 명시적 light 클래스 (스토리·중첩 스코프용). */
export const lightTheme = createTheme(colorContract, lightColorTokens);

/** dark 모드 클래스. documentElement에 적용하면 :root 변수를 덮어쓴다. */
export const darkTheme = createTheme(colorContract, darkColorTokens);

export const themes = {
  light: lightTheme,
  dark: darkTheme
} as const;
