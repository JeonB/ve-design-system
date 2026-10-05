import type {
  ActivityEntry,
  ActivityField,
  CreateIssueInput,
  Issue,
  IssueFilter,
  IssuePatch,
  LinkType,
  Person,
  Project,
  TrackerData
} from "./issue.types";
import { canTransition, workflowFor } from "./workflow";

export function projectByKey(data: TrackerData, projectKey: string): Project | undefined {
  return data.projects.find((project) => project.key === projectKey);
}

export function personById(data: TrackerData, personId: string): Person | undefined {
  return data.people.find((person) => person.id === personId);
}

export function issueById(data: TrackerData, issueId: string): Issue | undefined {
  return data.issues.find((issue) => issue.id === issueId);
}

export function childIssues(data: TrackerData, parentId: string): Issue[] {
  return data.issues.filter((issue) => issue.parentId === parentId);
}

export function issuesByProject(data: TrackerData, projectKey: string): Issue[] {
  return data.issues.filter((issue) => issue.projectKey === projectKey);
}

export function countByProject(data: TrackerData, projectKey: string): number {
  return issuesByProject(data, projectKey).length;
}

function nextNumber(issues: Issue[], projectKey: string): number {
  const numbers = issues.filter((issue) => issue.projectKey === projectKey).map((issue) => issue.number);
  return Math.max(0, ...numbers) + 1;
}

export function appendIssue(
  data: TrackerData,
  projectKey: string,
  input: CreateIssueInput,
  now: string,
  actorId: string
): { data: TrackerData; issue: Issue } {
  if (!projectByKey(data, projectKey)) {
    throw new Error(`Unknown project: ${projectKey}`);
  }

  const number = nextNumber(data.issues, projectKey);
  const issue: Issue = {
    id: `${projectKey}-${number}`,
    number,
    key: `${projectKey}-${number}`,
    projectKey,
    type: input.type,
    status: input.status ?? "todo",
    priority: input.priority,
    summary: input.summary.trim(),
    description: input.description.trim(),
    assigneeId: input.assigneeId ?? actorId,
    reporterId: actorId,
    sprintId: input.sprintId ?? null,
    rank: number,
    labels: input.labels ?? [],
    storyPoints: null,
    parentId: input.parentId ?? null,
    dueDate: input.dueDate ?? null,
    startDate: null,
    watchers: [actorId],
    links: [],
    attachments: [],
    createdAt: now,
    updatedAt: now,
    comments: [],
    activity: [
      {
        id: `${projectKey}-${number}-a1`,
        actorId,
        at: now,
        field: "created",
        from: "",
        to: input.summary.trim()
      }
    ]
  };

  return {
    data: { ...data, issues: [...data.issues, issue] },
    issue
  };
}

const PATCH_FIELDS: Array<{ key: keyof IssuePatch; field: ActivityField }> = [
  { key: "summary", field: "summary" },
  { key: "description", field: "description" },
  { key: "type", field: "type" },
  { key: "status", field: "status" },
  { key: "priority", field: "priority" },
  { key: "assigneeId", field: "assignee" },
  { key: "labels", field: "labels" },
  { key: "storyPoints", field: "points" },
  { key: "parentId", field: "parent" },
  { key: "dueDate", field: "due" },
  { key: "startDate", field: "start" }
];

function readPatchValue(issue: Issue, key: keyof IssuePatch): string {
  switch (key) {
    case "labels":
      return issue.labels.join(", ");
    case "storyPoints":
      return issue.storyPoints === null ? "" : String(issue.storyPoints);
    case "parentId":
      return issue.parentId ?? "";
    case "dueDate":
      return issue.dueDate ?? "";
    case "startDate":
      return issue.startDate ?? "";
    case "summary":
    case "description":
    case "type":
    case "status":
    case "priority":
    case "assigneeId":
      return String(issue[key] ?? "");
    default: {
      const exhaustive: never = key;
      return exhaustive;
    }
  }
}

