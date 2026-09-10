import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Field } from "./field";
import { Select } from "./select";

afterEach(() => {
  cleanup();
});

describe("Select", () => {
  it("옵션을 렌더한다", () => {
    render(
      <Select aria-label="Plan" name="plan" defaultValue="pro">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </Select>
    );

    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveValue("pro");
  });

  it("Field 레이블·오류와 연결한다", () => {
    render(
      <Field invalid>
        <Field.Label>Plan</Field.Label>
        <Select name="plan">
          <option value="free">Free</option>
        </Select>
        <Field.Error>Required</Field.Error>
      </Field>
    );

    const control = screen.getByRole("combobox", { name: "Plan" });
    const error = screen.getByRole("alert");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("size 메타데이터를 노출한다", () => {
    const { container } = render(
      <Select aria-label="Plan" size="sm">
        <option value="a">A</option>
      </Select>
    );

    expect(container.querySelector('[data-slot="select"]')).toHaveAttribute("data-size", "sm");
  });
});
