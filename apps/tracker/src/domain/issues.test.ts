import { describe, expect, it } from "vitest";
import { appendIssue, filterIssues, issuesByProject, updateIssue } from "./issues";
import { seedTracker } from "./seed";

describe("issues", () => {
  it("시드는 프로젝트 키와 이슈 키가 겹치지 않는다", () => {
    const data = seedTracker();
    const keys = data.issues.map((issue) => issue.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(issuesByProject(data, "WEB")).toHaveLength(5);
  });

  it("이슈를 만들면 다음 번호와 todo 상태를 부여한다", () => {
    const data = seedTracker();
    const result = appendIssue(
      data,
      "WEB",
      { type: "task", summary: "  Write release notes  ", description: "", priority: "low" },
      "2026-09-25T10:00:00.000Z",
      "ada"
    );

    expect(result.issue.key).toBe("WEB-6");
    expect(result.issue.status).toBe("todo");
    expect(result.issue.summary).toBe("Write release notes");
    expect(result.data.issues).toHaveLength(data.issues.length + 1);
  });

  it("상태 변경은 updatedAt을 갱신한다", () => {
    const data = seedTracker();
    const next = updateIssue(data, "WEB-2", { status: "in_progress" }, "2026-09-25T11:00:00.000Z", "ada");
    expect(next.issues.find((issue) => issue.id === "WEB-2")).toMatchObject({
      status: "in_progress",
      updatedAt: "2026-09-25T11:00:00.000Z"
    });
  });

  it("요약·유형·상태·담당으로 거르고 최신순으로 정렬한다", () => {
    const web = issuesByProject(seedTracker(), "WEB");
    const filtered = filterIssues(web, {
      query: "page",
      type: "story",
      status: "all",
      assigneeId: "ada"
    });

    expect(filtered.map((issue) => issue.key)).toEqual(["WEB-1"]);
  });
});