function nextActivity(issue: Issue, entry: Omit<ActivityEntry, "id">, offset = 1): ActivityEntry {
  return { ...entry, id: `${issue.id}-a${issue.activity.length + offset}` };
}

export function updateIssue(
  data: TrackerData,
  issueId: string,
  patch: IssuePatch,
  now: string,
  actorId: string
): TrackerData {
  return {
    ...data,
    issues: data.issues.map((issue) => {
      if (issue.id !== issueId) {
        return issue;
      }

      const nextSummary = patch.summary === undefined ? issue.summary : patch.summary.trim();
      const nextDescription = patch.description === undefined ? issue.description : patch.description.trim();
      const next: Issue = {
        ...issue,
        ...patch,
        summary: nextSummary,
        description: nextDescription
      };
      const changes: ActivityEntry[] = [];

      for (const tracked of PATCH_FIELDS) {
        const before = readPatchValue(issue, tracked.key);
        const after = readPatchValue(next, tracked.key);
        if (before === after) {
          continue;
        }
        changes.push(
          nextActivity(
            issue,
            {
              actorId,
              at: now,
              field: tracked.field,
              from: before,
              to: after
            },
            changes.length + 1
          )
        );
      }

      if (changes.length === 0) {
        return issue;
      }

      return {
        ...next,
        updatedAt: now,
        activity: [...issue.activity, ...changes]
      };
    })
  };
}

export type BulkIssuePatch = {
  assigneeId?: string;
  status?: string;
};

export function bulkUpdateIssues(
  data: TrackerData,
  issueIds: string[],
  patch: BulkIssuePatch,
  now: string,
  actorId: string
): { data: TrackerData; updatedIds: string[]; skippedIds: string[] } {
  const updatedIds: string[] = [];
  const skippedIds: string[] = [];
  let next = data;

  for (const issueId of issueIds) {
    const issue = issueById(next, issueId);
    if (!issue) {
      skippedIds.push(issueId);
      continue;
    }
    const change: IssuePatch = {};
    if (patch.assigneeId !== undefined && patch.assigneeId !== issue.assigneeId) {
      change.assigneeId = patch.assigneeId;
    }
    if (patch.status !== undefined && patch.status !== issue.status) {
      const workflow = workflowFor(next, issue.projectKey);
      if (canTransition(workflow, issue.status, patch.status)) {
        change.status = patch.status;
      }
    }
    if (change.assigneeId === undefined && change.status === undefined) {
      skippedIds.push(issueId);
      continue;
    }
    next = updateIssue(next, issueId, change, now, actorId);
    updatedIds.push(issueId);
  }

  return { data: next, updatedIds, skippedIds };
}

export function deleteIssue(data: TrackerData, issueId: string): TrackerData {
  return {
    ...data,
    issues: data.issues.filter((issue) => issue.id !== issueId)
  };
}

export function addComment(
  data: TrackerData,
  issueId: string,
  body: string,
  authorId: string,
  now: string
): TrackerData {
  const trimmed = body.trim();
  if (trimmed.length === 0) {
    return data;
  }

  return {
    ...data,
    issues: data.issues.map((issue) => {
      if (issue.id !== issueId) {
        return issue;
      }

      const comment = {
        id: `${issueId}-c${issue.comments.length + 1}`,
        authorId,
        body: trimmed,
        createdAt: now
      };

      return {
        ...issue,
        updatedAt: now,
        comments: [...issue.comments, comment],
        activity: [
          ...issue.activity,
          nextActivity(issue, {
            actorId: authorId,
            at: now,
            field: "comment",
            from: "",
            to: trimmed
          })
        ]
      };
    })
  };
}

