import { Avatar, Badge, Button, Card, Select, Stack } from "@ve/ui";
import { Link } from "react-router";
import { personById } from "../domain/issues";
import { isIssueStatus, type Issue, type IssueStatus, type TrackerData } from "../domain/issue.types";
import { priorityLabel, statusLabel, typeLabel } from "../domain/labels";
import { priorityBadgeVariant, typeBadgeVariant } from "./issue-badges";

type IssueCardProps = {
  issue: Issue;
  data: TrackerData;
  onStatusChange: (issueId: string, status: IssueStatus) => void;
};

export function IssueCard({ issue, data, onStatusChange }: IssueCardProps) {
  const assignee = personById(data, issue.assigneeId);

  return (
    <Card padding="sm">
      <Stack gap="sm">
        <Stack direction="horizontal" gap="sm" justify="between" align="center">
          <Badge size="sm" variant={typeBadgeVariant(issue.type)}>
            {typeLabel(issue.type)}
          </Badge>
          <Badge size="sm" variant={priorityBadgeVariant(issue.priority)}>
            {priorityLabel(issue.priority)}
          </Badge>
        </Stack>
        <Card.Title>
          <Button asChild size="sm" variant="link">
            <Link to={`/p/${issue.projectKey}/issues/${issue.id}`}>{issue.summary}</Link>
          </Button>
        </Card.Title>
        <Card.Description>{issue.key}</Card.Description>
        <Select
          aria-label={`${issue.key} status`}
          name={`status-${issue.id}`}
          size="sm"
          value={issue.status}
          onChange={(event) => {
            const next = event.target.value;
            if (!isIssueStatus(next)) {
              return;
            }
            onStatusChange(issue.id, next);
          }}
        >
          {(["backlog", "todo", "in_progress", "in_review", "done"] as const).map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </Select>
        {assignee ? <Avatar alt={assignee.name} size="sm" /> : null}
      </Stack>
    </Card>
  );
}
