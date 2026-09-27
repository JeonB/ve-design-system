import type {
  ActivityEntry,
  ActivityField,
  CreateIssueInput,
  Issue,
  IssueFilter,
  IssuePatch,
  Person,
  Project,
  TrackerData
} from "./issue.types";

export function projectByKey(data: TrackerData, projectKey: string): Project | undefined {
  return data.projects.find((project) => project.key === projectKey);
}

export function personById(data: TrackerData, personId: string): Person | undefined {
  return data.people.find((person) => person.id === personId);
}

export function issueById(data: TrackerData, issueId: string): Issue | undefined {
  return data.issues.find((issue) => issue.id === issueId);
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
    status: "todo",
    priority: input.priority,
    summary: input.summary.trim(),
    description: input.description.trim(),
    assigneeId: actorId,
    reporterId: actorId,
    sprintId: input.sprintId ?? null,
    rank: number,
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
  { key: "assigneeId", field: "assignee" }
];

function readPatchValue(issue: Issue, key: keyof IssuePatch): string {
  const value = issue[key];
  return value === undefined ? "" : String(value);
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
      return issue.summary.toLowerCase().includes(query);
    })
    .sort((left, right) => {
      if (left.updatedAt === right.updatedAt) {
        return right.number - left.number;
      }
      return left.updatedAt < right.updatedAt ? 1 : -1;
    });
}
