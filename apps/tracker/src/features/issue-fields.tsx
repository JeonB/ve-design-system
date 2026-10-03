import { Field, Input, Select, Stack } from "@ve/ui";
import {
  ISSUE_TYPES,
  PRIORITIES,
  isIssueType,
  isPriority,
  type IssueType,
  type Person,
  type Priority
} from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";

export type IssueFieldValues = {
  type: IssueType;
  status: string;
  priority: Priority;
  assigneeId: string;
  labels: string;
  storyPoints: string;
};

type StatusChoice = {
  id: string;
  name: string;
};

type IssueFieldsProps = {
  values: IssueFieldValues;
  people: Person[];
  statuses: StatusChoice[];
  onChange: (patch: Partial<IssueFieldValues>) => void;
};

export function IssueFields({ values, people, statuses, onChange }: IssueFieldsProps) {
  const statusOptions = statuses.some((status) => status.id === values.status)
    ? statuses
    : [{ id: values.status, name: values.status }, ...statuses];
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
            if (statusOptions.some((status) => status.id === next)) {
              onChange({ status: next });
            }
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
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
        <Field.Label>Labels</Field.Label>
        <Input
          name="labels"
          value={values.labels}
          onChange={(event) => onChange({ labels: event.target.value })}
        />
      </Field>
      <Field>
        <Field.Label>Story points</Field.Label>
        <Input
          inputMode="decimal"
          name="storyPoints"
          value={values.storyPoints}
          onChange={(event) => onChange({ storyPoints: event.target.value })}
        />
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
