import { describe, expect, it } from "vitest";
import { can, setMembership } from "./permissions";
import { seedTracker } from "./seed";
import { parseTracker, serializeTracker } from "./storage";
import { actorMayTransition, addWorkflowStatus, addWorkflowTransition, canTransition, removeWorkflowTransition, workflowFor } from "./workflow";

describe("permissions and workflow", () => {
  it("viewer는 읽고 member는 수정만, admin만 삭제한다", () => {
    const data = seedTracker();
    expect(can(data, "min", "WEB", "edit")).toBe(false);
    expect(can(data, "min", "WEB", "view")).toBe(true);
    expect(can(data, "grace", "WEB", "edit")).toBe(true);
    expect(can(data, "grace", "WEB", "delete")).toBe(false);
    expect(can(data, "ada", "WEB", "manage")).toBe(true);
  });

  it("마지막 관리자는 내릴 수 없다", () => {
    expect(setMembership(seedTracker(), "WEB", "ada", "member")).toEqual({ error: "A project needs an admin." });
  });

  it("없는 전이로는 상태를 못 바꾸고 상태를 추가할 수 있다", () => {
    const data = seedTracker();
    const workflow = workflowFor(data, "WEB");
    expect(canTransition(workflow, "todo", "done")).toBe(false);
    expect(canTransition(workflow, "todo", "in_progress")).toBe(true);
    const added = addWorkflowStatus(data, "WEB", { id: "blocked", name: "Blocked", category: "in_progress" });
    if ("error" in added) {
      throw new Error(added.error);
    }
    expect(workflowFor(added.data, "WEB").statuses.map((status) => status.id)).toContain("blocked");
    const closed = removeWorkflowTransition(added.data, "WEB", "WEB-t-start");
    expect(canTransition(workflowFor(closed, "WEB"), "todo", "in_progress")).toBe(false);
  });

  it("담당자 전이는 담당자만, 관리자 전이는 관리자만 지난다", () => {
    const data = seedTracker();
    const assigneeOnly = addWorkflowTransition(data, "WEB", { from: "todo", to: "done", name: "Close", guard: "assignee" });
    if ("error" in assigneeOnly) {
      throw new Error(assigneeOnly.error);
    }
    const todo = assigneeOnly.data.issues.find((issue) => issue.id === "WEB-2");
    if (!todo) {
      throw new Error("missing issue");
    }
    expect(actorMayTransition(assigneeOnly.data, todo, "done", "min")).toBe(true);
    expect(actorMayTransition(assigneeOnly.data, todo, "done", "grace")).toBe(false);
    const adminOnly = addWorkflowTransition(assigneeOnly.data, "WEB", {
      from: "in_progress",
      to: "done",
      name: "Ship",
      guard: "admin"
    });
    if ("error" in adminOnly) {
      throw new Error(adminOnly.error);
    }
    const started = adminOnly.data.issues.find((issue) => issue.id === "WEB-1");
    if (!started) {
      throw new Error("missing issue");
    }
    expect(actorMayTransition(adminOnly.data, started, "done", "ada")).toBe(true);
    expect(actorMayTransition(adminOnly.data, started, "done", "grace")).toBe(false);
    const raw = JSON.parse(serializeTracker(adminOnly.data)) as {
      data: { workflows: Array<{ transitions: Array<{ guard?: string }> }> };
    };
    const first = raw.data.workflows[0]?.transitions[0];
    if (!first) {
      throw new Error("missing transition");
    }
    delete first.guard;
    expect(parseTracker(JSON.stringify(raw))?.workflows[0]?.transitions[0]?.guard).toBe("any");
  });

  it("역할과 워크플로가 없는 저장본은 기본값을 채운다", () => {
    const raw = JSON.parse(serializeTracker(seedTracker())) as { data: { memberships?: unknown; workflows?: unknown } };
    delete raw.data.memberships;
    delete raw.data.workflows;
    const restored = parseTracker(JSON.stringify(raw));
    expect(restored?.memberships.find((item) => item.personId === "min" && item.projectKey === "WEB")?.role).toBe("viewer");
    expect(restored?.workflows.find((item) => item.projectKey === "API")?.statuses).toHaveLength(4);
  });
});