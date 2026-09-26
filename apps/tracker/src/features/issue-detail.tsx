import { useState } from "react";
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
import { issueById, personById } from "../domain/issues";
import { validateSummary } from "../domain/issue.types";
import { useTracker } from "../domain/tracker-context";
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
          assigneeId: issue.assigneeId
        }
      : null
  );
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
  const reporter = personById(data, currentIssue.reporterId);

  const save = () => {
    const error = validateSummary(summary);
    if (error) {
      setSummaryError(error);
      return;
    }
    data.updateIssue(currentIssue.id, {
      summary,
      description,
      type: currentFields.type,
      status: currentFields.status,
      priority: currentFields.priority,
      assigneeId: currentFields.assigneeId
    });
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
            <Button type="button" onClick={save}>
              Save
            </Button>
            <Button type="button" variant="dangerOutline" onClick={() => setDeleteOpen(true)}>
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
            <Button type="button" variant="secondary" onClick={submitComment}>
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
