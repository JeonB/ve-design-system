import { useState } from "react";
import { Alert, Badge, Button, Card, Field, Input, Select, Stack } from "@ve/ui";
import { Link } from "react-router";
import { filterIssues, issuesByProject, personById } from "../domain/issues";
import {
  ISSUE_STATUSES,
  ISSUE_TYPES,
  isIssueStatus,
  isIssueType,
  type IssueStatus,
  type IssueType
} from "../domain/issue.types";
import { statusLabel, typeLabel } from "../domain/labels";
import { useTracker } from "../domain/tracker-context";
import { filterBar } from "../layout/shell.css";
import { statusBadgeVariant, typeBadgeVariant } from "./issue-badges";

type IssueListProps = {
  projectKey: string;
};

export function IssueList({ projectKey }: IssueListProps) {
  const data = useTracker();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<IssueType | "all">("all");
  const [status, setStatus] = useState<IssueStatus | "all">("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const issues = filterIssues(issuesByProject(data, projectKey), {
    query,
    type,
    status,
    assigneeId
  });

  return (
    <Stack gap="md">
      <div className={filterBar}>
        <Field>
          <Field.Label>Summary</Field.Label>
          <Input name="query" value={query} onChange={(event) => setQuery(event.target.value)} />
        </Field>
        <Field>
          <Field.Label>Type</Field.Label>
          <Select
            name="filter-type"
            value={type}
            onChange={(event) => {
              const next = event.target.value;
              if (next === "all" || isIssueType(next)) {
                setType(next);
              }
            }}
          >
            <option value="all">All types</option>
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
            name="filter-status"
            value={status}
            onChange={(event) => {
              const next = event.target.value;
              if (next === "all" || isIssueStatus(next)) {
                setStatus(next);
              }
            }}
          >
            <option value="all">All statuses</option>
            {ISSUE_STATUSES.map((option) => (
              <option key={option} value={option}>
                {statusLabel(option)}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Field.Label>Assignee</Field.Label>
          <Select name="filter-assignee" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
            <option value="all">Anyone</option>
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {issues.length === 0 ? (
        <Alert title="No issues" variant="neutral">
          Nothing matches this filter.
        </Alert>
      ) : (
        <Stack gap="sm">
          {issues.map((issue) => {
            const assignee = personById(data, issue.assigneeId);
            return (
              <Card key={issue.id} padding="sm">
                <Stack direction="horizontal" gap="sm" align="center" justify="between">
                  <Stack gap="sm">
                    <Stack direction="horizontal" gap="sm" align="center">
                      <Badge size="sm" variant={typeBadgeVariant(issue.type)}>
                        {typeLabel(issue.type)}
                      </Badge>
                      <Badge size="sm" variant={statusBadgeVariant(issue.status)}>
                        {statusLabel(issue.status)}
                      </Badge>
                      <Card.Description>{issue.key}</Card.Description>
                    </Stack>
                    <Card.Title>{issue.summary}</Card.Title>
                    {assignee ? <span>{assignee.name}</span> : null}
                  </Stack>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/p/${projectKey}/issues/${issue.id}`}>Open</Link>
                  </Button>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
