import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Field } from "./field";
import { Input } from "./input";

afterEach(() => {
  cleanup();
});

describe("Input", () => {
  it("텍스트박스를 렌더한다", () => {
    render(<Input name="email" placeholder="you@company.com" />);

    expect(screen.getByPlaceholderText("you@company.com")).toHaveAttribute("name", "email");
  });

  it("disabled와 invalid 상태를 노출한다", () => {
    const { rerender } = render(<Input aria-label="Name" disabled />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeDisabled();

    rerender(<Input aria-label="Name" invalid />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest("[data-slot='input']")).toHaveAttribute("data-invalid", "true");
  });

  it("leftIcon과 rightIcon을 렌더한다", () => {
    render(
      <Input
        aria-label="Search"
        leftIcon={<span data-testid="left">⌕</span>}
        rightIcon={<span data-testid="right">×</span>}
      />
    );

    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });
});

describe("Field", () => {
  it("레이블과 Input id를 연결한다", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const label = screen.getByText("Email");
    expect(label).toHaveAttribute("for", input.id);
  });

  it("설명과 오류를 aria-describedby로 연결한다", () => {
    render(
      <Field invalid>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
        <Field.Description>Work email only.</Field.Description>
        <Field.Error>Enter a valid email.</Field.Error>
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const description = screen.getByText("Work email only.");
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(description.id);
    expect(input.getAttribute("aria-describedby")).toContain(error.id);
    expect(error).toHaveTextContent("Enter a valid email.");
  });

  it("사용자 aria-describedby와 커스텀 설명 id를 병합한다", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input aria-describedby="extra-hint" name="email" />
        <Field.Description id="email-hint">Work email only.</Field.Description>
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const describedBy = input.getAttribute("aria-describedby");

    expect(describedBy).toContain("extra-hint");
    expect(describedBy).toContain("email-hint");
  });

  it("required 레이블에 시각적 표시를 붙인다", () => {
    render(
      <Field required>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
      </Field>
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeRequired();
  });

  it("invalid가 아니면 오류 메시지를 alert로 알리지 않는다", () => {
    render(
      <Field>
        <Field.Label>Email</Field.Label>
        <Input name="email" />
        <Field.Error>Enter a valid email.</Field.Error>
      </Field>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
  });

  it("Field disabled를 Input에 전달한다", () => {
    render(
      <Field disabled>
        <Field.Label>Team</Field.Label>
        <Input name="team" />
      </Field>
    );

    expect(screen.getByRole("textbox", { name: "Team" })).toBeDisabled();
  });
});
