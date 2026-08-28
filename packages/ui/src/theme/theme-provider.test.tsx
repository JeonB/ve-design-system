import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { darkTheme, lightTheme } from "@ve/tokens";
import { ThemeProvider, useTheme } from "./theme-provider";

function ThemeProbe() {
  const { mode, resolvedTheme, setMode, toggle } = useTheme();

  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button type="button" onClick={() => setMode("dark")}>
        Set dark
      </button>
      <button type="button" onClick={() => setMode("light")}>
        Set light
      </button>
      <button type="button" onClick={() => setMode("system")}>
        Set system
      </button>
      <button type="button" onClick={toggle}>
        Toggle
      </button>
    </div>
  );
}

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const media = {
    matches,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    },
    removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    },
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
    emit(next: boolean) {
      media.matches = next;
      const event = { matches: next } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    }
  };

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media)
  );

  return media;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.localStorage.clear();
  document.documentElement.classList.remove(lightTheme, darkTheme);
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.style.colorScheme = "";
});

beforeEach(() => {
  mockMatchMedia(false);
  window.localStorage.clear();
});

describe("ThemeProvider", () => {
  it("Provider 밖 useTheme는 오류를 던진다", () => {
    expect(() => render(<ThemeProbe />)).toThrow(/ThemeProvider/);
  });

  it("defaultMode light를 documentElement에 적용한다", () => {
    render(
      <ThemeProvider defaultMode="light" storageKey="ve-theme-test">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement.classList.contains(lightTheme)).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("setMode로 dark로 전환하고 storage에 저장한다", () => {
    render(
      <ThemeProvider defaultMode="light" storageKey="ve-theme-test">
        <ThemeProbe />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Set dark" }));

    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.classList.contains(darkTheme)).toBe(true);
    expect(window.localStorage.getItem("ve-theme-test")).toBe("dark");
  });

  it("system 모드는 prefers-color-scheme을 따른다", () => {
    const media = mockMatchMedia(true);

    render(
      <ThemeProvider defaultMode="system" storageKey="ve-theme-test">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("system");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");

    act(() => {
      media.emit(false);
    });
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
  });

  it("toggle은 resolved 반대 모드로 고정한다", () => {
    render(
      <ThemeProvider defaultMode="light" storageKey="ve-theme-test">
        <ThemeProbe />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    expect(screen.getByTestId("resolved")).toHaveTextContent("dark");
  });

  it("forcedMode는 storage와 setMode를 무시한다", () => {
    window.localStorage.setItem("ve-theme-test", "dark");

    render(
      <ThemeProvider defaultMode="dark" forcedMode="light" storageKey="ve-theme-test">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("light");
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");

    fireEvent.click(screen.getByRole("button", { name: "Set dark" }));
    expect(screen.getByTestId("resolved")).toHaveTextContent("light");
  });
});
