import type { BadgeVariant } from "@ve/ui";
import type { IssueStatus, IssueType, Priority } from "../domain/issue.types";

export function typeBadgeVariant(type: IssueType): BadgeVariant {
  switch (type) {
    case "bug":
      return "danger";
    case "story":
      return "primary";
    case "epic":
      return "outline";
    case "task":
    case "subtask":
      return "neutral";
    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

export function statusBadgeVariant(status: IssueStatus): BadgeVariant {
  switch (status) {
    case "todo":
      return "neutral";
    case "in_progress":
      return "primary";
    case "in_review":
      return "warning";
    case "done":
      return "success";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}

export function priorityBadgeVariant(priority: Priority): BadgeVariant {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "neutral";
    case "low":
      return "outline";
    default: {
      const exhaustive: never = priority;
      return exhaustive;
    }
  }
}
