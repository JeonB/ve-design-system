import { Field, Select, Stack } from "@ve/ui";
import {
  ISSUE_STATUSES,
  ISSUE_TYPES,
  PRIORITIES,
  isIssueStatus,
  isIssueType,
  isPriority,
  type IssueStatus,
  type IssueType,
  type Person,
  type Priority
} from "../domain/issue.types";
import { priorityLabel, statusLabel, typeLabel } from "../domain/labels";

export type IssueFieldValues = {
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  assigneeId: string;
};

type IssueFieldsProps = {
  values: IssueFieldValues;
  people: Person[];
  onChange: (patch: Partial<IssueFieldValues>) => void;
};

export function IssueFields({ values, people, onChange }: IssueFieldsProps) {
  return (
    <Stack gap="md">
      <Field>
        <Field.Label>Type</Field.Label>
        <Select
          name="type"
          value={values.type}
          onChange={(event) => {
            const next = event.target.value;
            if (isIssueType(next)) {
              onChange({ type: next });
            }
          }}
        >
          {ISSUE_TYPES.map((option) => (
            <option key={option} value={option}>
              {typeLabel(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Status</Field.Label>
        <Select
          name="status"
          value={values.status}
          onChange={(event) => {
            const next = event.target.value;
            if (isIssueStatus(next)) {
              onChange({ status: next });
            }
          }}
        >
          {ISSUE_STATUSES.map((option) => (
            <option key={option} value={option}>
              {statusLabel(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Priority</Field.Label>
        <Select
          name="priority"
          value={values.priority}
          onChange={(event) => {
            const next = event.target.value;
            if (isPriority(next)) {
              onChange({ priority: next });
            }
          }}
        >
          {PRIORITIES.map((option) => (
            <option key={option} value={option}>
              {priorityLabel(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Assignee</Field.Label>
        <Select name="assignee" value={values.assigneeId} onChange={(event) => onChange({ assigneeId: event.target.value })}>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
      </Field>
    </Stack>
  );
}
