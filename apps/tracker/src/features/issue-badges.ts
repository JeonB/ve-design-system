import type { BadgeVariant } from "@ve/ui";
import type { IssueType, Priority, StatusCategory } from "../domain/issue.types";

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

export function statusBadgeVariant(status: string, category?: StatusCategory): BadgeVariant {
  if (category === "done" || status === "done") {
    return "success";
  }
  if (status === "in_review") {
    return "warning";
  }
  if (category === "in_progress" || status === "in_progress") {
    return "primary";
  }
  if (category === "todo" || status === "todo") {
    return "neutral";
  }
  return "outline";
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
