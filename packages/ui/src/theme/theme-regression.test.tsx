import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { darkTheme, lightTheme, themes } from "@ve/tokens";
import { Button } from "../components/button";
import { Field } from "../components/field";
import { Input } from "../components/input";
import { ThemeProvider } from "./theme-provider";

afterEach(() => {
  cleanup();
  document.documentElement.classList.remove(lightTheme, darkTheme);
  document.documentElement.removeAttribute("data-theme");
});

describe("theme migration regression", () => {
  it("tokens themes 클래스가 light/dark로 구분된다", () => {
    expect(lightTheme).toBeTruthy();
    expect(darkTheme).toBeTruthy();
    expect(lightTheme).not.toBe(darkTheme);
    expect(themes.light).toBe(lightTheme);
    expect(themes.dark).toBe(darkTheme);
  });

  it("dark ThemeProvider 아래 Button·Field·Input이 렌더된다", () => {
    render(
      <ThemeProvider forcedMode="dark" storageKey="ve-theme-regression">
        <Button>Save</Button>
        <Field>
          <Field.Label>Email</Field.Label>
          <Input name="email" />
        </Field>
      </ThemeProvider>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.classList.contains(darkTheme)).toBe(true);
  });
});
