export const ISSUE_TYPES = ["epic", "story", "task", "bug"] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_STATUSES = ["backlog", "todo", "in_progress", "in_review", "done"] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Person = {
  id: string;
  name: string;
};

export type Project = {
  key: string;
  name: string;
  description: string;
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export const ACTIVITY_FIELDS = [
  "created",
  "summary",
  "description",
  "type",
  "status",
  "priority",
  "assignee",
  "comment"
] as const;

export type ActivityField = (typeof ACTIVITY_FIELDS)[number];

export type ActivityEntry = {
  id: string;
  actorId: string;
  at: string;
  field: ActivityField;
  from: string;
  to: string;
};

export type Issue = {
  id: string;
  number: number;
  key: string;
  projectKey: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  summary: string;
  description: string;
  assigneeId: string;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  activity: ActivityEntry[];
};

export type TrackerData = {
  projects: Project[];
  people: Person[];
  issues: Issue[];
};

export type CreateIssueInput = {
  type: IssueType;
  summary: string;
  description: string;
  priority: Priority;
};

export type IssuePatch = {
  summary?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
  priority?: Priority;
  assigneeId?: string;
};

export type IssueFilter = {
  query: string;
  type: IssueType | "all";
  status: IssueStatus | "all";
  assigneeId: string | "all";
};

export function isIssueType(value: string): value is IssueType {
  return (ISSUE_TYPES as readonly string[]).includes(value);
}

export function isIssueStatus(value: string): value is IssueStatus {
  return (ISSUE_STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: string): value is Priority {
  return (PRIORITIES as readonly string[]).includes(value);
}

export function isActivityField(value: string): value is ActivityField {
  return (ACTIVITY_FIELDS as readonly string[]).includes(value);
}

export function validateSummary(summary: string): string | null {
  if (summary.trim().length === 0) {
    return "Summary is required.";
  }
  return null;
}
