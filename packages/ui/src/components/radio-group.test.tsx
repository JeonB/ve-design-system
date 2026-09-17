import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./radio-group";

afterEach(() => {
  cleanup();
});

describe("RadioGroup", () => {
  it("옵션을 렌더하고 기본값을 체크한다", () => {
    render(
      <RadioGroup name="plan" legend="Plan" defaultValue="pro">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
  });

  it("선택 변경 시 onValueChange를 호출한다", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" value="pro" onValueChange={onValueChange} legend="Plan">
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>
    );

    fireEvent.click(screen.getByRole("radio", { name: "Free" }));
    expect(onValueChange).toHaveBeenCalledWith("free");
  });
});
