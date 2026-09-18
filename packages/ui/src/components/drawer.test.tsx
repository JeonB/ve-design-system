import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Drawer } from "./drawer";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("Drawer", () => {
  it("open이면 dialog role과 side를 렌더한다", () => {
    render(
      <Drawer open side="left">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Settings</Drawer.Title>
          </Drawer.Header>
        </Drawer.Content>
      </Drawer>
    );

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("data-side", "left");
  });

  it("Esc로 닫힌다", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <Drawer.Content>
          <Drawer.Title>Panel</Drawer.Title>
        </Drawer.Content>
      </Drawer>
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
