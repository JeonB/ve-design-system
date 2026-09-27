import { Alert, Badge, Stack } from "@ve/ui";
import { Link } from "react-router";
import { ISSUE_STATUSES } from "../domain/issue.types";
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
  const sprint = activeSprint(data, projectKey);
  if (!sprint) {
    return (
      <Alert title="No active sprint" variant="info">
        Start a sprint from the <Link to={`/p/${projectKey}/backlog`}>backlog</Link>.
      </Alert>
    );
  }
  const issues = issuesInSprint(data, sprint.id);

  return (
    <Stack gap="sm">
      <p>{sprint.name}</p>
    <div className={board}>
      {ISSUE_STATUSES.map((status) => {
        const columnIssues = issues.filter((issue) => issue.status === status);
        return (
          <section key={status} className={column}>
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
