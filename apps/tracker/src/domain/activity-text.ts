import type { ActivityEntry, Person } from "./issue.types";
import { priorityLabel, statusLabel, typeLabel } from "./labels";
import { isIssueStatus, isIssueType, isPriority } from "./issue.types";

function personName(people: Person[], id: string) {
  return people.find((person) => person.id === id)?.name ?? id;
}

function fieldValue(field: ActivityEntry["field"], value: string, people: Person[]) {
  if (value.length === 0) {
    return "empty";
  }
  switch (field) {
    case "status":
      return isIssueStatus(value) ? statusLabel(value) : value;
    case "type":
      return isIssueType(value) ? typeLabel(value) : value;
    case "priority":
      return isPriority(value) ? priorityLabel(value) : value;
    case "assignee":
      return personName(people, value);
    case "created":
    case "summary":
    case "description":
    case "comment":
    case "sprint":
    case "labels":
    case "points":
    case "parent":
    case "attachment":
    case "due":
    case "start":
    case "link":
      return value;
    default: {
      const exhaustive: never = field;
      return exhaustive;
    }
  }
}

export function formatActivity(entry: ActivityEntry, people: Person[]): string {
  switch (entry.field) {
    case "created":
      return "created this issue";
    case "comment":
      if (entry.from.length === 0) {
        return "commented";
      }
      return entry.to.length === 0 ? "deleted a comment" : "edited a comment";
    case "attachment":
      return entry.to.length === 0 ? `removed ${entry.from}` : `attached ${entry.to}`;
    case "link":
      return entry.to.length === 0 ? `unlinked ${entry.from}` : `linked ${entry.to}`;
    case "summary":
    case "description":
    case "type":
    case "status":
    case "priority":
    case "assignee":
    case "sprint":
    case "labels":
    case "points":
    case "parent":
    case "due":
    case "start":
      return `${entry.field} ${fieldValue(entry.field, entry.from, people)} → ${fieldValue(entry.field, entry.to, people)}`;
    default: {
      const exhaustive: never = entry.field;
      return exhaustive;
    }
  }
}
