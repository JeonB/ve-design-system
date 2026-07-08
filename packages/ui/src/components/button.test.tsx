import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

afterEach(() => {
  cleanup();
});

describe("Button", () => {
  it("기본 type과 레이블을 렌더한다", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("disabled와 loading 시 비활성화된다", () => {
    const { rerender } = render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();

    rerender(<Button loading>Submit</Button>);
    const loadingButton = screen.getByRole("button", { name: "Submit 처리 중" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
  });

  it("loading 시 스크린 리더 안내를 제공한다", () => {
    render(
      <Button loading loadingText="Saving…">
        Save
      </Button>
    );

    expect(screen.getByText("Saving…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Saving…" })).toHaveAttribute(
      "data-loading",
      "true"
    );
  });

  it("iconOnly는 aria-label을 반영한다", () => {
    render(
      <Button iconOnly aria-label="Settings">
        <span>⚙</span>
      </Button>
    );

    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
  });

  it("leftIcon과 rightIcon을 렌더한다", () => {
    render(
      <Button
        leftIcon={<span data-testid="left">+</span>}
        rightIcon={<span data-testid="right">→</span>}
      >
        Next
      </Button>
    );

    expect(screen.getByTestId("left")).toBeInTheDocument();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });

  it("pressed 상태를 aria-pressed로 노출한다", () => {
    render(
      <Button pressed variant="secondary">
        Bold
      </Button>
    );

    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("클릭 핸들러를 호출한다", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    fireEvent.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("asChild로 자식 엘리먼트에 스타일을 전달한다", () => {
    render(
      <Button asChild variant="outline">
        <a href="https://example.com">Docs</a>
      </Button>
    );

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "https://example.com"
    );
  });

  it("asChild와 loading 조합은 오류를 던진다", () => {
    expect(() =>
      render(
        <Button asChild loading>
          <a href="/">Link</a>
        </Button>
      )
    ).toThrow();
  });
});

describe("ButtonGroup", () => {
  it("그룹 role과 자식 버튼을 렌더한다", () => {
    render(
      <ButtonGroup>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("attached 모드 data attribute를 설정한다", () => {
    render(
      <ButtonGroup attached>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole("group")).toHaveAttribute("data-attached", "true");
  });
});
