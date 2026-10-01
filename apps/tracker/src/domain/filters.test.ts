import { describe, expect, it } from "vitest";
import { deleteFilter, saveFilter } from "./filters";
import { filterIssues, issuesByProject } from "./issues";
import { seedTracker } from "./seed";
import { parseTracker, serializeTracker } from "./storage";

describe("saved filters", () => {
  it("키와 라벨로 이슈를 찾는다", () => {
    const web = issuesByProject(seedTracker(), "WEB");
    expect(filterIssues(web, { query: "web-2", type: "all", status: "all", assigneeId: "all" }).map((issue) => issue.key)).toEqual([
      "WEB-2"
    ]);
    expect(filterIssues(web, { query: "pricing", type: "all", status: "all", assigneeId: "all" }).map((issue) => issue.key)).toEqual([
      "WEB-1"
    ]);
  });

  it("이름을 비우면 필터를 저장하지 않는다", () => {
    const result = saveFilter(seedTracker(), {
      projectKey: "WEB",
      name: "   ",
      query: "pricing",
      type: "all",
      status: "all",
      assigneeId: "all",
      jql: ""
    });
    expect(result).toEqual({ error: "Filter name is required." });
  });

  it("저장한 필터는 직렬화 후에도 남고 지울 수 있다", () => {
    const saved = saveFilter(seedTracker(), {
      projectKey: "WEB",
      name: "Pricing",
      query: "pricing",
      type: "story",
      status: "all",
      assigneeId: "ada",
      jql: "labels = pricing"
    });
    if ("error" in saved) {
      throw new Error(saved.error);
    }
    const restored = parseTracker(serializeTracker(saved.data));
    expect(restored?.savedFilters).toEqual([saved.filter]);
    expect(deleteFilter(saved.data, saved.filter.id).savedFilters).toEqual([]);
  });

  it("필터 필드가 없는 저장본은 빈 목록으로 읽는다", () => {
    const raw = JSON.parse(serializeTracker(seedTracker())) as { data: { savedFilters?: unknown } };
    delete raw.data.savedFilters;
    expect(parseTracker(JSON.stringify(raw))?.savedFilters).toEqual([]);
  });
});
