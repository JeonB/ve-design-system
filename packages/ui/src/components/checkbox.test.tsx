import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";
import { Field } from "./field";

afterEach(() => {
  cleanup();
});

describe("Checkbox", () => {
  it("체크박스를 렌더한다", () => {
    render(<Checkbox aria-label="Accept" name="tos" />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toHaveAttribute("name", "tos");
  });

  it("클릭 시 onCheckedChange를 호출한다", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />);

    fireEvent.click(screen.getByRole("checkbox", { name: "Accept" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("Field 레이블과 연결한다", () => {
    render(
      <Field>
        <Checkbox />
        <Field.Label>Accept terms</Field.Label>
      </Field>
    );

    expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
  });

  it("indeterminate와 invalid 상태를 노출한다", () => {
    const { container } = render(
      <Checkbox aria-label="All" indeterminate invalid defaultChecked />
    );
    const root = container.querySelector('[data-slot="checkbox"]');

    expect(root).toHaveAttribute("data-indeterminate", "true");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(screen.getByRole("checkbox", { name: "All" })).toHaveProperty("indeterminate", true);
  });
});
