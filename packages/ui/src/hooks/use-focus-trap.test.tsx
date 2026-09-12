import { useRef, useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useFocusTrap } from "./use-focus-trap";

afterEach(() => {
  cleanup();
});

function TrapDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(active, ref);

  return (
    <div ref={ref} data-testid="trap" tabIndex={-1}>
      <button type="button">First</button>
      <button type="button">Last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("활성화 시 첫 포커스 가능 요소로 이동한다", () => {
    render(<TrapDemo active />);
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });

  it("마지막에서 Tab이면 처음으로 순환한다", () => {
    render(<TrapDemo active />);
    const first = screen.getByRole("button", { name: "First" });
    const last = screen.getByRole("button", { name: "Last" });

    last.focus();
    fireEvent.keyDown(screen.getByTestId("trap"), { key: "Tab" });
    expect(first).toHaveFocus();
  });
});

describe("useFocusTrap inactive", () => {
  it("비활성이면 포커스를 강제하지 않는다", () => {
    function Demo() {
      const [active] = useState(false);
      return <TrapDemo active={active} />;
    }

    render(<Demo />);
    expect(screen.getByRole("button", { name: "First" })).not.toHaveFocus();
  });
});
