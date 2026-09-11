import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Dialog } from "./dialog";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("Dialog", () => {
  it("open일 때 dialog role을 렌더한다", () => {
    render(
      <Dialog open>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete item</Dialog.Title>
            <Dialog.Description>This cannot be undone.</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>
    );

    expect(screen.getByRole("dialog", { name: "Delete item" })).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("Esc로 닫힌다", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Confirm</Dialog.Title>
        </Dialog.Content>
      </Dialog>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("닫기 버튼이 onOpenChange(false)를 호출한다", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Content>
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Close />
          <Dialog.Footer>
            <Button type="button">OK</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("닫혀 있으면 포털을 렌더하지 않는다", () => {
    render(
      <Dialog open={false}>
        <Dialog.Content>
          <Dialog.Title>Hidden</Dialog.Title>
        </Dialog.Content>
      </Dialog>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
