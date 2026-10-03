import { useState } from "react";
import { Alert, Badge, Field, Input, Stack, Switch } from "@ve/ui";
import { Link } from "react-router";
import { matchesQuickFilter } from "../domain/issues";
import { can } from "../domain/permissions";
import { activeSprint, issuesInSprint } from "../domain/sprints";
import { transitionTargets, workflowFor } from "../domain/workflow";
import { useTracker } from "../domain/tracker-context";
import { board, column } from "../layout/shell.css";
import { IssueCard } from "./issue-card";

type ProjectBoardProps = {
  projectKey: string;
};

export function ProjectBoard({ projectKey }: ProjectBoardProps) {
  const data = useTracker();
  const [query, setQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [dropStatus, setDropStatus] = useState<string | null>(null);
  const sprint = activeSprint(data, projectKey);
  if (!sprint) {
    return (
      <Alert title="No active sprint" variant="info">
        Start a sprint from the <Link to={`/p/${projectKey}/backlog`}>backlog</Link>.
      </Alert>
    );
  }
  const workflow = workflowFor(data, projectKey);
  const mayTransition = can(data, data.actorId, projectKey, "transition");
  const issues = issuesInSprint(data, sprint.id);
  const visible = issues.filter((issue) => matchesQuickFilter(issue, query, onlyMine ? data.actorId : null));

  return (
    <Stack gap="sm">
      <Stack direction="horizontal" align="center" justify="between">
        <p>{sprint.name}</p>
        <Stack direction="horizontal" align="center" gap="sm">
          <Field>
            <Field.Label>Filter</Field.Label>
            <Input name="board-query" value={query} onChange={(event) => setQuery(event.target.value)} />
          </Field>
          <Switch aria-label="Only my issues" checked={onlyMine} onCheckedChange={setOnlyMine} />
        </Stack>
      </Stack>
    <div className={board}>
      {workflow.statuses.map((status) => {
        const columnIssues = visible.filter((issue) => issue.status === status.id);
        return (
          <section
            key={status.id}
            className={column}
            data-drop={dropStatus === status.id ? "true" : undefined}
            onDragOver={(event) => {
              event.preventDefault();
              setDropStatus(status.id);
            }}
            onDragLeave={() => setDropStatus((current) => (current === status.id ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              setDropStatus(null);
              const issueId = event.dataTransfer.getData("text/plain");
              if (issueId.length === 0) {
                return;
              }
              data.updateIssue(issueId, { status: status.id });
            }}
          >
            <Stack direction="horizontal" align="center" justify="between">
              <strong>{status.name}</strong>
              <Badge size="sm">{columnIssues.length}</Badge>
            </Stack>
            {columnIssues.length === 0 ? (
              <p>No issues</p>
            ) : (
              columnIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  data={data}
                  issue={issue}
                  statusDisabled={!mayTransition}
                  statuses={[
                    { id: issue.status, name: workflow.statuses.find((item) => item.id === issue.status)?.name ?? issue.status },
                    ...transitionTargets(workflow, issue.status).map((item) => ({ id: item.id, name: item.name }))
                  ].filter((item, index, list) => list.findIndex((other) => other.id === item.id) === index)}
                  onStatusChange={(issueId, next) => data.updateIssue(issueId, { status: next })}
                />
              ))
            )}
          </section>
        );
      })}
    </div>
    </Stack>
  );
}
