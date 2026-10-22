import {
  PRIORITIES,
  type ActivityEntry,
  type Issue,
  type IssueType,
  type Priority,
  type StatusCategory,
  type Workflow
} from "./issue.types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;
const RECENT_LIMIT = 10;

export const SUMMARY_TYPE_ORDER = ["task", "epic", "bug", "feature", "story", "subtask"] as const satisfies readonly IssueType[];

export type Share<T extends string> = {
  id: T;
  count: number;
  percent: number;
  jql: string;
};

export type StatusShare = Share<string> & {
  name: string;
  category: StatusCategory;
};

export type ActivityTile = {
  count: number;
  jql: string;
};

export type RecentActivity = {
  issueId: string;
  issueKey: string;
  summary: string;
  entry: ActivityEntry;
};

export type EpicProgress = {
  id: string;
  key: string;
  summary: string;
  done: number;
  inProgress: number;
  todo: number;
  total: number;
  percentDone: number;
};

export type SpaceSummary = {
  total: number;
  statuses: StatusShare[];
  activity: {
    completed: ActivityTile;
    updated: ActivityTile;
    created: ActivityTile;
    dueSoon: ActivityTile;
  };
  priorities: Share<Priority>[];
  priorityAxis: [number, number, number];
  types: Share<IssueType>[];
  workload: Share<string>[];
  recent: RecentActivity[];
  epics: EpicProgress[];
};

function day(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function percentOf(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

function quote(value: string): string {
  return `"${value.replaceAll('"', '\\"')}"`;
}

function categoryOf(workflow: Workflow, issue: Issue): StatusCategory {
  const status = workflow.statuses.find((item) => item.id === issue.status);
  if (status) {
    return status.category;
  }
  return issue.status === "done" ? "done" : "todo";
}

/** 요약 상단의 담당자 아바타로 고른 사람만 남긴다. 빈 문자열은 미배정이다. */
export function filterByAssignees(issues: Issue[], assigneeIds: readonly string[]): Issue[] {
  if (assigneeIds.length === 0) {
    return issues;
  }
  return issues.filter((issue) => assigneeIds.includes(issue.assigneeId));
}

/**
 * 스페이스 요약 카드에 필요한 숫자와 링크 JQL을 한 번에 만든다.
 * 7일 구간은 JQL 링크와 같도록 UTC 날짜 단위로 자른다.
 */
export function buildSpaceSummary(projectKey: string, issues: Issue[], workflow: Workflow, nowIso: string): SpaceSummary {
  const parsedNow = Date.parse(nowIso);
  const nowMs = Number.isNaN(parsedNow) ? 0 : parsedNow;
  const since = day(nowMs - WINDOW_DAYS * DAY_MS);
  const today = day(nowMs);
  const dueUntil = day(nowMs + WINDOW_DAYS * DAY_MS);
  const nowStamp = new Date(nowMs).toISOString();
  const scope = `project = ${projectKey}`;
  const total = issues.length;
  const inWindow = (value: string) => value >= since && value <= nowStamp;
  const isDone = (issue: Issue) => categoryOf(workflow, issue) === "done";

  const statuses = workflow.statuses.map((status) => {
    const count = issues.filter((issue) => issue.status === status.id).length;
    return {
      id: status.id,
      name: status.name,
      category: status.category,
      count,
      percent: percentOf(count, total),
      jql: `${scope} AND status = ${quote(status.id)}`
    };
  });

  const priorities = PRIORITIES.map((id) => {
    const count = issues.filter((issue) => issue.priority === id).length;
    return { id, count, percent: percentOf(count, total), jql: `${scope} AND priority = ${id}` };
  });
  const priorityMax = Math.max(1, ...priorities.map((item) => item.count));

  const types = SUMMARY_TYPE_ORDER.map((id) => {
    const count = issues.filter((issue) => issue.type === id).length;
    return { id, count, percent: percentOf(count, total), jql: `${scope} AND type = ${id}` };
  });

  const workloadMap = new Map<string, number>();
  for (const issue of issues) {
    workloadMap.set(issue.assigneeId, (workloadMap.get(issue.assigneeId) ?? 0) + 1);
  }
  const workload = [...workloadMap.entries()]
    .map(([id, count]) => ({
      id,
      count,
      percent: percentOf(count, total),
      jql: id.length === 0 ? `${scope} AND assignee IS EMPTY` : `${scope} AND assignee = ${quote(id)}`
    }))
    .sort((left, right) => {
      if (left.id.length === 0 && right.id.length > 0) {
        return -1;
      }
      if (right.id.length === 0 && left.id.length > 0) {
        return 1;
      }
      return right.count - left.count || left.id.localeCompare(right.id);
    });

  const recent = issues
    .flatMap((issue) => issue.activity.map((entry) => ({ issueId: issue.id, issueKey: issue.key, summary: issue.summary, entry })))
    .sort((left, right) => right.entry.at.localeCompare(left.entry.at))
    .slice(0, RECENT_LIMIT);

  const epics = issues
    .filter((issue) => issue.type === "epic")
    .map((epic) => {
      const children = issues.filter((issue) => issue.parentId === epic.id);
      const done = children.filter((issue) => categoryOf(workflow, issue) === "done").length;
      const inProgress = children.filter((issue) => categoryOf(workflow, issue) === "in_progress").length;
      return {
        id: epic.id,
        key: epic.key,
        summary: epic.summary,
        done,
        inProgress,
        todo: children.length - done - inProgress,
        total: children.length,
        percentDone: percentOf(done, children.length)
      };
    })
    .sort((left, right) => left.key.localeCompare(right.key));

  return {
    total,
    statuses,
    activity: {
      completed: {
        count: issues.filter((issue) => isDone(issue) && inWindow(issue.updatedAt)).length,
        jql: `${scope} AND resolution = Done AND updated >= ${quote(since)}`
      },
      updated: {
        count: issues.filter((issue) => inWindow(issue.updatedAt)).length,
        jql: `${scope} AND updated >= ${quote(since)}`
      },
      created: {
        count: issues.filter((issue) => inWindow(issue.createdAt)).length,
        jql: `${scope} AND created >= ${quote(since)}`
      },
      dueSoon: {
        count: issues.filter(
          (issue) => !isDone(issue) && issue.dueDate !== null && issue.dueDate >= today && issue.dueDate < dueUntil
        ).length,
        jql: `${scope} AND resolution = Unresolved AND due >= ${quote(today)} AND due < ${quote(dueUntil)}`
      }
    },
    priorities,
    priorityAxis: [0, priorityMax / 2, priorityMax],
    types,
    workload,
    recent,
    epics
  };
}
