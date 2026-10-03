export const ISSUE_TYPES = ["epic", "story", "task", "bug", "subtask"] as const;
export type IssueType = (typeof ISSUE_TYPES)[number];

export const ISSUE_STATUSES = ["todo", "in_progress", "in_review", "done"] as const;
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

export const SPRINT_STATES = ["future", "active", "closed"] as const;
export type SprintState = (typeof SPRINT_STATES)[number];

export type Sprint = {
  id: string;
  projectKey: string;
  name: string;
  state: SprintState;
  startDate: string | null;
  endDate: string | null;
};

export type Attachment = {
  id: string;
  name: string;
  mediaType: string;
  size: number;
  dataUrl: string;
  authorId: string;
  createdAt: string;
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
  "comment",
  "sprint",
  "labels",
  "points",
  "parent",
  "attachment"
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
  status: string;
  priority: Priority;
  summary: string;
  description: string;
  assigneeId: string;
  reporterId: string;
  sprintId: string | null;
  rank: number;
  labels: string[];
  storyPoints: number | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  attachments: Attachment[];
  activity: ActivityEntry[];
};

export const STATUS_CATEGORIES = ["todo", "in_progress", "done"] as const;
export type StatusCategory = (typeof STATUS_CATEGORIES)[number];

export type WorkflowStatus = {
  id: string;
  name: string;
  category: StatusCategory;
};

export type WorkflowTransition = {
  id: string;
  from: string;
  to: string;
  name: string;
};

export type Workflow = {
  projectKey: string;
  statuses: WorkflowStatus[];
  transitions: WorkflowTransition[];
};

export const PROJECT_ROLES = ["admin", "member", "viewer"] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];

export const PROJECT_ACTIONS = ["view", "create", "edit", "comment", "transition", "attach", "delete", "sprint", "manage"] as const;
export type ProjectAction = (typeof PROJECT_ACTIONS)[number];

export type Membership = {
  projectKey: string;
  personId: string;
  role: ProjectRole;
};

export type SavedFilter = {
  id: string;
  projectKey: string;
  name: string;
  query: string;
  type: IssueType | "all";
  status: string | "all";
  assigneeId: string | "all";
  jql: string;
};

export type TrackerData = {
  projects: Project[];
  people: Person[];
  sprints: Sprint[];
  issues: Issue[];
  savedFilters: SavedFilter[];
  memberships: Membership[];
  workflows: Workflow[];
};

export type CreateIssueInput = {
  type: IssueType;
  summary: string;
  description: string;
  priority: Priority;
  sprintId?: string | null;
  parentId?: string | null;
};

export type IssuePatch = {
  summary?: string;
  description?: string;
  type?: IssueType;
  status?: string;
  priority?: Priority;
  assigneeId?: string;
  labels?: string[];
  storyPoints?: number | null;
  parentId?: string | null;
};

export type IssueFilter = {
  query: string;
  type: IssueType | "all";
  status: string | "all";
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

export function isSprintState(value: string): value is SprintState {
  return (SPRINT_STATES as readonly string[]).includes(value);
}

export function validateSummary(summary: string): string | null {
  if (summary.trim().length === 0) {
    return "Summary is required.";
  }
  return null;
}
