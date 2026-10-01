import { describe, expect, it } from "vitest";
import { evaluateJql } from "./jql";
import { seedTracker } from "./seed";

function keys(source: string, actorId = "ada") {
  const result = evaluateJql(seedTracker(), source, actorId);
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

  it("잘못된 문법은 이유로 돌려준다", () => {
    expect(evaluateJql(seedTracker(), "status == done", "ada")).toEqual({ error: "Expected a value." });
    expect(evaluateJql(seedTracker(), "", "ada")).toEqual({ error: "JQL is empty." });
    expect(evaluateJql(seedTracker(), "owner = ada", "ada")).toEqual({ error: "Unknown field owner." });
  });
});
