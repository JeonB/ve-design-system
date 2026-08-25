import { describe, expect, it } from "vitest";
import { joinIds } from "./join-ids";

describe("joinIds", () => {
  it("공백으로 구분된 id를 중복 없이 합친다", () => {
    expect(joinIds("a b", "b", "c")).toBe("a b c");
  });

  it("값이 없으면 undefined를 반환한다", () => {
    expect(joinIds(undefined, "  ")).toBeUndefined();
  });
});
