import { useState } from "react";
import { Alert, Badge, Field, Input, Stack, Switch } from "@ve/ui";
import { Link } from "react-router";
import { matchesQuickFilter } from "../domain/issues";
import { ISSUE_STATUSES, isIssueStatus, type IssueStatus } from "../domain/issue.types";
import { statusLabel } from "../domain/labels";
import { activeSprint, issuesInSprint } from "../domain/sprints";
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
  const [dropStatus, setDropStatus] = useState<IssueStatus | null>(null);
  const sprint = activeSprint(data, projectKey);
  if (!sprint) {
    return (
      <Alert title="No active sprint" variant="info">
        Start a sprint from the <Link to={`/p/${projectKey}/backlog`}>backlog</Link>.
      </Alert>
    );
  }
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
      {ISSUE_STATUSES.map((status) => {
        const columnIssues = visible.filter((issue) => issue.status === status);
        return (
          <section
            key={status}
            className={column}
            data-drop={dropStatus === status ? "true" : undefined}
            onDragOver={(event) => {
              event.preventDefault();
              setDropStatus(status);
            }}
            onDragLeave={() => setDropStatus((current) => (current === status ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              setDropStatus(null);
              const issueId = event.dataTransfer.getData("text/plain");
              if (!isIssueStatus(status) || issueId.length === 0) {
                return;
              }
              data.updateIssue(issueId, { status });
            }}
          >
            <Stack direction="horizontal" align="center" justify="between">
              <strong>{statusLabel(status)}</strong>
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
