import { describe, expect, it } from "vitest";
import { appendIssue, updateIssue } from "./issues";
import { seedTracker } from "./seed";
import { loadTracker, parseTracker, saveTracker, serializeTracker } from "./storage";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
}

describe("tracker storage", () => {
  it("저장한 워크스페이스를 다시 읽는다", () => {
    const storage = memoryStorage();
    const data = seedTracker();
    saveTracker(storage, data);
    expect(loadTracker(storage).issues.map((issue) => issue.key)).toEqual(data.issues.map((issue) => issue.key));
  });

  it("깨진 JSON은 시드로 되돌린다", () => {
    const storage = memoryStorage();
    storage.setItem("ve-tracker-data", "{");
    expect(loadTracker(storage).projects.map((project) => project.key)).toEqual(["WEB", "API"]);
    expect(parseTracker("{")).toBeNull();
  });

  it("상태 변경은 활동으로 남고 직렬화 후에도 유지된다", () => {
    const updated = updateIssue(seedTracker(), "WEB-2", { status: "in_progress" }, "2026-09-26T09:00:00.000Z", "ada");
    const restored = parseTracker(serializeTracker(updated));
    const issue = restored?.issues.find((item) => item.id === "WEB-2");
    expect(issue?.activity.at(-1)).toMatchObject({
      field: "status",
      from: "todo",
      to: "in_progress",
      actorId: "ada"
    });
  });

  it("새 이슈는 created 활동을 가진다", () => {
    const result = appendIssue(
      seedTracker(),
      "WEB",
      { type: "task", summary: "Notes", description: "", priority: "low" },
      "2026-09-26T09:00:00.000Z",
      "ada"
    );
    expect(result.issue.activity[0]?.field).toBe("created");
  });

  it("스키마 2의 urgent는 highest로 읽는다", () => {
    const saved = serializeTracker(seedTracker());
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null || !("data" in parsed)) {
      throw new Error("seed payload");
    }
    const payload = parsed as { version: number; data: { issues: { key: string; priority: string }[] } };
    payload.version = 2;
    const issue = payload.data.issues.find((item) => item.key === "WEB-2");
    if (!issue) {
      throw new Error("WEB-2");
    }
    issue.priority = "urgent";
    const restored = parseTracker(JSON.stringify(payload));
    expect(restored?.issues.find((item) => item.key === "WEB-2")?.priority).toBe("highest");
  });

  it("기본 상태 이름을 보드 표기와 맞춘다", () => {
    const saved = serializeTracker(seedTracker());
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null || !("data" in parsed)) {
      throw new Error("seed payload");
    }
    const payload = parsed as {
      data: { workflows: { statuses: { id: string; name: string }[] }[] };
    };
    const statuses = payload.data.workflows[0]?.statuses;
    const todo = statuses?.find((status) => status.id === "todo");
    const progress = statuses?.find((status) => status.id === "in_progress");
    const review = statuses?.find((status) => status.id === "in_review");
    if (!todo || !progress || !review) {
      throw new Error("statuses");
    }
    todo.name = "To do";
    progress.name = "In progress";
    review.name = "In review";
    const restored = parseTracker(JSON.stringify(payload));
    expect(restored?.workflows[0]?.statuses.map((status) => status.name)).toEqual([
      "To Do",
      "In Progress",
      "In Review",
      "Done"
    ]);
  });
});
