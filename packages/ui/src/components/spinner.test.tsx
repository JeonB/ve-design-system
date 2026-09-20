import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

afterEach(() => {
  cleanup();
});

describe("Spinner", () => {
  it("장식용으로 aria-hidden을 유지한다", () => {
    const { container } = render(<Spinner />);
    const el = container.querySelector("[data-slot='spinner']");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-size", "md");
  });

  it("label이 있으면 status로 안내한다", () => {
    render(<Spinner label="Loading" size="sm" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(screen.getByRole("status")).toHaveAttribute("data-size", "sm");
  });
});
