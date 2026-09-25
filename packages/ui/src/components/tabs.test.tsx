import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Tabs } from "./tabs";

afterEach(() => {
  cleanup();
});

function Demo({
  value,
  onValueChange
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs defaultValue="general" value={value} onValueChange={onValueChange}>
      <Tabs.List aria-label="Settings">
        <Tabs.Trigger value="general">General</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="general">General panel</Tabs.Content>
      <Tabs.Content value="billing">Billing panel</Tabs.Content>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("기본 탭 패널을 표시한다", () => {
    render(<Demo />);
    expect(screen.getByRole("tab", { name: "General" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("General panel");
    expect(screen.queryByText("Billing panel")).not.toBeInTheDocument();
  });

  it("트리거 클릭으로 탭을 전환한다", () => {
    render(<Demo />);
    fireEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
  });

  it("화살표 키로 다음 탭을 활성화한다", () => {
    render(<Demo />);
    const general = screen.getByRole("tab", { name: "General" });
    general.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Billing panel");
  });
});
