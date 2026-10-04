import {
  NOTIFICATION_KINDS,
  type Issue,
  type MailNotice,
  type NotificationKind,
  type Person,
  type TrackerData
} from "./issue.types";

export type { MailNotice, NotificationKind };

export type Presence = {
  actorId: string;
  issueId: string;
  at: number;
};

const PRESENCE_TTL_MS = 10_000;

export function isNotificationKind(value: string): value is NotificationKind {
  return (NOTIFICATION_KINDS as readonly string[]).includes(value);
}

function personName(people: Person[], personId: string): string {
  return people.find((person) => person.id === personId)?.name ?? personId;
}

function mentionedIds(body: string, people: Person[]): string[] {
  const text = body.toLowerCase();
  return people.filter((person) => text.includes(`@${person.id.toLowerCase()}`) || text.includes(`@${person.name.toLowerCase()}`)).map((person) => person.id);
}

function notice(
  data: TrackerData,
  offset: number,
  input: Omit<MailNotice, "id" | "read">
): MailNotice {
  return { ...input, id: `mail-${data.notices.length + offset}`, read: false };
}

export function noticesForUpdate(data: TrackerData, before: Issue, after: Issue, actorId: string, now: string): MailNotice[] {
  const created: MailNotice[] = [];
  if (before.assigneeId !== after.assigneeId && after.assigneeId !== actorId) {
    created.push(
      notice(data, created.length + 1, {
        recipientId: after.assigneeId,
        issueId: after.id,
        issueKey: after.key,
        kind: "assigned",
        subject: `${after.key} assigned to you`,
        body: `${personName(data.people, actorId)} assigned ${after.key}: ${after.summary}`,
        createdAt: now
      })
    );
  }
  if (before.status !== after.status && after.assigneeId !== actorId) {
    created.push(
      notice(data, created.length + 1, {
        recipientId: after.assigneeId,
        issueId: after.id,
        issueKey: after.key,
        kind: "transition",
        subject: `${after.key} moved to ${after.status}`,
        body: `${personName(data.people, actorId)} moved ${after.key} from ${before.status} to ${after.status}.`,
        createdAt: now
      })
    );
  }
  return created;
}

export function noticesForComment(data: TrackerData, issue: Issue, body: string, actorId: string, now: string): MailNotice[] {
  const mentioned = new Set(mentionedIds(body, data.people));
  const recipients = new Set<string>([issue.assigneeId, issue.reporterId, ...mentioned]);
  recipients.delete(actorId);
  const created: MailNotice[] = [];
  for (const recipientId of recipients) {
    const kind: NotificationKind = mentioned.has(recipientId) ? "mention" : "comment";
    created.push(
      notice(data, created.length + 1, {
        recipientId,
        issueId: issue.id,
        issueKey: issue.key,
        kind,
        subject: kind === "mention" ? `${issue.key} mentioned you` : `${issue.key} has a new comment`,
        body,
        createdAt: now
      })
    );
  }
  return created;
}

export function appendNotices(data: TrackerData, notices: MailNotice[]): TrackerData {
  if (notices.length === 0) {
    return data;
  }
  return { ...data, notices: [...data.notices, ...notices] };
}

export function markNoticeRead(data: TrackerData, noticeId: string, actorId: string): TrackerData {
  return {
    ...data,
    notices: data.notices.map((item) => (item.id === noticeId && item.recipientId === actorId ? { ...item, read: true } : item))
  };
}

export function markAllNoticesRead(data: TrackerData, actorId: string): TrackerData {
  return {
    ...data,
    notices: data.notices.map((item) => (item.recipientId === actorId ? { ...item, read: true } : item))
  };
}

export function freshPresence(items: Presence[], now: number): Presence[] {
  return items.filter((item) => now - item.at < PRESENCE_TTL_MS);
}
