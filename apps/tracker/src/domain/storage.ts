import { isActivityField, isIssueStatus, isIssueType, isPriority, type ActivityEntry, type Comment, type Issue, type Person, type Project, type TrackerData } from "./issue.types";
import { seedTracker } from "./seed";

export const TRACKER_STORAGE_KEY = "ve-tracker-data";
export const TRACKER_SCHEMA_VERSION = 1;

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

function readIssue(value: unknown): Issue | null {
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
    !isIssueStatus(value.status) ||
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

  return {
    id: value.id,
    number: value.number,
    key: value.key,
    projectKey: value.projectKey,
    type: value.type,
    status: value.status,
    priority: value.priority,
    summary: value.summary,
    description: value.description,
    assigneeId: value.assigneeId,
    reporterId: value.reporterId,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    comments,
    activity
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
  if (!isRecord(parsed) || parsed.version !== TRACKER_SCHEMA_VERSION || !isRecord(parsed.data)) {
    return null;
  }
  const data = parsed.data;
  if (!Array.isArray(data.projects) || !Array.isArray(data.people) || !Array.isArray(data.issues)) {
    return null;
  }

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
  for (const item of data.issues) {
    const issue = readIssue(item);
    if (!issue) {
      return null;
    }
    issues.push(issue);
  }

  return { projects, people, issues };
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
