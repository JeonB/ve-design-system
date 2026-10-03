import { useState, type ChangeEvent } from "react";
import {
  Alert,
  Avatar,
  Button,
  Dialog,
  Drawer,
  Field,
  Input,
  Separator,
  Stack,
  Textarea
} from "@ve/ui";
import { Link, useNavigate } from "react-router";
import { formatActivity } from "../domain/activity-text";
import { childIssues, issueById, personById } from "../domain/issues";
import { validateSummary } from "../domain/issue.types";
import { can } from "../domain/permissions";
import { useTracker } from "../domain/tracker-context";
import { transitionTargets, workflowFor } from "../domain/workflow";
import { detail, narrowOnly, sidePanel } from "../layout/shell.css";
import { IssueFields, type IssueFieldValues } from "./issue-fields";

type IssueDetailProps = {
  issueId: string;
};

export function IssueDetail({ issueId }: IssueDetailProps) {
  const data = useTracker();
  const navigate = useNavigate();
  const issue = issueById(data, issueId);
  const [summary, setSummary] = useState(issue?.summary ?? "");
  const [description, setDescription] = useState(issue?.description ?? "");
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [fields, setFields] = useState<IssueFieldValues | null>(
    issue
      ? {
          type: issue.type,
          status: issue.status,
          priority: issue.priority,
          assigneeId: issue.assigneeId,
          labels: issue.labels.join(", "),
          storyPoints: issue.storyPoints === null ? "" : String(issue.storyPoints)
        }
      : null
  );
  const [subtask, setSubtask] = useState("");
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!issue || !fields) {
    return (
      <Alert title="Issue not found" variant="danger">
        <Link to="/">Back to projects</Link>
      </Alert>
    );
  }

  const currentIssue = issue;
  const currentFields = fields;
  const workflow = workflowFor(data, currentIssue.projectKey);
  const currentStatus = workflow.statuses.find((status) => status.id === currentIssue.status);
  const statusOptions = [
    currentStatus ?? { id: currentIssue.status, name: currentIssue.status },
    ...transitionTargets(workflow, currentIssue.status)
  ].filter((status, index, list) => list.findIndex((item) => item.id === status.id) === index);
  const mayEdit = can(data, data.actorId, currentIssue.projectKey, "edit");
  const mayDelete = can(data, data.actorId, currentIssue.projectKey, "delete");
  const mayComment = can(data, data.actorId, currentIssue.projectKey, "comment");
  const mayAttach = can(data, data.actorId, currentIssue.projectKey, "attach");
  const mayCreate = can(data, data.actorId, currentIssue.projectKey, "create");
  const reporter = personById(data, currentIssue.reporterId);

  const save = () => {
    const error = validateSummary(summary);
    if (error) {
      setSummaryError(error);
      return;
    }
    const pointsText = currentFields.storyPoints.trim();
    const points = Number(pointsText);
    data.updateIssue(currentIssue.id, {
      summary,
      description,
      type: currentFields.type,
      status: currentFields.status,
      priority: currentFields.priority,
      assigneeId: currentFields.assigneeId,
      labels: currentFields.labels
        .split(",")
        .map((label) => label.trim())
        .filter((label) => label.length > 0),
      storyPoints: pointsText.length === 0 || !Number.isFinite(points) ? null : points
    });
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }
      data.addAttachment(currentIssue.id, {
        name: file.name,
        mediaType: file.type,
        size: file.size,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const addSubtask = () => {
    const error = validateSummary(subtask);
    if (error) {
      return;
    }
    data.createIssue(currentIssue.projectKey, {
      type: "subtask",
      summary: subtask,
      description: "",
      priority: currentIssue.priority,
      sprintId: currentIssue.sprintId,
      parentId: currentIssue.id
    });
    setSubtask("");
  };

  const submitComment = () => {
    const added = data.addComment(currentIssue.id, comment);
    if (!added) {
      setCommentError("Comment is empty.");
      return;
    }
    setComment("");
    setCommentError(null);
  };

  const fieldPanel = (
    <Stack gap="md">
      <IssueFields
        people={data.people}
        statuses={statusOptions}
        values={currentFields}
        onChange={(patch) => setFields((current) => (current ? { ...current, ...patch } : current))}
      />
      {reporter ? (
        <Stack direction="horizontal" gap="sm" align="center">
          <Avatar alt={reporter.name} size="sm" />
          <span>Reporter · {reporter.name}</span>
        </Stack>
      ) : null}
    </Stack>
  );

  return (
    <Stack gap="md">
      <Stack direction="horizontal" gap="sm" align="center" justify="between">
        <Button asChild size="sm" variant="ghost">
          <Link to={`/p/${currentIssue.projectKey}`}>Back to board</Link>
        </Button>
        <span>{currentIssue.key}</span>
      </Stack>
      <div className={detail}>
        <Stack gap="md">
          <Field invalid={Boolean(summaryError)} required>
            <Field.Label>Summary</Field.Label>
            <Input
              name="summary"
              value={summary}
              onChange={(event) => {
                setSummary(event.target.value);
                setSummaryError(null);
              }}
            />
            {summaryError ? <Field.Error>{summaryError}</Field.Error> : null}
          </Field>
          <Field>
            <Field.Label>Description</Field.Label>
            <Textarea name="description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
          <Stack direction="horizontal" gap="sm">
            <Button disabled={!mayEdit} type="button" onClick={save}>
              Save
            </Button>
            <Button disabled={!mayDelete} type="button" variant="dangerOutline" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
            <span className={narrowOnly}>
              <Button type="button" variant="outline" onClick={() => setFieldsOpen(true)}>
                Fields
              </Button>
            </span>
          </Stack>
          <Separator />
          <Stack gap="sm">
            <strong>Attachments</strong>
            {currentIssue.attachments.length === 0 ? <p>No files.</p> : null}
            {currentIssue.attachments.map((file) => (
              <Stack key={file.id} direction="horizontal" gap="sm" align="center">
                <a download={file.name} href={file.dataUrl}>
                  {file.name}
                </a>
                <span>{file.size} B</span>
                <Button type="button" size="sm" variant="ghost" onClick={() => data.removeAttachment(currentIssue.id, file.id)}>
                  Remove
                </Button>
              </Stack>
            ))}
            <Field>
              <Field.Label>Add file</Field.Label>
              <Input accept="image/*,.txt,.md,.pdf" disabled={!mayAttach} name="attachment" type="file" onChange={onFile} />
            </Field>
          </Stack>
          <Separator />
          <Stack gap="sm">
            <strong>Subtasks</strong>
            {childIssues(data, currentIssue.id).length === 0 ? <p>No subtasks.</p> : null}
            {childIssues(data, currentIssue.id).map((child) => (
              <Link key={child.id} to={`/p/${currentIssue.projectKey}/issues/${child.id}`}>
                {child.key} {child.summary}
              </Link>
            ))}
            <Field>
              <Field.Label>New subtask</Field.Label>
              <Input name="subtask" value={subtask} onChange={(event) => setSubtask(event.target.value)} />
            </Field>
            <Button disabled={!mayCreate} type="button" variant="outline" onClick={addSubtask}>
              Add subtask
            </Button>
          </Stack>
          <Separator />
          <Stack gap="sm">
            <strong>Activity</strong>
            {currentIssue.activity.length === 0 ? <p>No activity yet.</p> : null}
            {currentIssue.activity.map((entry) => (
              <p key={entry.id}>
                {personById(data, entry.actorId)?.name ?? "Someone"} {formatActivity(entry, data.people)}
              </p>
            ))}
          </Stack>
          <Separator />
          <Stack gap="sm">
            <strong>Comments</strong>
            {currentIssue.comments.length === 0 ? <p>No comments yet.</p> : null}
            {currentIssue.comments.map((item) => {
              const author = personById(data, item.authorId);
              return (
                <Stack key={item.id} gap="sm">
                  <Stack direction="horizontal" gap="sm" align="center">
                    <Avatar alt={author?.name ?? "Unknown"} size="sm" />
                    <span>{author?.name ?? "Unknown"}</span>
                  </Stack>
                  <p>{item.body}</p>
                  <Separator />
                </Stack>
              );
            })}
            <Field invalid={Boolean(commentError)}>
              <Field.Label>Comment</Field.Label>
              <Textarea
                name="comment"
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value);
                  setCommentError(null);
                }}
              />
              {commentError ? <Field.Error>{commentError}</Field.Error> : null}
            </Field>
            <Button disabled={!mayComment} type="button" variant="secondary" onClick={submitComment}>
              Add comment
            </Button>
          </Stack>
        </Stack>
        <aside className={sidePanel}>{fieldPanel}</aside>
      </div>
      <Drawer open={fieldsOpen} side="right" onOpenChange={setFieldsOpen}>
        <Drawer.Content>
          <Drawer.Close />
          <Drawer.Header>
            <Drawer.Title>Fields</Drawer.Title>
            <Drawer.Description>{currentIssue.key}</Drawer.Description>
          </Drawer.Header>
          <Drawer.Body>{fieldPanel}</Drawer.Body>
        </Drawer.Content>
      </Drawer>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Content>
          <Dialog.Close />
          <Dialog.Header>
            <Dialog.Title>Delete {currentIssue.key}?</Dialog.Title>
            <Dialog.Description>This removes the issue from the board.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                data.deleteIssue(currentIssue.id);
                navigate(`/p/${currentIssue.projectKey}`);
              }}
            >
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </Stack>
  );
}
