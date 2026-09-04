import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Field } from "./field";
import { Textarea } from "./textarea";

afterEach(() => {
  cleanup();
});

describe("Textarea", () => {
  it("텍스트 영역을 렌더한다", () => {
    render(<Textarea name="notes" placeholder="Add notes" />);

    expect(screen.getByPlaceholderText("Add notes")).toHaveAttribute("name", "notes");
  });

  it("Field 레이블·오류와 연결한다", () => {
    render(
      <Field invalid>
        <Field.Label>Notes</Field.Label>
        <Textarea name="notes" />
        <Field.Error>Required</Field.Error>
      </Field>
    );

    const control = screen.getByRole("textbox", { name: "Notes" });
    const error = screen.getByRole("alert");

    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("resize와 size 메타데이터를 노출한다", () => {
    const { container } = render(<Textarea aria-label="Bio" resize="none" size="lg" />);
    const shell = container.querySelector('[data-slot="textarea"]');

    expect(shell).toHaveAttribute("data-resize", "none");
    expect(shell).toHaveAttribute("data-size", "lg");
  });

  it("Field disabled를 상속한다", () => {
    render(
      <Field disabled>
        <Field.Label>Comment</Field.Label>
        <Textarea name="comment" />
      </Field>
    );

    expect(screen.getByRole("textbox", { name: "Comment" })).toBeDisabled();
  });
});
