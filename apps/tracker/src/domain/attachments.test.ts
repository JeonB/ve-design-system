import { describe, expect, it } from "vitest";
import { addAttachment, canRemoveAttachment, formatAttachmentSize, MAX_ATTACHMENT_BYTES, removeAttachment } from "./attachments";
import { seedTracker } from "./seed";
import { parseTracker, serializeTracker } from "./storage";

const file = {
  name: "notes.txt",
  mediaType: "text/plain",
  size: 12,
  dataUrl: "data:text/plain;base64,aGVsbG8="
};

describe("attachments", () => {
  it("256KB를 넘는 파일은 거절한다", () => {
    const result = addAttachment(
      seedTracker(),
      "WEB-1",
      { ...file, size: MAX_ATTACHMENT_BYTES + 1 },
      "2026-10-02T09:00:00.000Z",
      "ada"
    );
    expect(result).toEqual({ error: "File is larger than 256KB." });
  });

  it("첨부는 활동에 남고 지우면 목록에서 빠진다", () => {
    const added = addAttachment(seedTracker(), "WEB-1", file, "2026-10-02T09:00:00.000Z", "ada");
    if ("error" in added) {
      throw new Error(added.error);
    }
    expect(added.attachment.id).toBe("WEB-1-f1");
    expect(added.data.issues.find((issue) => issue.id === "WEB-1")?.activity.at(-1)).toMatchObject({
      field: "attachment",
      to: "notes.txt"
    });
    const restored = parseTracker(serializeTracker(added.data));
    expect(restored?.issues.find((issue) => issue.id === "WEB-1")?.attachments).toEqual([added.attachment]);
    const removed = removeAttachment(added.data, "WEB-1", added.attachment.id, "2026-10-02T10:00:00.000Z", "ada");
    if ("error" in removed) {
      throw new Error(removed.error);
    }
    expect(removed.data.issues.find((issue) => issue.id === "WEB-1")?.attachments).toEqual([]);
  });

  it("올린 사람과 관리자만 첨부를 지운다", () => {
    const added = addAttachment(seedTracker(), "WEB-1", file, "2026-10-09T09:00:00.000Z", "grace");
    if ("error" in added) {
      throw new Error(added.error);
    }
    expect(formatAttachmentSize(12)).toBe("12 B");
    expect(formatAttachmentSize(1536)).toBe("1.5 KB");
    expect(canRemoveAttachment(added.data, "WEB-1", added.attachment.id, "min")).toBe(false);
    expect(canRemoveAttachment(added.data, "WEB-1", added.attachment.id, "grace")).toBe(true);
    expect(canRemoveAttachment(added.data, "WEB-1", added.attachment.id, "ada")).toBe(true);
    expect(removeAttachment(added.data, "WEB-1", added.attachment.id, "2026-10-09T10:00:00.000Z", "min")).toEqual({
      error: "Only the author or an admin can remove this file."
    });
    const removed = removeAttachment(added.data, "WEB-1", added.attachment.id, "2026-10-09T10:00:00.000Z", "ada");
    if ("error" in removed) {
      throw new Error(removed.error);
    }
    expect(removed.data.issues.find((issue) => issue.id === "WEB-1")?.attachments).toEqual([]);
  });

  it("첨부 필드가 없는 이슈는 빈 목록으로 읽는다", () => {
    const raw = JSON.parse(serializeTracker(seedTracker())) as { data: { issues: Array<{ attachments?: unknown }> } };
    const issue = raw.data.issues[0];
    if (!issue) {
      throw new Error("missing issue");
    }
    delete issue.attachments;
    expect(parseTracker(JSON.stringify(raw))?.issues[0]?.attachments).toEqual([]);
  });
});