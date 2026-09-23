import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Alert, ALERT_VARIANTS } from "./alert";

afterEach(() => {
  cleanup();
});

describe("Alert", () => {
  it("title과 본문을 렌더한다", () => {
    render(
      <Alert title="Saved" variant="success">
        Draft is up to date.
      </Alert>
    );

    expect(screen.getByRole("status")).toHaveAttribute("data-variant", "success");
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Draft is up to date.")).toBeInTheDocument();
  });

  it("warning/danger는 alert 역할을 쓴다", () => {
    const { rerender } = render(<Alert title="Careful" variant="warning" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "warning");

    rerender(<Alert title="Failed" variant="danger" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "danger");
  });

  it("모든 variant 옵션을 나열한다", () => {
    expect(ALERT_VARIANTS).toEqual(["neutral", "info", "success", "warning", "danger"]);
  });
});
