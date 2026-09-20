import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

afterEach(() => {
  cleanup();
});

describe("Skeleton", () => {
  it("aria-hidden 플레이스홀더를 렌더한다", () => {
    const { container } = render(<Skeleton data-testid="sk" />);
    const el = screen.getByTestId("sk");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-slot", "skeleton");
    expect(el).toHaveAttribute("data-variant", "rect");
    expect(container.querySelector("[data-slot='skeleton']")).toBeTruthy();
  });

  it("circle variant와 크기를 적용한다", () => {
    render(<Skeleton data-testid="avatar" variant="circle" width={40} height={40} />);
    const el = screen.getByTestId("avatar");
    expect(el).toHaveAttribute("data-variant", "circle");
    expect(el).toHaveStyle({ width: "40px", height: "40px" });
  });
});
