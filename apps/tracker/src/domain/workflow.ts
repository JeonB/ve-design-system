import {
  STATUS_CATEGORIES,
  TRANSITION_GUARDS,
  type Issue,
  type StatusCategory,
  type TrackerData,
  type TransitionGuard,
  type Workflow,
  type WorkflowStatus,
  type WorkflowTransition
} from "./issue.types";
import { membershipFor } from "./permissions";

export type { StatusCategory, TransitionGuard, Workflow, WorkflowStatus, WorkflowTransition };

export function isStatusCategory(value: string): value is StatusCategory {
  return (STATUS_CATEGORIES as readonly string[]).includes(value);
}

export function isTransitionGuard(value: string): value is TransitionGuard {
  return (TRANSITION_GUARDS as readonly string[]).includes(value);
}

export function defaultWorkflow(projectKey: string): Workflow {
  return {
    projectKey,
    statuses: [
      { id: "todo", name: "To do", category: "todo" },
      { id: "in_progress", name: "In progress", category: "in_progress" },
      { id: "in_review", name: "In review", category: "in_progress" },
      { id: "done", name: "Done", category: "done" }
    ],
    transitions: [
      { id: `${projectKey}-t-start`, from: "todo", to: "in_progress", name: "Start", guard: "any" },
      { id: `${projectKey}-t-review`, from: "in_progress", to: "in_review", name: "Review", guard: "any" },
      { id: `${projectKey}-t-stop`, from: "in_progress", to: "todo", name: "Stop", guard: "any" },
      { id: `${projectKey}-t-done`, from: "in_review", to: "done", name: "Done", guard: "any" },
      { id: `${projectKey}-t-back`, from: "in_review", to: "in_progress", name: "Back", guard: "any" },
      { id: `${projectKey}-t-reopen`, from: "done", to: "in_review", name: "Reopen", guard: "any" }
    ]
  };
}

export function workflowFor(data: TrackerData, projectKey: string): Workflow {
  return data.workflows.find((workflow) => workflow.projectKey === projectKey) ?? defaultWorkflow(projectKey);
}

export function statusName(data: TrackerData, projectKey: string, statusId: string): string {
  return workflowFor(data, projectKey).statuses.find((status) => status.id === statusId)?.name ?? statusId;
}

export function isDoneStatus(data: TrackerData, issue: Issue): boolean {
  const status = workflowFor(data, issue.projectKey).statuses.find((item) => item.id === issue.status);
  return status ? status.category === "done" : issue.status === "done";
}

export function canTransition(workflow: Workflow, from: string, to: string): boolean {
  return workflow.transitions.some((transition) => transition.from === from && transition.to === to);
}

export function actorMayTransition(data: TrackerData, issue: Issue, to: string, actorId: string): boolean {
  const transition = workflowFor(data, issue.projectKey).transitions.find((item) => item.from === issue.status && item.to === to);
  if (!transition) {
    return false;
  }
  switch (transition.guard) {
    case "any":
      return true;
    case "assignee":
      return issue.assigneeId === actorId;
    case "admin":
      return membershipFor(data, issue.projectKey, actorId)?.role === "admin";
    default: {
      const exhaustive: never = transition.guard;
      return exhaustive;
    }
  }
}

export function transitionTargets(workflow: Workflow, from: string): WorkflowStatus[] {
  const ids = new Set(workflow.transitions.filter((transition) => transition.from === from).map((transition) => transition.to));
  return workflow.statuses.filter((status) => ids.has(status.id));
}

const STATUS_ID = /^[a-z][a-z0-9_]*$/;

export function addWorkflowStatus(
  data: TrackerData,
  projectKey: string,
  input: { id: string; name: string; category: StatusCategory }
): { data: TrackerData } | { error: string } {
  const id = input.id.trim();
  const name = input.name.trim();
  if (!STATUS_ID.test(id)) {
    return { error: "Status id must be a lowercase slug." };
  }
  if (name.length === 0) {
    return { error: "Status name is required." };
  }
  const workflow = workflowFor(data, projectKey);
  if (workflow.statuses.some((status) => status.id === id)) {
    return { error: "That status already exists." };
  }
  return { data: replaceWorkflow(data, { ...workflow, statuses: [...workflow.statuses, { id, name, category: input.category }] }) };
}

export function removeWorkflowStatus(data: TrackerData, projectKey: string, statusId: string): { data: TrackerData } | { error: string } {
  const workflow = workflowFor(data, projectKey);
  if (workflow.statuses.length <= 1) {
    return { error: "A workflow needs a status." };
  }
  if (data.issues.some((issue) => issue.projectKey === projectKey && issue.status === statusId)) {
    return { error: "Move issues off this status first." };
  }
  return {
    data: replaceWorkflow(data, {
      ...workflow,
      statuses: workflow.statuses.filter((status) => status.id !== statusId),
      transitions: workflow.transitions.filter((transition) => transition.from !== statusId && transition.to !== statusId)
    })
  };
}

export function addWorkflowTransition(
  data: TrackerData,
  projectKey: string,
  input: { from: string; to: string; name: string; guard?: TransitionGuard }
): { data: TrackerData } | { error: string } {
  const name = input.name.trim();
  if (name.length === 0) {
    return { error: "Transition name is required." };
  }
  const workflow = workflowFor(data, projectKey);
  if (!workflow.statuses.some((status) => status.id === input.from) || !workflow.statuses.some((status) => status.id === input.to)) {
    return { error: "Choose two statuses on this workflow." };
  }
  if (input.from === input.to) {
    return { error: "A transition needs two different statuses." };
  }
  if (workflow.transitions.some((transition) => transition.from === input.from && transition.to === input.to)) {
    return { error: "That transition already exists." };
  }
  const transition: WorkflowTransition = {
    id: `${projectKey}-t-${input.from}-${input.to}`,
    from: input.from,
    to: input.to,
    name,
    guard: input.guard ?? "any"
  };
  return { data: replaceWorkflow(data, { ...workflow, transitions: [...workflow.transitions, transition] }) };
}

export function removeWorkflowTransition(data: TrackerData, projectKey: string, transitionId: string): TrackerData {
  const workflow = workflowFor(data, projectKey);
  return replaceWorkflow(data, {
    ...workflow,
    transitions: workflow.transitions.filter((transition) => transition.id !== transitionId)
  });
}

function replaceWorkflow(data: TrackerData, workflow: Workflow): TrackerData {
  const exists = data.workflows.some((item) => item.projectKey === workflow.projectKey);
  return {
    ...data,
    workflows: exists
      ? data.workflows.map((item) => (item.projectKey === workflow.projectKey ? workflow : item))
      : [...data.workflows, workflow]
  };
}
