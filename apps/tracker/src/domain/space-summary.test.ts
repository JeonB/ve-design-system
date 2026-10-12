import { describe, expect, it } from "vitest";
import { ISSUE_TYPES, type Issue, type Workflow } from "./issue.types";
import { SUMMARY_TYPE_ORDER, buildSpaceSummary } from "./space-summary";

const workflow: Workflow = {
  projectKey: "KAN",
  statuses: [
    { id: "todo", name: "To Do", category: "todo" },
    { id: "in_progress", name: "In Progress", category: "in_progress" },
    { id: "done", name: "Done", category: "done" }
  ],
  transitions: []
};

function issue(patch: Pick<Issue, "id" | "key" | "type" | "status" | "priority"> & Partial<Issue>): Issue {
  return {
    number: 1,
    projectKey: "KAN",
    summary: patch.key,
    description: "",
    assigneeId: "",
    reporterId: "ada",
    sprintId: null,
    rank: 1,
    labels: [],
    storyPoints: null,
    parentId: null,
    dueDate: null,
    startDate: null,
    watchers: [],
    links: [],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    comments: [],
    attachments: [],
    activity: [],
    ...patch
  };
}

describe("space summary", () => {
  const now = "2026-10-15T12:00:00.000Z";

  it("여섯 작업 유형을 모두 보여 준다", () => {
    expect([...SUMMARY_TYPE_ORDER].sort()).toEqual([...ISSUE_TYPES].sort());
  });

  it("최근 7일과 빈 칸을 함께 센다", () => {
    const summary = buildSpaceSummary(
      [
        issue({
          id: "KAN-1",
          key: "KAN-1",
          type: "task",
          status: "todo",
          priority: "highest",
          createdAt: "2026-10-14T00:00:00.000Z",
          updatedAt: "2026-10-14T00:00:00.000Z",
          dueDate: "2026-10-16",
          assigneeId: "ada"
        }),
        issue({
          id: "KAN-2",
          key: "KAN-2",
          type: "feature",
          status: "done",
          priority: "low",
          createdAt: "2026-10-01T00:00:00.000Z",
          updatedAt: "2026-10-10T00:00:00.000Z"
        }),
        issue({
          id: "KAN-3",
          key: "KAN-3",
          type: "epic",
          status: "in_progress",
          priority: "medium",
          assigneeId: "ada"
        })
      ],
      workflow,
      now
    );

    expect(summary.total).toBe(3);
    expect(summary.statuses.map((status) => status.count)).toEqual([1, 1, 1]);
    expect(summary.activity).toEqual({ completed: 1, updated: 2, created: 1, dueSoon: 1 });
    expect(summary.priorities.map((item) => item.count)).toEqual([1, 0, 1, 1, 0]);
    expect(summary.types.find((item) => item.id === "feature")?.count).toBe(1);
    expect(summary.types.find((item) => item.id === "story")?.count).toBe(0);
    expect(summary.workload).toEqual([
      { assigneeId: "", count: 1 },
      { assigneeId: "ada", count: 2 }
    ]);
    expect(summary.epics).toEqual([{ id: "KAN-3", key: "KAN-3", summary: "KAN-3", done: 0, total: 0 }]);
  });

  it("에픽 자식의 완료 비율을 계산한다", () => {
    const summary = buildSpaceSummary(
      [
        issue({ id: "KAN-9", key: "KAN-9", type: "epic", status: "todo", priority: "low" }),
        issue({ id: "KAN-4", key: "KAN-4", type: "story", status: "done", priority: "low", parentId: "KAN-9" }),
        issue({ id: "KAN-5", key: "KAN-5", type: "task", status: "todo", priority: "low", parentId: "KAN-9" })
      ],
      workflow,
      now
    );
    expect(summary.epics[0]).toMatchObject({ done: 1, total: 2 });
  });
});
