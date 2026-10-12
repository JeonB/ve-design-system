import { PRIORITIES, type Issue, type IssueType, type Priority, type Workflow } from "./issue.types";

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export const SUMMARY_TYPE_ORDER = ["task", "epic", "bug", "feature", "story", "subtask"] as const satisfies readonly IssueType[];

export type SummaryCount<T extends string> = {
  id: T;
  count: number;
};

export type EpicProgress = {
  id: string;
  key: string;
  summary: string;
  done: number;
  total: number;
};

export type SpaceSummary = {
  total: number;
  statuses: { id: string; name: string; count: number }[];
  activity: {
    completed: number;
    updated: number;
    created: number;
    dueSoon: number;
  };
  priorities: SummaryCount<Priority>[];
  types: SummaryCount<IssueType>[];
  workload: { assigneeId: string; count: number }[];
  epics: EpicProgress[];
};

function parsedTime(value: string): number | null {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function inPastWindow(value: string, nowMs: number): boolean {
  const parsed = parsedTime(value);
  return parsed !== null && parsed <= nowMs && parsed >= nowMs - WINDOW_MS;
}

function utcDayStart(nowMs: number): number {
  const date = new Date(nowMs);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function isDone(workflow: Workflow, issue: Issue): boolean {
  const status = workflow.statuses.find((item) => item.id === issue.status);
  return status ? status.category === "done" : issue.status === "done";
}

function dueSoon(issue: Issue, workflow: Workflow, nowMs: number): boolean {
  if (isDone(workflow, issue) || issue.dueDate === null) {
    return false;
  }
  const parsed = parsedTime(issue.dueDate);
  if (parsed === null) {
    return false;
  }
  const start = utcDayStart(nowMs);
  return parsed >= start && parsed < start + WINDOW_MS;
}

export function buildSpaceSummary(issues: Issue[], workflow: Workflow, nowIso: string): SpaceSummary {
  const nowMs = parsedTime(nowIso) ?? Date.parse("1970-01-01T00:00:00.000Z");
  const statuses = workflow.statuses.map((status) => ({
    id: status.id,
    name: status.name,
    count: issues.filter((issue) => issue.status === status.id).length
  }));
  const priorities = PRIORITIES.map((id) => ({
    id,
    count: issues.filter((issue) => issue.priority === id).length
  }));
  const types = SUMMARY_TYPE_ORDER.map((id) => ({
    id,
    count: issues.filter((issue) => issue.type === id).length
  }));
  const workloadMap = new Map<string, number>();
  for (const issue of issues) {
    workloadMap.set(issue.assigneeId, (workloadMap.get(issue.assigneeId) ?? 0) + 1);
  }
  const workload = [...workloadMap.entries()]
    .map(([assigneeId, count]) => ({ assigneeId, count }))
    .sort((left, right) => {
      if (left.assigneeId.length === 0 && right.assigneeId.length > 0) {
        return -1;
      }
      if (right.assigneeId.length === 0 && left.assigneeId.length > 0) {
        return 1;
      }
      return right.count - left.count || left.assigneeId.localeCompare(right.assigneeId);
    });
  const epics = issues
    .filter((issue) => issue.type === "epic")
    .map((epic) => {
      const children = issues.filter((issue) => issue.parentId === epic.id);
      return {
        id: epic.id,
        key: epic.key,
        summary: epic.summary,
        done: children.filter((issue) => isDone(workflow, issue)).length,
        total: children.length
      };
    })
    .sort((left, right) => left.key.localeCompare(right.key));

  return {
    total: issues.length,
    statuses,
    activity: {
      completed: issues.filter((issue) => isDone(workflow, issue) && inPastWindow(issue.updatedAt, nowMs)).length,
      updated: issues.filter((issue) => inPastWindow(issue.updatedAt, nowMs)).length,
      created: issues.filter((issue) => inPastWindow(issue.createdAt, nowMs)).length,
      dueSoon: issues.filter((issue) => dueSoon(issue, workflow, nowMs)).length
    },
    priorities,
    types,
    workload,
    epics
  };
}
