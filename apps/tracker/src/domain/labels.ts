import type { IssueStatus, IssueType, Priority } from "./issue.types";

export function typeLabel(type: IssueType): string {
  switch (type) {
    case "epic":
      return "Epic";
    case "story":
      return "Story";
    case "task":
      return "Task";
    case "bug":
      return "Bug";
    case "feature":
      return "Feature";
    case "subtask":
      return "Subtask";
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

export function statusLabel(status: IssueStatus): string {
  switch (status) {
    case "todo":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "in_review":
      return "In Review";
    case "done":
      return "Done";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function priorityLabel(priority: Priority): string {
  switch (priority) {
    case "highest":
      return "Highest";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    case "lowest":
      return "Lowest";
    default: {
      const exhaustive: never = priority;
      return exhaustive;
    }
  }
}
