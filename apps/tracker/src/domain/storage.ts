import {
  isActivityField,
  isIssueStatus,
  isIssueType,
  isPriority,
  isSprintState,
  type ActivityEntry,
  type Comment,
  type Issue,
  type Person,
  type Project,
  type Sprint,
  type TrackerData
} from "./issue.types";
import { seedTracker } from "./seed";

export const TRACKER_STORAGE_KEY = "ve-tracker-data";
export const TRACKER_SCHEMA_VERSION = 2;

type KeyValueStorage = Pick<Storage, "getItem" | "setItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function readComment(value: unknown): Comment | null {
  if (!isRecord(value) || !isString(value.id) || !isString(value.authorId) || !isString(value.body) || !isString(value.createdAt)) {
    return null;
  }
  return {
    id: value.id,
    authorId: value.authorId,
    body: value.body,
    createdAt: value.createdAt
  };
}

function readActivity(value: unknown): ActivityEntry | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.actorId) ||
    !isString(value.at) ||
    !isString(value.field) ||
    !isActivityField(value.field) ||
    !isString(value.from) ||
    !isString(value.to)
  ) {
    return null;
  }
  return {
    id: value.id,
    actorId: value.actorId,
    at: value.at,
    field: value.field,
    from: value.from,
    to: value.to
  };
}

type ReadIssue = {
  issue: Issue;
  legacyOnBoard: boolean;
};

function readLabels(value: unknown): string[] | null {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || !value.every((item) => isString(item))) {
    return null;
  }
  return value;
}

function readPoints(value: unknown): number | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return Number.NaN;
}

function readIssue(value: unknown): ReadIssue | null {
  if (!isRecord(value)) {
    return null;
  }
  if (
    !isString(value.id) ||
    typeof value.number !== "number" ||
    !isString(value.key) ||
    !isString(value.projectKey) ||
    !isString(value.type) ||
    !isIssueType(value.type) ||
    !isString(value.status) ||
    (value.status !== "backlog" && !isIssueStatus(value.status)) ||
    !isString(value.priority) ||
    !isPriority(value.priority) ||
    !isString(value.summary) ||
    !isString(value.description) ||
    !isString(value.assigneeId) ||
    !isString(value.reporterId) ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt) ||
    !Array.isArray(value.comments)
  ) {
    return null;
  }

  const comments: Comment[] = [];
  for (const item of value.comments) {
    const comment = readComment(item);
    if (!comment) {
      return null;
    }
    comments.push(comment);
  }

  const activity: ActivityEntry[] = [];
  if (value.activity !== undefined) {
    if (!Array.isArray(value.activity)) {
      return null;
    }
    for (const item of value.activity) {
      const entry = readActivity(item);
      if (!entry) {
        return null;
      }
      activity.push(entry);
    }
  }

  const labels = readLabels(value.labels);
  const storyPoints = readPoints(value.storyPoints);
  if (labels === null) {
    return null;
  }
  if (Number.isNaN(storyPoints)) {
    return null;
  }
  if (value.parentId !== undefined && value.parentId !== null && !isString(value.parentId)) {
    return null;
  }
  const legacyOnBoard = value.sprintId === undefined && value.status !== "backlog";
  const sprintId = isString(value.sprintId) || value.sprintId === null ? value.sprintId : null;
  const rank = typeof value.rank === "number" ? value.rank : value.number;
  if (!isIssueStatus(value.status) && value.status !== "backlog") {
    return null;
  }

  return {
    legacyOnBoard,
    issue: {
      id: value.id,
      number: value.number,
      key: value.key,
      projectKey: value.projectKey,
      type: value.type,
      status: value.status === "backlog" ? "todo" : value.status,
      priority: value.priority,
      summary: value.summary,
      description: value.description,
      assigneeId: value.assigneeId,
      reporterId: value.reporterId,
      sprintId: value.status === "backlog" ? null : sprintId,
      rank,
      labels,
      storyPoints,
      parentId: value.parentId === undefined || value.parentId === null ? null : isString(value.parentId) ? value.parentId : null,
      createdAt: value.createdAt,
      updatedAt: value.updatedAt,
      comments,
      activity
    }
  };
}

function readSprint(value: unknown): Sprint | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.projectKey) ||
    !isString(value.name) ||
    !isString(value.state) ||
    !isSprintState(value.state) ||
    !(isString(value.startDate) || value.startDate === null) ||
    !(isString(value.endDate) || value.endDate === null)
  ) {
    return null;
  }
  return {
    id: value.id,
    projectKey: value.projectKey,
    name: value.name,
    state: value.state,
    startDate: value.startDate,
    endDate: value.endDate
  };
}

function readProject(value: unknown): Project | null {
  if (!isRecord(value) || !isString(value.key) || !isString(value.name) || !isString(value.description)) {
    return null;
  }
  return { key: value.key, name: value.name, description: value.description };
}

function readPerson(value: unknown): Person | null {
  if (!isRecord(value) || !isString(value.id) || !isString(value.name)) {
    return null;
  }
  return { id: value.id, name: value.name };
}

export function parseTracker(raw: string): TrackerData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed) || (parsed.version !== 1 && parsed.version !== TRACKER_SCHEMA_VERSION) || !isRecord(parsed.data)) {
    return null;
  }
  const data = parsed.data;
  if (!Array.isArray(data.projects) || !Array.isArray(data.people) || !Array.isArray(data.issues)) {
    return null;
  }
  const legacy = parsed.version === 1;

  const projects: Project[] = [];
  for (const item of data.projects) {
    const project = readProject(item);
    if (!project) {
      return null;
    }
    projects.push(project);
  }

  const people: Person[] = [];
  for (const item of data.people) {
    const person = readPerson(item);
    if (!person) {
      return null;
    }
    people.push(person);
  }

  const issues: Issue[] = [];
  const legacyBoardIds = new Set<string>();
  for (const item of data.issues) {
    const read = readIssue(item);
    if (!read) {
      return null;
    }
    if (read.legacyOnBoard) {
      legacyBoardIds.add(read.issue.id);
    }
    issues.push(read.issue);
  }

  const sprints: Sprint[] = [];
  if (Array.isArray(data.sprints)) {
    for (const item of data.sprints) {
      const sprint = readSprint(item);
      if (!sprint) {
        return null;
      }
      sprints.push(sprint);
    }
  } else if (!legacy) {
    return null;
  }

  if (legacyBoardIds.size > 0) {
    for (const project of projects) {
      const sprintId = `${project.key}-S1`;
      if (!sprints.some((sprint) => sprint.id === sprintId)) {
        sprints.push({
          id: sprintId,
          projectKey: project.key,
          name: "Sprint 1",
          state: "active",
          startDate: null,
          endDate: null
        });
      }
    }
    for (const issue of issues) {
      if (legacyBoardIds.has(issue.id)) {
        issue.sprintId = `${issue.projectKey}-S1`;
      }
    }
  }

  return { projects, people, sprints, issues };
}

export function serializeTracker(data: TrackerData): string {
  return JSON.stringify({ version: TRACKER_SCHEMA_VERSION, data });
}

export function loadTracker(storage: KeyValueStorage): TrackerData {
  const raw = storage.getItem(TRACKER_STORAGE_KEY);
  if (raw === null) {
    return seedTracker();
  }
  return parseTracker(raw) ?? seedTracker();
}

export function saveTracker(storage: KeyValueStorage, data: TrackerData): void {
  storage.setItem(TRACKER_STORAGE_KEY, serializeTracker(data));
}
