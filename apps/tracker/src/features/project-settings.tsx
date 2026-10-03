import { useState } from "react";
import { Button, Card, Field, Input, Select, Stack } from "@ve/ui";
import { PROJECT_ROLES, STATUS_CATEGORIES, type StatusCategory } from "../domain/issue.types";
import { can, isProjectRole } from "../domain/permissions";
import { isStatusCategory } from "../domain/workflow";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";

type ProjectSettingsProps = {
  projectKey: string;
};

export function ProjectSettings({ projectKey }: ProjectSettingsProps) {
  const data = useTracker();
  const workflow = workflowFor(data, projectKey);
  const manage = can(data, data.actorId, projectKey, "manage");
  const [statusId, setStatusId] = useState("");
  const [statusLabel, setStatusLabel] = useState("");
  const [category, setCategory] = useState<StatusCategory>("todo");
  const [from, setFrom] = useState(workflow.statuses[0]?.id ?? "");
  const [to, setTo] = useState(workflow.statuses[1]?.id ?? workflow.statuses[0]?.id ?? "");
  const [transitionName, setTransitionName] = useState("");

  return (
    <Stack gap="md">
      <Card>
        <Card.Header>
          <Card.Title>Roles</Card.Title>
          <Card.Description>Viewers can read. Members can edit. Admins can delete, run sprints, and change this workflow.</Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="sm">
            {data.people.map((person) => {
              const role = data.memberships.find((item) => item.projectKey === projectKey && item.personId === person.id)?.role ?? "viewer";
              return (
                <Field key={person.id}>
                  <Field.Label>{person.name}</Field.Label>
                  <Select
                    disabled={!manage}
                    name={`role-${person.id}`}
                    value={role}
                    onChange={(event) => {
                      const next = event.target.value;
                      if (isProjectRole(next)) {
                        data.setMembership(projectKey, person.id, next);
                      }
                    }}
                  >
                    {PROJECT_ROLES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Field>
              );
            })}
          </Stack>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Statuses</Card.Title>
        </Card.Header>
        <Card.Body>
          <Stack gap="sm">
            {workflow.statuses.map((status) => (
              <Stack key={status.id} direction="horizontal" align="center" justify="between">
                <span>
                  {status.name} · {status.category}
                </span>
                <Button disabled={!manage} type="button" size="sm" variant="ghost" onClick={() => data.removeWorkflowStatus(projectKey, status.id)}>
                  Remove
                </Button>
              </Stack>
            ))}
            <Field>
              <Field.Label>Status id</Field.Label>
              <Input disabled={!manage} name="status-id" value={statusId} onChange={(event) => setStatusId(event.target.value)} />
            </Field>
            <Field>
              <Field.Label>Status name</Field.Label>
              <Input disabled={!manage} name="status-name" value={statusLabel} onChange={(event) => setStatusLabel(event.target.value)} />
            </Field>
            <Field>
              <Field.Label>Category</Field.Label>
              <Select
                disabled={!manage}
                name="status-category"
                value={category}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isStatusCategory(next)) {
                    setCategory(next);
                  }
                }}
              >
                {STATUS_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              disabled={!manage}
              type="button"
              onClick={() => {
                const added = data.addWorkflowStatus(projectKey, { id: statusId, name: statusLabel, category });
                if (added) {
                  setStatusId("");
                  setStatusLabel("");
                }
              }}
            >
              Add status
            </Button>
          </Stack>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Transitions</Card.Title>
          <Card.Description>The board only moves an issue along these arrows.</Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="sm">
            {workflow.transitions.map((transition) => (
              <Stack key={transition.id} direction="horizontal" align="center" justify="between">
                <span>
                  {transition.name}: {transition.from} → {transition.to}
                </span>
                <Button disabled={!manage} type="button" size="sm" variant="ghost" onClick={() => data.removeWorkflowTransition(projectKey, transition.id)}>
                  Remove
                </Button>
              </Stack>
            ))}
            <Field>
              <Field.Label>From</Field.Label>
              <Select disabled={!manage} name="transition-from" value={from} onChange={(event) => setFrom(event.target.value)}>
                {workflow.statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Field.Label>To</Field.Label>
              <Select disabled={!manage} name="transition-to" value={to} onChange={(event) => setTo(event.target.value)}>
                {workflow.statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field>
              <Field.Label>Transition name</Field.Label>
              <Input disabled={!manage} name="transition-name" value={transitionName} onChange={(event) => setTransitionName(event.target.value)} />
            </Field>
            <Button
              disabled={!manage}
              type="button"
              onClick={() => {
                const added = data.addWorkflowTransition(projectKey, { from, to, name: transitionName });
                if (added) {
                  setTransitionName("");
                }
              }}
            >
              Add transition
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    </Stack>
  );
}
