import { Avatar, Badge, Button, Card, Select, Stack } from "@ve/ui";
import { Link } from "react-router";
import { personById } from "../domain/issues";
import type { Issue, TrackerData } from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";
import { priorityBadgeVariant, typeBadgeVariant } from "./issue-badges";

type IssueCardProps = {
  issue: Issue;
  data: TrackerData;
  statuses: Array<{ id: string; name: string }>;
  statusDisabled?: boolean;
  onStatusChange: (issueId: string, status: string) => void;
};

export function IssueCard({ issue, data, statuses, statusDisabled = false, onStatusChange }: IssueCardProps) {
  const assignee = personById(data, issue.assigneeId);

  return (
    <Card
      draggable
      padding="sm"
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", issue.id);
        event.dataTransfer.effectAllowed = "move";
      }}
    >
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
        <Card.Description>
          {issue.key}
          {issue.storyPoints === null ? "" : ` · ${issue.storyPoints} pts`}
          {issue.labels.length > 0 ? ` · ${issue.labels.join(", ")}` : ""}
        </Card.Description>
        <Select
          aria-label={`${issue.key} status`}
          name={`status-${issue.id}`}
          size="sm"
          disabled={statusDisabled}
          value={issue.status}
          onChange={(event) => {
            onStatusChange(issue.id, event.target.value);
          }}
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </Select>
        {assignee ? <Avatar alt={assignee.name} size="sm" /> : null}
      </Stack>
    </Card>
  );
}
