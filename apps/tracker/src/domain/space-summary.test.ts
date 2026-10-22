import { describe, expect, it } from "vitest";
import { ISSUE_TYPES, type Issue, type TrackerData, type Workflow } from "./issue.types";
import { evaluateJql } from "./jql";
import { seedTracker } from "./seed";
import { SUMMARY_TYPE_ORDER, buildSpaceSummary, filterByAssignees } from "./space-summary";

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

const now = "2026-10-15T12:00:00.000Z";

const sample = [
  issue({
    id: "KAN-1",
    key: "KAN-1",
    type: "task",
    status: "todo",
    priority: "highest",
    createdAt: "2026-10-14T00:00:00.000Z",
    updatedAt: "2026-10-14T00:00:00.000Z",
    dueDate: "2026-10-16",
    assigneeId: "ada",
    activity: [{ id: "a1", actorId: "ada", at: "2026-10-14T00:00:00.000Z", field: "created", from: "", to: "" }]
  }),
  issue({
    id: "KAN-2",
    key: "KAN-2",
    type: "feature",
    status: "done",
    priority: "low",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-10T00:00:00.000Z",
    activity: [{ id: "a2", actorId: "grace", at: "2026-10-10T00:00:00.000Z", field: "status", from: "todo", to: "done" }]
  }),
  issue({ id: "KAN-3", key: "KAN-3", type: "epic", status: "in_progress", priority: "medium", assigneeId: "ada" })
];

describe("space summary", () => {
  it("여섯 작업 유형을 모두 보여 준다", () => {
    expect([...SUMMARY_TYPE_ORDER].sort()).toEqual([...ISSUE_TYPES].sort());
  });

  it("최근 7일과 빈 칸을 함께 센다", () => {
    const summary = buildSpaceSummary("KAN", sample, workflow, now);
    expect(summary.total).toBe(3);
    expect(summary.statuses.map((status) => status.count)).toEqual([1, 1, 1]);
    expect(summary.statuses.map((status) => status.percent)).toEqual([33, 33, 33]);
    expect(summary.activity.completed.count).toBe(1);
    expect(summary.activity.updated.count).toBe(2);
    expect(summary.activity.created.count).toBe(1);
    expect(summary.activity.dueSoon.count).toBe(1);
    expect(summary.priorities.map((item) => item.count)).toEqual([1, 0, 1, 1, 0]);
    expect(summary.priorityAxis).toEqual([0, 0.5, 1]);
    expect(summary.types.find((item) => item.id === "feature")).toMatchObject({ count: 1, percent: 33 });
    expect(summary.workload.map((item) => [item.id, item.count])).toEqual([
      ["", 1],
      ["ada", 2]
    ]);
  });

  it("최근 활동을 새것부터 돌려준다", () => {
    const summary = buildSpaceSummary("KAN", sample, workflow, now);
    expect(summary.recent.map((item) => item.entry.id)).toEqual(["a1", "a2"]);
    expect(summary.recent[0]).toMatchObject({ issueKey: "KAN-1", summary: "KAN-1" });
  });

  it("에픽 자식을 완료, 진행, 할 일로 나눈다", () => {
    const summary = buildSpaceSummary(
      "KAN",
      [
        issue({ id: "KAN-9", key: "KAN-9", type: "epic", status: "todo", priority: "low" }),
        issue({ id: "KAN-4", key: "KAN-4", type: "story", status: "done", priority: "low", parentId: "KAN-9" }),
        issue({ id: "KAN-5", key: "KAN-5", type: "task", status: "in_progress", priority: "low", parentId: "KAN-9" }),
        issue({ id: "KAN-6", key: "KAN-6", type: "task", status: "todo", priority: "low", parentId: "KAN-9" })
      ],
      workflow,
      now
    );
    expect(summary.epics[0]).toMatchObject({ done: 1, inProgress: 1, todo: 1, total: 3, percentDone: 33 });
  });

  it("담당자 필터는 고른 사람만 남기고, 고르지 않으면 모두 둔다", () => {
    expect(filterByAssignees(sample, []).length).toBe(3);
    expect(filterByAssignees(sample, ["ada"]).map((item) => item.key)).toEqual(["KAN-1", "KAN-3"]);
    expect(filterByAssignees(sample, [""]).map((item) => item.key)).toEqual(["KAN-2"]);
  });

  it("링크 JQL은 타일이 센 이슈를 그대로 돌려준다", () => {
    const seed = seedTracker();
    const data: TrackerData = { ...seed, issues: [...seed.issues, ...sample], workflows: [...seed.workflows, workflow] };
    const kan = data.issues.filter((item) => item.projectKey === "KAN");
    const summary = buildSpaceSummary("KAN", kan, workflow, now);
    const tiles = [summary.activity.completed, summary.activity.updated, summary.activity.created, summary.activity.dueSoon];
    for (const share of [...tiles, ...summary.statuses, ...summary.priorities, ...summary.types, ...summary.workload]) {
      const result = evaluateJql(data, share.jql, "ada", now);
      if ("error" in result) {
        throw new Error(`${share.jql}: ${result.error}`);
      }
      expect(result.issues.length, share.jql).toBe(share.count);
    }
  });
});
