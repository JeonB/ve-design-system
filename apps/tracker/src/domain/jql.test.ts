import { describe, expect, it } from "vitest";
import { evaluateJql } from "./jql";
import { seedTracker } from "./seed";

function keys(source: string, actorId = "ada", now = "2026-10-11T03:00:00.000Z") {
  const result = evaluateJql(seedTracker(), source, actorId, now);
  if ("error" in result) {
    throw new Error(result.error);
  }
  return result.issues.map((issue) => issue.key);
}

describe("jql", () => {
  it("상태와 currentUser로 내 진행 중 이슈를 찾는다", () => {
    expect(keys('status = "In progress" AND assignee = currentUser()')).toEqual(["WEB-1"]);
  });

  it("라벨, 댓글 본문, 포인트, 빈 스프린트를 구분한다", () => {
    expect(keys("labels = pricing")).toEqual(["WEB-1"]);
    expect(keys('text ~ "free tier"')).toEqual(["WEB-1"]);
    expect(keys("storyPoints >= 5")).toEqual(["WEB-1"]);
    expect(keys("sprint IS EMPTY AND project = WEB")).toEqual(["WEB-4"]);
  });

  it("OR, NOT, IN과 정렬을 적용한다", () => {
    expect(keys("key = WEB-2 OR key = WEB-5 ORDER BY key ASC")).toEqual(["WEB-2", "WEB-5"]);
    expect(keys("project = WEB AND NOT status = done").sort()).toEqual(["WEB-1", "WEB-2", "WEB-4", "WEB-5"]);
    expect(keys("status IN (done, todo) AND project = API ORDER BY key DESC")).toEqual(["API-2"]);
  });

  it("기한, 관찰자, 해결 상태와 오늘 기준으로 거른다", () => {
    expect(keys('due <= "2026-10-10" AND project = WEB')).toEqual(["WEB-1"]);
    expect(keys("due < startOfDay() AND project = WEB")).toEqual(["WEB-1"]);
    expect(keys("due IS EMPTY AND project = WEB").sort()).toEqual(["WEB-2", "WEB-3", "WEB-4", "WEB-5"]);
    expect(keys("watcher = currentUser() AND project = WEB").sort()).toEqual(["WEB-1", "WEB-5"]);
    expect(keys("resolution = Unresolved AND project = WEB").sort()).toEqual(["WEB-1", "WEB-2", "WEB-4", "WEB-5"]);
    expect(keys("resolution = Done AND project = WEB")).toEqual(["WEB-3"]);
    expect(keys("project = WEB ORDER BY due ASC")[0]).toBe("WEB-1");
  });

  it("잘못된 문법은 이유로 돌려준다", () => {
    expect(evaluateJql(seedTracker(), "status == done", "ada")).toEqual({ error: "Expected a value." });
    expect(evaluateJql(seedTracker(), "", "ada")).toEqual({ error: "JQL is empty." });
    expect(evaluateJql(seedTracker(), "owner = ada", "ada")).toEqual({ error: "Unknown field owner." });
  });
});
