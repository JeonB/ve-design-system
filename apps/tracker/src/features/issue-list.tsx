import { useState } from "react";
import { Alert, Badge, Button, Card, Field, Input, Select, Stack } from "@ve/ui";
import { Link } from "react-router";
import { filterIssues, issuesByProject, personById } from "../domain/issues";
import { evaluateJql } from "../domain/jql";
import {
  ISSUE_TYPES,
  isIssueType,
  type IssueType,
  type SavedFilter
} from "../domain/issue.types";
import { typeLabel } from "../domain/labels";
import { statusName, workflowFor } from "../domain/workflow";
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
  const [status, setStatus] = useState("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [jql, setJql] = useState("");
  const workflow = workflowFor(data, projectKey);
  const saved = data.savedFilters.filter((filter) => filter.projectKey === projectKey);
  const jqlText = jql.trim();
  const jqlResult = jqlText.length === 0 ? null : evaluateJql(data, jqlText, data.actorId);
  const jqlError = jqlResult && "error" in jqlResult ? jqlResult.error : null;
  const issues =
    jqlResult && !("error" in jqlResult)
      ? jqlResult.issues.filter((issue) => issue.projectKey === projectKey)
      : jqlError
        ? []
        : filterIssues(issuesByProject(data, projectKey), {
            query,
            type,
            status,
            assigneeId
          });

  const applyFilter = (filter: SavedFilter) => {
    setQuery(filter.query);
    setType(filter.type);
    setStatus(filter.status);
    setAssigneeId(filter.assigneeId);
    setJql(filter.jql);
  };

  const storeFilter = () => {
    const savedFilter = data.saveFilter({
      projectKey,
      name: filterName,
      query,
      type,
      status,
      assigneeId,
      jql
    });
    if (savedFilter) {
      setFilterName("");
    }
  };

  return (
    <Stack gap="md">
      <div className={filterBar}>
        <Field>
          <Field.Label>Search</Field.Label>
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
              setStatus(event.target.value);
            }}
          >
            <option value="all">All statuses</option>
            {workflow.statuses.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
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
      <Field>
        <Field.Label>JQL</Field.Label>
        <Input
          name="jql"
          placeholder='status = "In progress" AND assignee = currentUser()'
          value={jql}
          onChange={(event) => setJql(event.target.value)}
        />
      </Field>
      {jqlError ? (
        <Alert title="JQL" variant="danger">
          {jqlError}
        </Alert>
      ) : null}
      <Stack direction="horizontal" gap="sm" align="center">
        <Field>
          <Field.Label>Save filter</Field.Label>
          <Input name="filter-name" value={filterName} onChange={(event) => setFilterName(event.target.value)} />
        </Field>
        <Button type="button" variant="outline" onClick={storeFilter}>
          Save
        </Button>
        {saved.map((filter) => (
          <Stack key={filter.id} direction="horizontal" gap="sm" align="center">
            <Button type="button" size="sm" variant="secondary" onClick={() => applyFilter(filter)}>
              {filter.name}
            </Button>
            <Button type="button" size="sm" variant="ghost" aria-label={`Delete ${filter.name}`} onClick={() => data.deleteFilter(filter.id)}>
              Delete
            </Button>
          </Stack>
        ))}
      </Stack>
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
                      <Badge size="sm" variant={statusBadgeVariant(issue.status, workflow.statuses.find((item) => item.id === issue.status)?.category)}>
                        {statusName(data, projectKey, issue.status)}
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
