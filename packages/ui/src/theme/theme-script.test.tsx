import { afterEach, describe, expect, it, vi } from "vitest";
import { darkTheme, lightTheme } from "@ve/tokens";
import { getThemeInitScript, ThemeScript } from "./theme-script";
import { cleanup, render } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove(lightTheme, darkTheme);
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
  vi.unstubAllGlobals();
});

describe("getThemeInitScript", () => {
  it("light/dark 클래스명과 storageKey를 인라인한다", () => {
    const script = getThemeInitScript({ storageKey: "ve-theme-test", defaultMode: "light" });

    expect(script).toContain(lightTheme);
    expect(script).toContain(darkTheme);
    expect(script).toContain("ve-theme-test");
    expect(script.startsWith("(function(){")).toBe(true);
  });

  it("storage dark면 documentElement에 dark를 적용한다", () => {
    window.localStorage.setItem("ve-theme-fouc", "dark");
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
        onchange: null
      }))
    );

    // eslint-disable-next-line no-new-func -- FOUC 스크립트 런타임 검증
    new Function(getThemeInitScript({ storageKey: "ve-theme-fouc", defaultMode: "light" }))();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.classList.contains(darkTheme)).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it("system + prefers dark면 dark를 적용한다", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => true,
        onchange: null
      }))
    );

    // eslint-disable-next-line no-new-func -- FOUC 스크립트 런타임 검증
    new Function(getThemeInitScript({ storageKey: "ve-theme-system", defaultMode: "system" }))();

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});

describe("ThemeScript", () => {
  it("script 태그에 초기화 코드를 렌더한다", () => {
    const { container } = render(<ThemeScript storageKey="ve-theme-el" defaultMode="light" />);
    const script = container.querySelector("script");

    expect(script?.innerHTML).toContain("ve-theme-el");
    expect(script?.innerHTML).toContain(lightTheme);
  });
});
