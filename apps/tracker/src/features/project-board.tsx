import { Badge, Stack } from "@ve/ui";
import { ISSUE_STATUSES } from "../domain/issue.types";
import { issuesByProject } from "../domain/issues";
import { statusLabel } from "../domain/labels";
import { useTracker } from "../domain/tracker-context";
import { board, column } from "../layout/shell.css";
import { IssueCard } from "./issue-card";

type ProjectBoardProps = {
  projectKey: string;
};

export function ProjectBoard({ projectKey }: ProjectBoardProps) {
  const data = useTracker();
  const issues = issuesByProject(data, projectKey);

  return (
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
  );
}
