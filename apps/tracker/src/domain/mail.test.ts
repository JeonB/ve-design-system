import { describe, expect, it } from "vitest";
import { issueById, updateIssue } from "./issues";
import { freshPresence, isMailMuted, markNoticeRead, noticesForComment, noticesForUpdate, setMailMute } from "./mail";
import { seedTracker } from "./seed";
import { parseTracker, serializeTracker } from "./storage";

describe("mail", () => {
  it("담당이 바뀌면 새 담당자에게만 알린다", () => {
    const data = seedTracker();
    const before = issueById(data, "WEB-1");
    if (!before) {
      throw new Error("missing issue");
    }
    const next = updateIssue(data, "WEB-1", { assigneeId: "grace" }, "2026-10-04T09:00:00.000Z", "ada");
    const after = issueById(next, "WEB-1");
    if (!after) {
      throw new Error("missing issue");
    }
    expect(noticesForUpdate(data, before, after, "ada", "2026-10-04T09:00:00.000Z").map((item) => item.recipientId)).toEqual(["grace"]);
    expect(noticesForUpdate(data, before, after, "grace", "2026-10-04T09:00:00.000Z")).toEqual([]);
  });

  it("댓글은 담당과 보고자에게, 멘션은 그 사람에게 간다", () => {
    const data = seedTracker();
    const issue = issueById(data, "WEB-1");
    if (!issue) {
      throw new Error("missing issue");
    }
    const notices = noticesForComment(data, issue, "Please check @min", "ada", "2026-10-04T09:00:00.000Z");
    expect(notices.map((item) => [item.recipientId, item.kind])).toEqual([
      ["grace", "comment"],
      ["min", "mention"]
    ]);
  });

  it("읽음 처리와 오래된 프레즌스는 걸러진다", () => {
    const data = seedTracker();
    const issue = issueById(data, "WEB-2");
    if (!issue) {
      throw new Error("missing issue");
    }
    const [first] = noticesForComment(data, issue, "look", "grace", "2026-10-04T09:00:00.000Z");
    if (!first) {
      throw new Error("missing notice");
    }
    const withNotice = { ...data, notices: [first] };
    expect(markNoticeRead(withNotice, first.id, first.recipientId).notices[0]?.read).toBe(true);
    expect(markNoticeRead(withNotice, first.id, "grace").notices[0]?.read).toBe(false);
    expect(freshPresence([{ actorId: "ada", issueId: "WEB-1", at: 1_000 }], 12_000)).toEqual([]);
  });

  it("알림 필드가 없는 저장본은 빈 수신함으로 읽는다", () => {
    const raw = JSON.parse(serializeTracker(seedTracker())) as { data: { notices?: unknown } };
    delete raw.data.notices;
    expect(parseTracker(JSON.stringify(raw))?.notices).toEqual([]);
  });

  it("관찰자에게도 댓글을 알리고, 끈 종류는 보내지 않는다", () => {
    const data = seedTracker();
    const issue = issueById(data, "WEB-5");
    if (!issue) {
      throw new Error("missing issue");
    }
    const watching = { ...issue, watchers: ["ada", "grace"] };
    const sent = noticesForComment(data, watching, "shipped", "ada", "2026-10-11T02:00:00.000Z");
    expect(sent.map((item) => [item.recipientId, item.kind]).sort()).toEqual([
      ["grace", "comment"],
      ["min", "comment"]
    ]);
    const muted = setMailMute(data, "grace", "comment", true);
    expect(isMailMuted(muted, "grace", "comment")).toBe(true);
    expect(noticesForComment(muted, watching, "shipped", "ada", "2026-10-11T02:00:00.000Z").map((item) => item.recipientId)).toEqual(["min"]);
    const raw = JSON.parse(serializeTracker(muted)) as { data: { mailMutes?: unknown } };
    delete raw.data.mailMutes;
    expect(parseTracker(JSON.stringify(raw))?.mailMutes).toEqual([]);
  });
});