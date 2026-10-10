import { useEffect, useState, type ChangeEvent } from "react";
import { Alert, Avatar, Button, Dialog, Drawer, Field, Input, Select, Separator, Stack, Textarea } from "@ve/ui";
import { Link, useNavigate } from "react-router";
import { formatActivity } from "../domain/activity-text";
import { canRemoveAttachment, formatAttachmentSize } from "../domain/attachments";
import { childIssues, issueById, issuesByProject, personById } from "../domain/issues";
import { ISSUE_TYPES, LINK_TYPES, PRIORITIES, isIssueType, isLinkType, isPriority, validateSummary, type LinkType } from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";
import { can } from "../domain/permissions";
import { useTracker } from "../domain/tracker-context";
import { actorMayTransition, transitionTargets, workflowFor } from "../domain/workflow";
import {
  activityTabs,
  attachmentPreview,
  chipRow,
  detail,
  dropZone,
  issueBackdrop,
  issueCrumb,
  issueDialog,
  issueOverlay,
  issueTitle,
  issueTop,
  narrowOnly,
  sectionLabel,
  sidePanel
} from "../layout/shell.css";
import type { IssueFieldValues } from "./issue-fields";

type IssueDetailProps = {
  issueId: string;
};

type ActivityTab = "all" | "comments" | "history";

const QUICK_COMMENTS = ["Looks good!", "Need help?", "This is blocked...", "Can you clarify...?"] as const;

function isActivityTab(value: string): value is ActivityTab {
  return value === "all" || value === "comments" || value === "history";
}

