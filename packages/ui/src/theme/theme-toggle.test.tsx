import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("ThemeToggle", () => {
  it("클릭 시 dark로 전환한다", () => {
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

    render(
      <ThemeProvider defaultMode="light" storageKey="ve-theme-toggle">
        <ThemeToggle />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