export function matchesQuickFilter(issue: Issue, query: string, onlyAssigneeId: string | null): boolean {
  if (onlyAssigneeId && issue.assigneeId !== onlyAssigneeId) {
    return false;
  }
  const needle = query.trim().toLowerCase();
  if (needle.length === 0) {
    return true;
  }
  return issue.summary.toLowerCase().includes(needle) || issue.key.toLowerCase().includes(needle);
}

export function toggleWatch(data: TrackerData, issueId: string, personId: string): TrackerData {
  return {
    ...data,
    issues: data.issues.map((issue) => {
      if (issue.id !== issueId) {
        return issue;
      }
      const watching = issue.watchers.includes(personId);
      return {
        ...issue,
        watchers: watching ? issue.watchers.filter((id) => id !== personId) : [...issue.watchers, personId]
      };
    })
  };
}

function inverseLink(type: LinkType): LinkType {
  switch (type) {
    case "blocks":
      return "blocked_by";
    case "blocked_by":
      return "blocks";
    case "relates":
    case "duplicates":
      return type;
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

function withLinkActivity(issue: Issue, actorId: string, now: string, from: string, to: string): Issue {
  return {
    ...issue,
    updatedAt: now,
    activity: [...issue.activity, nextActivity(issue, { actorId, at: now, field: "link", from, to })]
  };
}

export function addLink(
  data: TrackerData,
  issueId: string,
  type: LinkType,
  targetId: string,
  now: string,
  actorId: string
): { data: TrackerData } | { error: string } {
  if (issueId === targetId) {
    return { error: "An issue cannot link to itself." };
  }
  const source = issueById(data, issueId);
  const target = issueById(data, targetId);
  if (!source || !target) {
    return { error: "Choose an existing issue." };
  }
  if (source.links.some((link) => link.issueId === targetId)) {
    return { error: "These issues are already linked." };
  }
  return {
    data: {
      ...data,
      issues: data.issues.map((issue) => {
        if (issue.id === issueId) {
          return withLinkActivity({ ...issue, links: [...issue.links, { type, issueId: targetId }] }, actorId, now, "", `${type} ${target.key}`);
        }
        if (issue.id === targetId) {
          const back = inverseLink(type);
          return withLinkActivity({ ...issue, links: [...issue.links, { type: back, issueId }] }, actorId, now, "", `${back} ${source.key}`);
        }
        return issue;
      })
    }
  };
}

export function removeLink(data: TrackerData, issueId: string, targetId: string, now: string, actorId: string): TrackerData {
  const source = issueById(data, issueId);
  const target = issueById(data, targetId);
  if (!source || !target) {
    return data;
  }
  return {
    ...data,
    issues: data.issues.map((issue) => {
      if (issue.id === issueId) {
        return withLinkActivity({ ...issue, links: issue.links.filter((link) => link.issueId !== targetId) }, actorId, now, target.key, "");
      }
      if (issue.id === targetId) {
        return withLinkActivity({ ...issue, links: issue.links.filter((link) => link.issueId !== issueId) }, actorId, now, source.key, "");
      }
      return issue;
    })
  };
}

export function filterIssues(issues: Issue[], filter: IssueFilter): Issue[] {
  const query = filter.query.trim().toLowerCase();

  return [...issues]
    .filter((issue) => {
      if (filter.type !== "all" && issue.type !== filter.type) {
        return false;
      }
      if (filter.status !== "all" && issue.status !== filter.status) {
        return false;
      }
      if (filter.assigneeId !== "all" && issue.assigneeId !== filter.assigneeId) {
        return false;
      }
      if (query.length === 0) {
        return true;
      }
      return (
        issue.summary.toLowerCase().includes(query) ||
        issue.key.toLowerCase().includes(query) ||
        issue.labels.some((label) => label.toLowerCase().includes(query))
      );
    })
    .sort((left, right) => {
      if (left.updatedAt === right.updatedAt) {
        return right.number - left.number;
      }
      return left.updatedAt < right.updatedAt ? 1 : -1;
    });
}
