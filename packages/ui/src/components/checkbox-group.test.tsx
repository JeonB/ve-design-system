import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckboxGroup } from "./checkbox-group";

afterEach(() => {
  cleanup();
});

describe("CheckboxGroup", () => {
  it("legend와 옵션을 렌더한다", () => {
    render(
      <CheckboxGroup name="roles" legend="Roles" defaultValue={["editor"]}>
        <CheckboxGroup.Item value="admin">Admin</CheckboxGroup.Item>
        <CheckboxGroup.Item value="editor">Editor</CheckboxGroup.Item>
      </CheckboxGroup>
    );

    expect(screen.getByText("Roles")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Editor" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Admin" })).not.toBeChecked();
  });

  it("선택 변경 시 onValueChange를 호출한다", () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup name="roles" value={["editor"]} onValueChange={onValueChange} legend="Roles">
        <CheckboxGroup.Item value="admin">Admin</CheckboxGroup.Item>
        <CheckboxGroup.Item value="editor">Editor</CheckboxGroup.Item>
      </CheckboxGroup>
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Admin" }));
    expect(onValueChange).toHaveBeenCalledWith(["editor", "admin"]);
  });
});
