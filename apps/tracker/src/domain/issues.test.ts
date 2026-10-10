import { describe, expect, it } from "vitest";
import { addLink, appendIssue, bulkUpdateIssues, cloneIssue, deleteComment, filterIssues, issuesByProject, matchesQuickFilter, placeIssue, staleIssueMessage, updateComment, updateIssue } from "./issues";
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

  it("라벨 변경은 활동에 남는다", () => {
    const next = updateIssue(seedTracker(), "WEB-1", { labels: ["pricing", "web"] }, "2026-09-29T09:00:00.000Z", "ada");
    expect(next.issues.find((issue) => issue.id === "WEB-1")?.activity.at(-1)).toMatchObject({
      field: "labels",
      to: "pricing, web"
    });
  });

  it("하위 작업은 부모 이슈에 연결된다", () => {
    const data = seedTracker();
    const result = appendIssue(
      data,
      "WEB",
      { type: "subtask", summary: "Crop hero", description: "", priority: "medium", parentId: "WEB-1", sprintId: "WEB-S1" },
      "2026-09-29T09:00:00.000Z",
      "ada"
    );
    expect(result.issue.parentId).toBe("WEB-1");
    expect(result.issue.key).toBe("WEB-6");
  });

  it("칸반 스페이스는 보드 타입을 갖고 이슈 연결은 양쪽 이력에 남는다", () => {
    const data = seedTracker();
    expect(data.projects.map((project) => project.boardType)).toEqual(["kanban", "kanban"]);
    const linked = addLink(data, "WEB-1", "blocks", "WEB-2", "2026-10-04T09:00:00.000Z", "ada");
    if ("error" in linked) {
      throw new Error(linked.error);
    }
    const source = linked.data.issues.find((issue) => issue.id === "WEB-1");
    const target = linked.data.issues.find((issue) => issue.id === "WEB-2");
    expect(source?.links).toEqual([{ type: "blocks", issueId: "WEB-2" }]);
    expect(target?.links).toEqual([{ type: "blocked_by", issueId: "WEB-1" }]);
    const dated = updateIssue(linked.data, "WEB-1", { dueDate: "2026-10-10" }, "2026-10-04T10:00:00.000Z", "ada");
    expect(dated.issues.find((issue) => issue.id === "WEB-1")?.dueDate).toBe("2026-10-10");
  });

  it("고른 이슈만 허용된 전이와 담당자로 바꾼다", () => {
    const data = seedTracker();
    const moved = bulkUpdateIssues(data, ["WEB-2", "WEB-3"], { status: "in_progress" }, "2026-10-05T09:00:00.000Z", "ada");
    expect(moved.updatedIds).toEqual(["WEB-2"]);
    expect(moved.skippedIds).toEqual(["WEB-3"]);
    expect(moved.data.issues.find((issue) => issue.id === "WEB-2")?.status).toBe("in_progress");
    expect(moved.data.issues.find((issue) => issue.id === "WEB-3")?.status).toBe("done");

    const assigned = bulkUpdateIssues(data, ["WEB-2", "WEB-4"], { assigneeId: "ada" }, "2026-10-05T09:10:00.000Z", "ada");
    expect(assigned.updatedIds).toEqual(["WEB-2", "WEB-4"]);
    expect(assigned.data.issues.find((issue) => issue.id === "WEB-4")?.assigneeId).toBe("ada");
  });

  it("같은 상태 안에서 카드 순서를 앞에 둔다", () => {
    const data = seedTracker();
    const next = placeIssue(data, "WEB-4", "todo", "WEB-2", "2026-10-06T09:00:00.000Z", "ada");
    const todo = next.issues
      .filter((issue) => issue.projectKey === "WEB" && issue.status === "todo")
      .sort((left, right) => left.rank - right.rank);
    expect(todo.map((issue) => issue.id)).toEqual(["WEB-4", "WEB-2"]);

    const moved = placeIssue(data, "WEB-2", "in_progress", null, "2026-10-06T09:10:00.000Z", "ada");
    expect(moved.issues.find((issue) => issue.id === "WEB-2")?.status).toBe("in_progress");
  });

  it("이슈를 복제하면 댓글 없이 같은 상태의 다음 키를 만든다", () => {
    const data = seedTracker();
    const cloned = cloneIssue(data, "WEB-1", "2026-10-07T09:00:00.000Z", "ada");
    if ("error" in cloned) {
      throw new Error(cloned.error);
    }
    expect(cloned.issue.key).toBe("WEB-6");
    expect(cloned.issue.summary).toBe("Publish the pricing page (copy)");
    expect(cloned.issue.status).toBe("in_progress");
    expect(cloned.issue.labels).toEqual(["pricing"]);
    expect(cloned.issue.storyPoints).toBe(5);
    expect(cloned.issue.comments).toEqual([]);
    expect(cloned.issue.links).toEqual([]);
  });

  it("작성자만 댓글을 고치거나 지운다", () => {
    const data = seedTracker();
    const denied = updateComment(data, "WEB-1", "WEB-1-c1", "Shorter", "ada", "2026-10-07T09:10:00.000Z");
    expect(denied).toEqual({ error: "You can only edit your own comments." });
    const edited = updateComment(data, "WEB-1", "WEB-1-c1", "Shorter", "grace", "2026-10-07T09:10:00.000Z");
    if ("error" in edited) {
      throw new Error(edited.error);
    }
    expect(edited.data.issues.find((issue) => issue.id === "WEB-1")?.comments[0]?.body).toBe("Shorter");
    const removed = deleteComment(edited.data, "WEB-1", "WEB-1-c1", "grace", "2026-10-07T09:20:00.000Z");
    if ("error" in removed) {
      throw new Error(removed.error);
    }
    expect(removed.data.issues.find((issue) => issue.id === "WEB-1")?.comments).toEqual([]);
  });

  it("보드 빠른 필터는 담당자와 키를 함께 본다", () => {
    const web = issuesByProject(seedTracker(), "WEB");
    const mine = web.filter((issue) => matchesQuickFilter(issue, "web-2", "min"));
    expect(mine.map((issue) => issue.key)).toEqual(["WEB-2"]);
  });

  it("다른 탭이 먼저 저장하면 그 시각과 어긋난다", () => {
    const issue = seedTracker().issues.find((item) => item.id === "WEB-1");
    if (!issue) {
      throw new Error("missing issue");
    }
    expect(staleIssueMessage(issue.updatedAt, issue.updatedAt)).toBeNull();
    expect(staleIssueMessage(issue.updatedAt, "2026-10-01T00:00:00.000Z")).toBe("This issue changed in another tab.");
  });
});
