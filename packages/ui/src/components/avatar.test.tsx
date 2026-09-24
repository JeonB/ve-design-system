import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

afterEach(() => {
  cleanup();
});

describe("Avatar", () => {
  it("이미지가 있으면 img를 렌더한다", () => {
    render(<Avatar alt="Ada Lovelace" src="/ada.png" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toHaveAttribute("src", "/ada.png");
  });

  it("src가 없으면 alt 기반 이니셜 fallback을 쓴다", () => {
    render(<Avatar alt="Grace Hopper" />);
    const avatar = screen.getByRole("img", { name: "Grace Hopper" });
    expect(avatar).toHaveAttribute("data-slot", "avatar");
    expect(avatar).toHaveTextContent("GH");
  });

  it("이미지 오류 시 fallback으로 전환한다", () => {
    render(<Avatar alt="Ada" fallback="AD" src="/broken.png" />);
    fireEvent.error(screen.getByRole("img", { name: "Ada" }));
    expect(screen.getByRole("img", { name: "Ada" })).toHaveTextContent("AD");
  });
});