export function IssueDetail({ issueId }: IssueDetailProps) {
  const data = useTracker();
  const navigate = useNavigate();
  useEffect(() => {
    data.announce(issueId);
    const timer = window.setInterval(() => data.announce(issueId), 4000);
    return () => window.clearInterval(timer);
  }, [data.announce, issueId]);
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
  const [activityTab, setActivityTab] = useState<ActivityTab>("all");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState("");
  const [linkType, setLinkType] = useState<LinkType>("relates");
  const [linkTarget, setLinkTarget] = useState("");

  if (!issue || !fields) {
    return (
      <Alert title="Issue not found" variant="danger">
        <Link to="/">Back to spaces</Link>
      </Alert>
    );
  }

  const currentIssue = issue;
  const currentFields = fields;
  const workflow = workflowFor(data, currentIssue.projectKey);
  const currentStatus = workflow.statuses.find((status) => status.id === currentIssue.status);
  const statusOptions = [
    currentStatus ?? { id: currentIssue.status, name: currentIssue.status },
    ...transitionTargets(workflow, currentIssue.status).filter((status) => actorMayTransition(data, currentIssue, status.id, data.actorId))
  ].filter((status, index, list) => list.findIndex((item) => item.id === status.id) === index);
  const mayEdit = can(data, data.actorId, currentIssue.projectKey, "edit");
  const mayTransition = can(data, data.actorId, currentIssue.projectKey, "transition");
  const mayDelete = can(data, data.actorId, currentIssue.projectKey, "delete");
  const mayComment = can(data, data.actorId, currentIssue.projectKey, "comment");
  const mayAttach = can(data, data.actorId, currentIssue.projectKey, "attach");
  const mayCreate = can(data, data.actorId, currentIssue.projectKey, "create");
  const viewers = data.presence
    .filter((item) => item.issueId === currentIssue.id && item.actorId !== data.actorId)
    .map((item) => personById(data, item.actorId)?.name ?? item.actorId);
  const reporter = personById(data, currentIssue.reporterId);
  const parent = currentIssue.parentId ? issueById(data, currentIssue.parentId) : undefined;
  const siblings = issuesByProject(data, currentIssue.projectKey).filter((item) => item.id !== currentIssue.id);
  const watching = currentIssue.watchers.includes(data.actorId);

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
      <Field>
        <Field.Label>Assignee</Field.Label>
        <Select
          disabled={!mayEdit}
          name="assignee"
          value={currentFields.assigneeId}
          onChange={(event) => setFields((current) => (current ? { ...current, assigneeId: event.target.value } : current))}
        >
          {data.people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
      </Field>
      <Button
        disabled={!mayEdit}
        type="button"
        variant="link"
        onClick={() => setFields((current) => (current ? { ...current, assigneeId: data.actorId } : current))}
      >
        Assign to me
      </Button>
      <Field>
        <Field.Label>Parent</Field.Label>
        <Select
          disabled={!mayEdit}
          name="parent"
          value={currentIssue.parentId ?? ""}
          onChange={(event) => data.updateIssue(currentIssue.id, { parentId: event.target.value.length === 0 ? null : event.target.value })}
        >
          <option value="">None</option>
          {siblings.map((item) => (
            <option key={item.id} value={item.id}>
              {item.key} {item.summary}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Due date</Field.Label>
        <Input
          disabled={!mayEdit}
          name="due-date"
          type="date"
          value={currentIssue.dueDate ?? ""}
          onChange={(event) => data.updateIssue(currentIssue.id, { dueDate: event.target.value.length === 0 ? null : event.target.value })}
        />
      </Field>
      <Field>
        <Field.Label>Start date</Field.Label>
        <Input
          disabled={!mayEdit}
          name="start-date"
          type="date"
          value={currentIssue.startDate ?? ""}
          onChange={(event) => data.updateIssue(currentIssue.id, { startDate: event.target.value.length === 0 ? null : event.target.value })}
        />
      </Field>
      <Field>
        <Field.Label>Priority</Field.Label>
        <Select
          disabled={!mayEdit}
          name="priority"
          value={currentFields.priority}
          onChange={(event) => {
            const next = event.target.value;
            if (isPriority(next)) {
              setFields((current) => (current ? { ...current, priority: next } : current));
            }
          }}
        >
          {PRIORITIES.map((option) => (
            <option key={option} value={option}>
              {priorityLabel(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Type</Field.Label>
        <Select
          disabled={!mayEdit}
          name="type"
          value={currentFields.type}
          onChange={(event) => {
            const next = event.target.value;
            if (isIssueType(next)) {
              setFields((current) => (current ? { ...current, type: next } : current));
            }
          }}
        >
          {ISSUE_TYPES.map((option) => (
            <option key={option} value={option}>
              {typeLabel(option)}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Field.Label>Labels</Field.Label>
        <Input
          disabled={!mayEdit}
          name="labels"
          value={currentFields.labels}
          onChange={(event) => setFields((current) => (current ? { ...current, labels: event.target.value } : current))}
        />
      </Field>
      <Field>
        <Field.Label>Story points</Field.Label>
        <Input
          disabled={!mayEdit}
          name="story-points"
          value={currentFields.storyPoints}
          onChange={(event) => setFields((current) => (current ? { ...current, storyPoints: event.target.value } : current))}
        />
      </Field>
      <Button disabled={!mayEdit} type="button" onClick={save}>
        Save
      </Button>
      {reporter ? (
        <Stack direction="horizontal" gap="sm" align="center">
          <Avatar alt={reporter.name} size="sm" />
          <span>Reporter · {reporter.name}</span>
        </Stack>
      ) : null}
      <Button disabled={!mayEdit} type="button" variant="outline" onClick={() => data.toggleWatch(currentIssue.id)}>
        {watching ? `Watching · ${currentIssue.watchers.length}` : `Watch · ${currentIssue.watchers.length}`}
      </Button>
    </Stack>
  );

  return (
    <div className={issueOverlay}>
      <button aria-label="Close issue" className={issueBackdrop} type="button" onClick={() => navigate(`/p/${currentIssue.projectKey}`)} />
      <div aria-labelledby="issue-title" className={issueDialog} role="dialog">
        <div className={issueTop}>
          <span className={issueCrumb}>
            {parent ? (
              <Link to={`/p/${currentIssue.projectKey}/issues/${parent.id}`}>{parent.key}</Link>
            ) : (
              "No parent"
            )}{" "}
            / {currentIssue.key}
          </span>
          <Stack direction="horizontal" gap="sm" align="center">
            <Select
              aria-label="Status"
              disabled={!mayTransition}
              name="status"
              value={currentIssue.status}
              onChange={(event) => data.updateIssue(currentIssue.id, { status: event.target.value })}
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </Select>
            <Button type="button" variant="ghost" onClick={() => navigate(`/p/${currentIssue.projectKey}`)}>
              Close
            </Button>
          </Stack>
        </div>
        <Field invalid={Boolean(summaryError)} required>
          <Input
            className={issueTitle}
            id="issue-title"
            name="summary"
            value={summary}
            onBlur={save}
            onChange={(event) => {
              setSummary(event.target.value);
              setSummaryError(null);
            }}
          />
          {summaryError ? <Field.Error>{summaryError}</Field.Error> : null}
        </Field>
        {viewers.length > 0 ? (
          <p>
            {viewers.join(", ")} {viewers.length === 1 ? "is" : "are"} viewing this issue.
          </p>
        ) : null}
        <div className={detail}>
          <Stack gap="md">
            <Field>
              <Field.Label>Description</Field.Label>
              <Textarea name="description" value={description} onBlur={save} onChange={(event) => setDescription(event.target.value)} />
            </Field>
            <Stack gap="sm">
              <h2 className={sectionLabel}>Attachments</h2>
              {currentIssue.attachments.map((file) => (
                <Stack key={file.id} gap="sm">
                  {file.mediaType.startsWith("image/") ? <img alt={file.name} className={attachmentPreview} src={file.dataUrl} /> : null}
                  <Stack direction="horizontal" gap="sm" align="center">
                    <a download={file.name} href={file.dataUrl}>
                      {file.name}
                    </a>
                    <span>{formatAttachmentSize(file.size)}</span>
                    <Button
                      disabled={!canRemoveAttachment(data, currentIssue.id, file.id, data.actorId)}
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => data.removeAttachment(currentIssue.id, file.id)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ))}
              <div className={dropZone}>
                <Field>
                  <Field.Label>Add attachment</Field.Label>
                  <Input accept="image/*,.txt,.md,.pdf" disabled={!mayAttach} name="attachment" type="file" onChange={onFile} />
                </Field>
              </div>
            </Stack>
            <Stack gap="sm">
              <h2 className={sectionLabel}>Subtasks</h2>
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
            <Stack gap="sm">
              <h2 className={sectionLabel}>Linked work items</h2>
              {currentIssue.links.map((link) => {
                const target = issueById(data, link.issueId);
                return (
                  <Stack key={`${link.type}-${link.issueId}`} direction="horizontal" gap="sm" align="center">
                    <span>{link.type}</span>
                    {target ? (
                      <Link to={`/p/${target.projectKey}/issues/${target.id}`}>
                        {target.key} {target.summary}
                      </Link>
                    ) : (
                      <span>{link.issueId}</span>
                    )}
                    <Button disabled={!mayEdit} type="button" size="sm" variant="ghost" onClick={() => data.removeLink(currentIssue.id, link.issueId)}>
                      Remove
                    </Button>
                  </Stack>
                );
              })}
              <Stack direction="horizontal" gap="sm" align="center">
                <Select
                  aria-label="Link type"
                  disabled={!mayEdit}
                  name="link-type"
                  value={linkType}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (isLinkType(next)) {
                      setLinkType(next);
                    }
                  }}
                >
                  {LINK_TYPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <Select
                  aria-label="Linked issue"
                  disabled={!mayEdit}
                  name="link-target"
                  value={linkTarget}
                  onChange={(event) => setLinkTarget(event.target.value)}
                >
                  <option value="">Choose work</option>
                  {siblings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.key}
                    </option>
                  ))}
                </Select>
                <Button
                  disabled={!mayEdit || linkTarget.length === 0}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (data.addLink(currentIssue.id, linkType, linkTarget)) {
                      setLinkTarget("");
                    }
                  }}
                >
                  Link
                </Button>
              </Stack>
            </Stack>
            <Separator />
            <Stack gap="sm">
              <h2 className={sectionLabel}>Activity</h2>
              <div className={activityTabs} role="tablist">
                {(["all", "comments", "history"] as const).map((tab) => (
                  <Button
                    key={tab}
                    aria-selected={activityTab === tab}
                    type="button"
                    variant={activityTab === tab ? "secondary" : "ghost"}
                    onClick={() => {
                      if (isActivityTab(tab)) {
                        setActivityTab(tab);
                      }
                    }}
                  >
                    {tab === "all" ? "All" : tab === "comments" ? "Comments" : "History"}
                  </Button>
                ))}
              </div>
              {activityTab !== "comments"
                ? currentIssue.activity.map((entry) => (
                    <p key={entry.id}>
                      {personById(data, entry.actorId)?.name ?? "Someone"} {formatActivity(entry, data.people)}
                    </p>
                  ))
                : null}
              {activityTab !== "history"
                ? currentIssue.comments.map((item) => {
                    const author = personById(data, item.authorId);
                    const mine = item.authorId === data.actorId;
                    return (
                      <Stack key={item.id} gap="sm">
                        <Stack direction="horizontal" gap="sm" align="center">
                          <Avatar alt={author?.name ?? "Unknown"} size="sm" />
                          <span>{author?.name ?? "Unknown"}</span>
                          {mine && mayComment ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingCommentId(item.id);
                                  setEditingComment(item.body);
                                }}
                              >
                                Edit
                              </Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => data.deleteComment(currentIssue.id, item.id)}>
                                Delete
                              </Button>
                            </>
                          ) : null}
                        </Stack>
                        {editingCommentId === item.id ? (
                          <Field>
                            <Field.Label>Edit comment</Field.Label>
                            <Textarea
                              name={`edit-comment-${item.id}`}
                              value={editingComment}
                              onChange={(event) => setEditingComment(event.target.value)}
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => {
                                if (data.updateComment(currentIssue.id, item.id, editingComment)) {
                                  setEditingCommentId(null);
                                  setEditingComment("");
                                }
                              }}
                            >
                              Save comment
                            </Button>
                          </Field>
                        ) : (
                          <p>{item.body}</p>
                        )}
                      </Stack>
                    );
                  })
                : null}
              <div className={chipRow}>
                {QUICK_COMMENTS.map((text) => (
                  <Button key={text} disabled={!mayComment} type="button" size="sm" variant="outline" onClick={() => setComment(text)}>
                    {text}
                  </Button>
                ))}
              </div>
              <Field invalid={Boolean(commentError)}>
                <Field.Label>Comment</Field.Label>
                <Textarea
                  name="comment"
                  placeholder="Add a comment..."
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
            <Stack direction="horizontal" gap="sm">
              <Button
                disabled={!mayCreate}
                type="button"
                variant="outline"
                onClick={() => {
                  const copy = data.cloneIssue(currentIssue.id);
                  if (copy) {
                    navigate(`/p/${copy.projectKey}/issues/${copy.id}`);
                  }
                }}
              >
                Clone
              </Button>
              <Button disabled={!mayDelete} type="button" variant="dangerOutline" onClick={() => setDeleteOpen(true)}>
                Delete
              </Button>
              <span className={narrowOnly}>
                <Button type="button" variant="outline" onClick={() => setFieldsOpen(true)}>
                  Details
                </Button>
              </span>
            </Stack>
          </Stack>
          <aside className={sidePanel}>{fieldPanel}</aside>
        </div>
      </div>
      <Drawer open={fieldsOpen} side="right" onOpenChange={setFieldsOpen}>
        <Drawer.Content>
          <Drawer.Close />
          <Drawer.Header>
            <Drawer.Title>Details</Drawer.Title>
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
            <Dialog.Description>This removes the work item.</Dialog.Description>
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
    </div>
  );
}
