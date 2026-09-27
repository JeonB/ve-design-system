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
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

export function statusLabel(status: IssueStatus): string {
  switch (status) {
    case "todo":
      return "To do";
    case "in_progress":
      return "In progress";
    case "in_review":
      return "In review";
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
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "urgent":
      return "Urgent";
    default: {
      const exhaustive: never = priority;
      return exhaustive;
    }
  }
}
