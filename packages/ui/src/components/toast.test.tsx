import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./toast";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Trigger() {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast({ title: "Saved", variant: "success" })}>
      Notify
    </button>
  );
}

describe("Toast", () => {
  it("Provider 밖 useToast는 오류를 던진다", () => {
    expect(() => render(<Trigger />)).toThrow(/ToastProvider/);
  });

  it("toast 호출 시 status를 렌더한다", () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });

  it("duration 후 자동으로 사라진다", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByRole("status")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
