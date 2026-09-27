import { describe, expect, it } from "vitest";
import { seedTracker } from "./seed";
import { activeSprint, assignSprint, backlogIssues, completeSprint, createSprint, issuesInSprint, startSprint } from "./sprints";

describe("sprints", () => {
  it("백로그는 스프린트에 없는 이슈만 담는다", () => {
    const data = seedTracker();
    expect(backlogIssues(data, "WEB").map((issue) => issue.key)).toEqual(["WEB-4"]);
    expect(issuesInSprint(data, "WEB-S1").map((issue) => issue.key)).toEqual(["WEB-1", "WEB-2", "WEB-3", "WEB-5"]);
  });

  it("활성 스프린트가 있으면 다음 스프린트를 시작하지 못한다", () => {
    const data = seedTracker();
    const created = createSprint(data, "WEB", "Sprint 2");
    if ("error" in created) {
      throw new Error(created.error);
    }
    const started = startSprint(created.data, created.sprint.id, "2026-09-27T09:00:00.000Z");
    expect("error" in started ? started.error : "").toMatch(/active sprint/);
  });

  it("스프린트를 완료하면 끝나지 않은 이슈는 백로그로 돌아간다", () => {
    const data = seedTracker();
    const next = completeSprint(data, "WEB-S1", "2026-09-27T09:00:00.000Z", "ada");
    expect(activeSprint(next, "WEB")).toBeUndefined();
    expect(backlogIssues(next, "WEB").map((issue) => issue.key).sort()).toEqual(["WEB-1", "WEB-2", "WEB-4", "WEB-5"]);
    expect(issuesInSprint(next, "WEB-S1").map((issue) => issue.key)).toEqual(["WEB-3"]);
    const moved = next.issues.find((issue) => issue.id === "WEB-1");
    expect(moved?.activity.at(-1)?.field).toBe("sprint");
  });

  it("이슈를 스프린트에 넣는다", () => {
    const data = seedTracker();
    const next = assignSprint(data, "WEB-4", "WEB-S1", "2026-09-27T09:00:00.000Z", "ada");
    expect(next.issues.find((issue) => issue.id === "WEB-4")?.sprintId).toBe("WEB-S1");
  });
});