import type { ActivityEntry, Attachment, Issue, TrackerData } from "./issue.types";

export const MAX_ATTACHMENT_BYTES = 256 * 1024;

export type AttachmentInput = {
  name: string;
  mediaType: string;
  size: number;
  dataUrl: string;
};

function nextAttachmentId(issue: Issue): string {
  const numbers = issue.attachments.map((file) => {
    const match = /-f(\d+)$/.exec(file.id);
    return match ? Number(match[1]) : 0;
  });
  return `${issue.id}-f${Math.max(0, ...numbers) + 1}`;
}

function activity(issue: Issue, entry: Omit<ActivityEntry, "id">): ActivityEntry {
  return { ...entry, id: `${issue.id}-a${issue.activity.length + 1}` };
}

export function addAttachment(
  data: TrackerData,
  issueId: string,
  input: AttachmentInput,
  now: string,
  actorId: string
): { data: TrackerData; attachment: Attachment } | { error: string } {
  const name = input.name.trim();
  if (name.length === 0) {
    return { error: "File name is required." };
  }
  if (!Number.isFinite(input.size) || input.size < 0) {
    return { error: "File size is invalid." };
  }
  if (input.size > MAX_ATTACHMENT_BYTES) {
    return { error: "File is larger than 256KB." };
  }
  if (!input.dataUrl.startsWith("data:")) {
    return { error: "File data is invalid." };
  }
  const issue = data.issues.find((item) => item.id === issueId);
  if (!issue) {
    return { error: "Issue not found." };
  }
  const attachment: Attachment = {
    id: nextAttachmentId(issue),
    name,
    mediaType: input.mediaType.trim() || "application/octet-stream",
    size: input.size,
    dataUrl: input.dataUrl,
    authorId: actorId,
    createdAt: now
  };
  return {
    attachment,
    data: {
      ...data,
      issues: data.issues.map((item) =>
        item.id === issueId
          ? {
              ...item,
              updatedAt: now,
              attachments: [...item.attachments, attachment],
              activity: [
                ...item.activity,
                activity(item, { actorId, at: now, field: "attachment", from: "", to: name })
              ]
            }
          : item
      )
    }
  };
}

export function removeAttachment(data: TrackerData, issueId: string, attachmentId: string, now: string, actorId: string): TrackerData {
  return {
    ...data,
    issues: data.issues.map((issue) => {
      if (issue.id !== issueId) {
        return issue;
      }
      const file = issue.attachments.find((item) => item.id === attachmentId);
      if (!file) {
        return issue;
      }
      return {
        ...issue,
        updatedAt: now,
        attachments: issue.attachments.filter((item) => item.id !== attachmentId),
        activity: [
          ...issue.activity,
          activity(issue, { actorId, at: now, field: "attachment", from: file.name, to: "" })
        ]
      };
    })
  };
}
