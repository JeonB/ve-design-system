import { useState } from "react";
import { Badge, Button, Card, Dialog, Field, Input, Select, Stack } from "@ve/ui";
import { Link } from "react-router";
import { validateSummary } from "../domain/issue.types";
import { typeLabel } from "../domain/labels";
import { backlogIssues, issuesInSprint, sprintsByProject } from "../domain/sprints";
import { useTracker } from "../domain/tracker-context";
import { typeBadgeVariant } from "./issue-badges";

type ProjectBacklogProps = {
  projectKey: string;
};

export function ProjectBacklog({ projectKey }: ProjectBacklogProps) {
  const data = useTracker();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const sprints = sprintsByProject(data, projectKey).filter((sprint) => sprint.state !== "closed");
  const closed = sprintsByProject(data, projectKey).filter((sprint) => sprint.state === "closed");

  function create() {
    const error = validateSummary(name);
    if (error) {
      setNameError("Sprint name is required.");
      return;
    }
    const created = data.createSprint(projectKey, name);
    if (created) {
      setOpen(false);
      setName("");
      setNameError(null);
    }
  }

  return (
    <Stack gap="md">
      <Stack direction="horizontal" justify="between" align="center">
        <strong>Backlog</strong>
        <Button type="button" onClick={() => setOpen(true)}>
          Create sprint
        </Button>
      </Stack>
      {sprints.map((sprint) => {
        const issues = issuesInSprint(data, sprint.id);
        return (
          <Card key={sprint.id}>
            <Card.Header>
              <Stack direction="horizontal" justify="between" align="center">
                <Card.Title>
                  {sprint.name}{" "}
                  <Badge size="sm" variant={sprint.state === "active" ? "primary" : "neutral"}>
                    {sprint.state}
                  </Badge>
                </Card.Title>
                {sprint.state === "future" ? (
                  <Button type="button" size="sm" onClick={() => data.startSprint(sprint.id)}>
                    Start sprint
                  </Button>
                ) : (
                  <Button type="button" size="sm" variant="outline" onClick={() => data.completeSprint(sprint.id)}>
                    Complete sprint
                  </Button>
                )}
              </Stack>
              <Card.Description>
                {issues.length} issues
                {sprint.endDate ? ` · ends ${sprint.endDate.slice(0, 10)}` : ""}
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <IssueRows
                issues={issues.map((issue) => issue.id)}
                projectKey={projectKey}
              />
            </Card.Body>
          </Card>
        );
      })}
      <Card>
        <Card.Header>
          <Card.Title>Backlog</Card.Title>
          <Card.Description>{backlogIssues(data, projectKey).length} issues not in a sprint</Card.Description>
        </Card.Header>
        <Card.Body>
          <IssueRows issues={backlogIssues(data, projectKey).map((issue) => issue.id)} projectKey={projectKey} />
        </Card.Body>
      </Card>
      {closed.length > 0 ? <p>{closed.length} closed sprint{closed.length === 1 ? "" : "s"}</p> : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Header>
            <Dialog.Title>Create sprint</Dialog.Title>
            <Dialog.Description>Future sprints stay off the board until you start them.</Dialog.Description>
          </Dialog.Header>
          <Field invalid={Boolean(nameError)} required>
            <Field.Label>Name</Field.Label>
            <Input
              name="sprint-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError(null);
              }}
            />
            {nameError ? <Field.Error>{nameError}</Field.Error> : null}
          </Field>
          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={create}>
              Create
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </Stack>
  );
}

function IssueRows({ issues, projectKey }: { issues: string[]; projectKey: string }) {
  const data = useTracker();
  const destinations = sprintsByProject(data, projectKey).filter((sprint) => sprint.state !== "closed");
  if (issues.length === 0) {
    return <p>No issues</p>;
  }
  return (
    <Stack gap="sm">
      {issues.map((issueId) => {
        const issue = data.issues.find((item) => item.id === issueId);
        if (!issue) {
          return null;
        }
        return (
          <Stack key={issue.id} direction="horizontal" align="center" justify="between" gap="sm">
            <Stack gap="sm">
              <Stack direction="horizontal" gap="sm" align="center">
                <Badge size="sm" variant={typeBadgeVariant(issue.type)}>
                  {typeLabel(issue.type)}
                </Badge>
                <span>{issue.key}</span>
              </Stack>
              <Link to={`/p/${projectKey}/issues/${issue.id}`}>{issue.summary}</Link>
            </Stack>
            <Select
              aria-label={`${issue.key} sprint`}
              name={`sprint-${issue.id}`}
              value={issue.sprintId ?? ""}
              onChange={(event) => {
                const next = event.target.value;
                data.assignSprint(issue.id, next.length === 0 ? null : next);
              }}
            >
              <option value="">Backlog</option>
              {destinations.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </option>
              ))}
            </Select>
          </Stack>
        );
      })}
    </Stack>
  );
}
