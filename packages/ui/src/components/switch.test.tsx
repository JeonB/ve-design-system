import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

afterEach(() => {
  cleanup();
});

describe("Switch", () => {
  it("role=switch로 렌더한다", () => {
    render(<Switch aria-label="Alerts" />);
    expect(screen.getByRole("switch", { name: "Alerts" })).toHaveAttribute("aria-checked", "false");
  });

  it("토글 시 onCheckedChange를 호출한다", () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Alerts" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("switch", { name: "Alerts" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("switch", { name: "Alerts" })).toHaveAttribute("aria-checked", "true");
  });

  it("disabled면 토글되지 않는다", () => {
    const onCheckedChange = vi.fn();
    render(<Switch aria-label="Alerts" disabled onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("switch", { name: "Alerts" }));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
