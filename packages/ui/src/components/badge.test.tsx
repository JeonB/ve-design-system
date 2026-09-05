import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Badge, BADGE_VARIANTS } from "./badge";
import { ThemeProvider } from "../theme/theme-provider";

afterEach(() => {
  cleanup();
});

describe("Badge", () => {
  it("레이블을 렌더한다", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("variant와 size 메타데이터를 노출한다", () => {
    render(
      <Badge variant="success" size="sm">
        OK
      </Badge>
    );

    const badge = screen.getByText("OK");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "success");
    expect(badge).toHaveAttribute("data-size", "sm");
  });

  it("모든 variant 옵션을 나열한다", () => {
    expect(BADGE_VARIANTS).toEqual([
      "neutral",
      "primary",
      "success",
      "warning",
      "danger",
      "outline"
    ]);
  });

  it("dark 테마에서도 렌더된다", () => {
    render(
      <ThemeProvider forcedMode="dark" storageKey="ve-badge-theme">
        <Badge variant="warning">Due soon</Badge>
      </ThemeProvider>
    );

    expect(screen.getByText("Due soon")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
