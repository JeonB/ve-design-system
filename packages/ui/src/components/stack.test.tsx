import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Separator } from "./separator";
import { Stack } from "./stack";

afterEach(() => {
  cleanup();
});

describe("Stack", () => {
  it("자식과 gap 메타데이터를 렌더한다", () => {
    render(
      <Stack gap="lg" data-testid="stack">
        <span>A</span>
        <span>B</span>
      </Stack>
    );

    expect(screen.getByTestId("stack")).toHaveAttribute("data-gap", "lg");
    expect(screen.getByTestId("stack")).toHaveAttribute("data-slot", "stack");
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("horizontal direction을 설정한다", () => {
    render(
      <Stack direction="horizontal" data-testid="row">
        <span>1</span>
      </Stack>
    );
    expect(screen.getByTestId("row")).toHaveAttribute("data-direction", "horizontal");
  });
});

describe("Separator", () => {
  it("decorative면 role=none이다", () => {
    const { container } = render(<Separator />);
    const el = container.querySelector('[data-slot="separator"]');
    expect(el).toHaveAttribute("role", "none");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("non-decorative면 separator role을 쓴다", () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const el = screen.getByRole("separator");
    expect(el).toHaveAttribute("aria-orientation", "vertical");
  });
});
