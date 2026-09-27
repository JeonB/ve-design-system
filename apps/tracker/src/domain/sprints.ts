import type { Issue, Sprint, TrackerData } from "./issue.types";
import { updateIssue } from "./issues";

export function sprintsByProject(data: TrackerData, projectKey: string): Sprint[] {
  return data.sprints.filter((sprint) => sprint.projectKey === projectKey);
}

export function activeSprint(data: TrackerData, projectKey: string): Sprint | undefined {
  return sprintsByProject(data, projectKey).find((sprint) => sprint.state === "active");
}

export function sprintName(data: TrackerData, sprintId: string | null): string {
  if (sprintId === null) {
    return "Backlog";
  }
  return data.sprints.find((sprint) => sprint.id === sprintId)?.name ?? "Backlog";
}

export function issuesInSprint(data: TrackerData, sprintId: string): Issue[] {
  return data.issues
    .filter((issue) => issue.sprintId === sprintId)
    .sort((left, right) => left.rank - right.rank);
}

export function backlogIssues(data: TrackerData, projectKey: string): Issue[] {
  return data.issues
    .filter((issue) => issue.projectKey === projectKey && issue.sprintId === null)
    .sort((left, right) => left.rank - right.rank);
}

export function createSprint(
  data: TrackerData,
  projectKey: string,
  name: string
): { data: TrackerData; sprint: Sprint } | { error: string } {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { error: "Sprint name is required." };
  }
  const count = sprintsByProject(data, projectKey).length + 1;
  const sprint: Sprint = {
    id: `${projectKey}-S${count}`,
    projectKey,
    name: trimmed,
    state: "future",
    startDate: null,
    endDate: null
  };
  return { data: { ...data, sprints: [...data.sprints, sprint] }, sprint };
}

export function startSprint(
  data: TrackerData,
  sprintId: string,
  now: string
): { data: TrackerData } | { error: string } {
  const sprint = data.sprints.find((item) => item.id === sprintId);
  if (!sprint || sprint.state !== "future") {
    return { error: "Only a future sprint can be started." };
  }
  if (activeSprint(data, sprint.projectKey)) {
    return { error: "Complete the active sprint first." };
  }
  return {
    data: {
      ...data,
      sprints: data.sprints.map((item) =>
        item.id === sprintId ? { ...item, state: "active", startDate: now } : item
      )
    }
  };
}

export function assignSprint(
  data: TrackerData,
  issueId: string,
  sprintId: string | null,
  now: string,
  actorId: string
): TrackerData {
  const issue = data.issues.find((item) => item.id === issueId);
  if (!issue || issue.sprintId === sprintId) {
    return data;
  }
  const from = sprintName(data, issue.sprintId);
  const to = sprintName(data, sprintId);
  const moved = updateIssue(data, issueId, {}, now, actorId);
  return {
    ...moved,
    issues: moved.issues.map((item) => {
      if (item.id !== issueId) {
        return item;
      }
      return {
        ...item,
        sprintId,
        updatedAt: now,
        activity: [
          ...item.activity,
          {
            id: `${item.id}-a${item.activity.length + 1}`,
            actorId,
            at: now,
            field: "sprint",
            from,
            to
          }
        ]
      };
    })
  };
}

export function completeSprint(data: TrackerData, sprintId: string, now: string, actorId: string): TrackerData {
  const sprint = data.sprints.find((item) => item.id === sprintId);
  if (!sprint || sprint.state !== "active") {
    return data;
  }
  let next: TrackerData = {
    ...data,
    sprints: data.sprints.map((item) =>
      item.id === sprintId ? { ...item, state: "closed", endDate: now } : item
    )
  };
  for (const issue of data.issues) {
    if (issue.sprintId === sprintId && issue.status !== "done") {
      next = assignSprint(next, issue.id, null, now, actorId);
    }
  }
  return next;
}
