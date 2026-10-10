import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "@ve/ui";
import { addAttachment, removeAttachment, type AttachmentInput } from "./attachments";
import { deleteFilter, saveFilter, type SaveFilterInput } from "./filters";
import { addComment, addLink, appendIssue, bulkUpdateIssues, cloneIssue, deleteComment, deleteIssue, issueById, placeIssue, removeLink, toggleWatch, updateComment, updateIssue, type BulkIssuePatch } from "./issues";
import { appendNotices, freshPresence, markAllNoticesRead, markNoticeRead, noticesForComment, noticesForUpdate, type Presence } from "./mail";
import { ACTOR_STORAGE_KEY, can, setMembership } from "./permissions";
import { assignSprint, completeSprint, createSprint, startSprint } from "./sprints";
import type { CreateIssueInput, Issue, IssuePatch, LinkType, ProjectAction, ProjectRole, TrackerData } from "./issue.types";
import { CURRENT_ACTOR_ID } from "./seed";
import { TRACKER_STORAGE_KEY, loadTracker, saveTracker } from "./storage";
import { actorMayTransition, addWorkflowStatus, addWorkflowTransition, removeWorkflowStatus, removeWorkflowTransition, statusName, type StatusCategory, type TransitionGuard } from "./workflow";

type TrackerContextValue = TrackerData & {
  actorId: string;
  createIssue: (projectKey: string, input: CreateIssueInput) => Issue | null;
  setActor: (personId: string) => void;
  setMembership: (projectKey: string, personId: string, role: ProjectRole) => boolean;
  addWorkflowStatus: (projectKey: string, input: { id: string; name: string; category: StatusCategory }) => boolean;
  removeWorkflowStatus: (projectKey: string, statusId: string) => boolean;
  addWorkflowTransition: (projectKey: string, input: { from: string; to: string; name: string; guard?: TransitionGuard }) => boolean;
  removeWorkflowTransition: (projectKey: string, transitionId: string) => void;
  updateIssue: (issueId: string, patch: IssuePatch) => void;
  bulkUpdate: (issueIds: string[], patch: BulkIssuePatch) => boolean;
  placeIssue: (issueId: string, status: string, beforeIssueId: string | null) => void;
  deleteIssue: (issueId: string) => void;
  addComment: (issueId: string, body: string) => boolean;
  updateComment: (issueId: string, commentId: string, body: string) => boolean;
  deleteComment: (issueId: string, commentId: string) => boolean;
  cloneIssue: (issueId: string) => Issue | null;
  createSprint: (projectKey: string, name: string) => boolean;
  startSprint: (sprintId: string) => boolean;
  completeSprint: (sprintId: string) => void;
  assignSprint: (issueId: string, sprintId: string | null) => void;
  saveFilter: (input: SaveFilterInput) => boolean;
  deleteFilter: (filterId: string) => void;
  addAttachment: (issueId: string, input: AttachmentInput) => boolean;
  removeAttachment: (issueId: string, attachmentId: string) => void;
  toggleWatch: (issueId: string) => void;
  addLink: (issueId: string, type: LinkType, targetId: string) => boolean;
  removeLink: (issueId: string, targetId: string) => void;
  presence: Presence[];
  announce: (issueId: string) => void;
  markNoticeRead: (noticeId: string) => void;
  markAllNoticesRead: () => void;
};

const TRACKER_CHANNEL = "ve-tracker";

function publish(message: { type: "data" } | { type: "presence"; actorId: string; issueId: string; at: number }) {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }
  const channel = new BroadcastChannel(TRACKER_CHANNEL);
  channel.postMessage(message);
  channel.close();
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(() => loadTracker(window.localStorage));
  const dataRef = useRef(data);
  const [actorId, setActorId] = useState(() => window.sessionStorage.getItem(ACTOR_STORAGE_KEY) ?? CURRENT_ACTOR_ID);
  const actorRef = useRef(actorId);
  const { toast } = useToast();

  const refuse = useCallback(() => {
    toast({ title: "You don't have permission.", variant: "danger" });
  }, [toast]);

  const allowed = useCallback(
    (projectKey: string, action: ProjectAction) => can(dataRef.current, actorRef.current, projectKey, action),
    []
  );

  const [presence, setPresence] = useState<Presence[]>([]);

  const commit = useCallback((next: TrackerData) => {
    dataRef.current = next;
    setData(next);
    saveTracker(window.localStorage, next);
    publish({ type: "data" });
  }, []);

  useEffect(() => {
    const applyRemote = () => {
      const next = loadTracker(window.localStorage);
      dataRef.current = next;
      setData(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === TRACKER_STORAGE_KEY) {
        applyRemote();
      }
    };
    window.addEventListener("storage", onStorage);
    if (typeof BroadcastChannel === "undefined") {
      return () => window.removeEventListener("storage", onStorage);
    }
    const channel = new BroadcastChannel(TRACKER_CHANNEL);
    const onMessage = (event: MessageEvent<{ type?: string; actorId?: string; issueId?: string; at?: number }>) => {
      if (event.data?.type === "data") {
        applyRemote();
        return;
      }
      if (event.data?.type === "presence" && event.data.actorId && event.data.issueId && typeof event.data.at === "number") {
        const next = { actorId: event.data.actorId, issueId: event.data.issueId, at: event.data.at };
        setPresence((current) => freshPresence([...current.filter((item) => item.actorId !== next.actorId), next], Date.now()));
      }
    };
    channel.addEventListener("message", onMessage);
    const timer = window.setInterval(() => {
      setPresence((current) => freshPresence(current, Date.now()));
    }, 5000);
    return () => {
      window.removeEventListener("storage", onStorage);
      channel.removeEventListener("message", onMessage);
      channel.close();
      window.clearInterval(timer);
    };
  }, []);

  const createIssue = useCallback(
    (projectKey: string, input: CreateIssueInput) => {
      if (!allowed(projectKey, "create")) {
        refuse();
        return null;
      }
      const result = appendIssue(dataRef.current, projectKey, input, new Date().toISOString(), actorRef.current);
      commit(result.data);
      toast({ title: `${result.issue.key} created`, variant: "success" });
      return result.issue;
    },
    [allowed, commit, refuse, toast]
  );

  const update = useCallback(
    (issueId: string, patch: IssuePatch) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current) {
        return;
      }
      const statusChanged = patch.status !== undefined && patch.status !== current.status;
      const edits = Object.keys(patch).some((key) => key !== "status");
      if (statusChanged && !allowed(current.projectKey, "transition")) {
        refuse();
        return;
      }
      if (statusChanged && patch.status && !actorMayTransition(dataRef.current, current, patch.status, actorRef.current)) {
        toast({ title: "That transition is not allowed.", variant: "danger" });
        return;
      }
      if (edits && !allowed(current.projectKey, "edit")) {
        refuse();
        return;
      }
      const now = new Date().toISOString();
      const next = updateIssue(dataRef.current, issueId, patch, now, actorRef.current);
      const after = issueById(next, issueId);
      commit(after ? appendNotices(next, noticesForUpdate(next, current, after, actorRef.current, now)) : next);
      if (statusChanged && patch.status && !edits) {
        toast({ title: `${current.key} moved to ${statusName(dataRef.current, current.projectKey, patch.status)}`, variant: "success" });
        return;
      }
      toast({ title: "Saved", variant: "success" });
    },
    [allowed, commit, refuse, toast]
  );

  const bulkUpdate = useCallback(
    (issueIds: string[], patch: BulkIssuePatch) => {
      const sample = dataRef.current.issues.find((issue) => issueIds.includes(issue.id));
      if (!sample) {
        return false;
      }
      const wantsStatus = patch.status !== undefined;
      const wantsAssignee = patch.assigneeId !== undefined;
      if (wantsStatus && !allowed(sample.projectKey, "transition")) {
        refuse();
        return false;
      }
      if (wantsAssignee && !allowed(sample.projectKey, "edit")) {
        refuse();
        return false;
      }
      const now = new Date().toISOString();
      const before = dataRef.current;
      const result = bulkUpdateIssues(before, issueIds, patch, now, actorRef.current);
      let next = result.data;
      for (const issueId of result.updatedIds) {
        const from = issueById(before, issueId);
        const to = issueById(next, issueId);
        if (from && to) {
          next = appendNotices(next, noticesForUpdate(next, from, to, actorRef.current, now));
        }
      }
      commit(next);
      const skipped = result.skippedIds.length;
      if (result.updatedIds.length === 0) {
        toast({ title: "No selected work could be changed.", variant: "danger" });
        return true;
      }
      toast({
        title: skipped > 0 ? `${result.updatedIds.length} updated, ${skipped} skipped` : `${result.updatedIds.length} updated`,
        variant: "success"
      });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const place = useCallback(
    (issueId: string, status: string, beforeIssueId: string | null) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || beforeIssueId === issueId) {
        return;
      }
      const statusChanged = current.status !== status;
      if (statusChanged && !allowed(current.projectKey, "transition")) {
        refuse();
        return;
      }
      if (statusChanged && !actorMayTransition(dataRef.current, current, status, actorRef.current)) {
        toast({ title: "That transition is not allowed.", variant: "danger" });
        return;
      }
      if (!statusChanged && !allowed(current.projectKey, "edit")) {
        refuse();
        return;
      }
      const now = new Date().toISOString();
      const before = dataRef.current;
      const next = placeIssue(before, issueId, status, beforeIssueId, now, actorRef.current);
      const after = issueById(next, issueId);
      commit(after && statusChanged ? appendNotices(next, noticesForUpdate(next, current, after, actorRef.current, now)) : next);
    },
    [allowed, commit, refuse, toast]
  );

  const remove = useCallback(
    (issueId: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || !allowed(current.projectKey, "delete")) {
        refuse();
        return;
      }
      commit(deleteIssue(dataRef.current, issueId));
      toast({ title: current ? `${current.key} deleted` : "Issue deleted", variant: "neutral" });
    },
    [allowed, commit, refuse, toast]
  );

  const comment = useCallback(
    (issueId: string, body: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || !allowed(current.projectKey, "comment")) {
        refuse();
        return false;
      }
      if (body.trim().length === 0) {
        return false;
      }
      const now = new Date().toISOString();
      const next = addComment(dataRef.current, issueId, body, actorRef.current, now);
      const after = issueById(next, issueId);
      commit(after ? appendNotices(next, noticesForComment(next, after, body, actorRef.current, now)) : next);
      toast({ title: "Comment added", variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const editComment = useCallback(
    (issueId: string, commentId: string, body: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || !allowed(current.projectKey, "comment")) {
        refuse();
        return false;
      }
      const result = updateComment(dataRef.current, issueId, commentId, body, actorRef.current, new Date().toISOString());
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: "Comment updated", variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const removeComment = useCallback(
    (issueId: string, commentId: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || !allowed(current.projectKey, "comment")) {
        refuse();
        return false;
      }
      const result = deleteComment(dataRef.current, issueId, commentId, actorRef.current, new Date().toISOString());
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: "Comment removed", variant: "neutral" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const copyIssue = useCallback(
    (issueId: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      if (!current || !allowed(current.projectKey, "create")) {
        refuse();
        return null;
      }
      const result = cloneIssue(dataRef.current, issueId, new Date().toISOString(), actorRef.current);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return null;
      }
      commit(result.data);
      toast({ title: `${result.issue.key} created`, variant: "success" });
      return result.issue;
    },
    [allowed, commit, refuse, toast]
  );

  const addSprint = useCallback(
    (projectKey: string, name: string) => {
      if (!allowed(projectKey, "sprint")) {
        refuse();
        return false;
      }
      const result = createSprint(dataRef.current, projectKey, name);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: `${result.sprint.name} created`, variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const beginSprint = useCallback(
    (sprintId: string) => {
      const sprint = dataRef.current.sprints.find((item) => item.id === sprintId);
      if (!sprint || !allowed(sprint.projectKey, "sprint")) {
        refuse();
        return false;
      }
      const result = startSprint(dataRef.current, sprintId, new Date().toISOString());
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: "Sprint started", variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const finishSprint = useCallback(
    (sprintId: string) => {
      const sprint = dataRef.current.sprints.find((item) => item.id === sprintId);
      if (!sprint || !allowed(sprint.projectKey, "sprint")) {
        refuse();
        return;
      }
      commit(completeSprint(dataRef.current, sprintId, new Date().toISOString(), actorRef.current));
      toast({ title: "Sprint completed", variant: "success" });
    },
    [allowed, commit, refuse, toast]
  );

  const moveToSprint = useCallback(
    (issueId: string, sprintId: string | null) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "edit")) {
        refuse();
        return;
      }
      commit(assignSprint(dataRef.current, issueId, sprintId, new Date().toISOString(), actorRef.current));
      toast({ title: sprintId ? "Added to sprint" : "Moved to backlog", variant: "success" });
    },
    [allowed, commit, refuse, toast]
  );

  const storeFilter = useCallback(
    (input: SaveFilterInput) => {
      const result = saveFilter(dataRef.current, input);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: `${result.filter.name} saved`, variant: "success" });
      return true;
    },
    [commit, toast]
  );

  const removeFilter = useCallback(
    (filterId: string) => {
      commit(deleteFilter(dataRef.current, filterId));
      toast({ title: "Filter removed", variant: "neutral" });
    },
    [commit]
  );

  const attach = useCallback(
    (issueId: string, input: AttachmentInput) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "attach")) {
        refuse();
        return false;
      }
      const result = addAttachment(dataRef.current, issueId, input, new Date().toISOString(), actorRef.current);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: `${result.attachment.name} attached`, variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const detach = useCallback(
    (issueId: string, attachmentId: string) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "attach")) {
        refuse();
        return;
      }
      const result = removeAttachment(dataRef.current, issueId, attachmentId, new Date().toISOString(), actorRef.current);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return;
      }
      commit(result.data);
      toast({ title: "Attachment removed", variant: "neutral" });
    },
    [allowed, commit, refuse, toast]
  );

  const watch = useCallback(
    (issueId: string) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "edit")) {
        refuse();
        return;
      }
      commit(toggleWatch(dataRef.current, issueId, actorRef.current));
    },
    [allowed, commit, refuse]
  );

  const linkIssue = useCallback(
    (issueId: string, type: LinkType, targetId: string) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "edit")) {
        refuse();
        return false;
      }
      const result = addLink(dataRef.current, issueId, type, targetId, new Date().toISOString(), actorRef.current);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const unlinkIssue = useCallback(
    (issueId: string, targetId: string) => {
      const issue = dataRef.current.issues.find((item) => item.id === issueId);
      if (!issue || !allowed(issue.projectKey, "edit")) {
        refuse();
        return;
      }
      commit(removeLink(dataRef.current, issueId, targetId, new Date().toISOString(), actorRef.current));
    },
    [allowed, commit, refuse]
  );

  const chooseActor = useCallback((personId: string) => {
    if (!dataRef.current.people.some((person) => person.id === personId)) {
      return;
    }
    actorRef.current = personId;
    setActorId(personId);
    window.sessionStorage.setItem(ACTOR_STORAGE_KEY, personId);
  }, []);

  const changeMembership = useCallback(
    (projectKey: string, personId: string, role: ProjectRole) => {
      if (!allowed(projectKey, "manage")) {
        refuse();
        return false;
      }
      const result = setMembership(dataRef.current, projectKey, personId, role);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const createStatus = useCallback(
    (projectKey: string, input: { id: string; name: string; category: StatusCategory }) => {
      if (!allowed(projectKey, "manage")) {
        refuse();
        return false;
      }
      const result = addWorkflowStatus(dataRef.current, projectKey, input);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: "Status added", variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const deleteStatus = useCallback(
    (projectKey: string, statusId: string) => {
      if (!allowed(projectKey, "manage")) {
        refuse();
        return false;
      }
      const result = removeWorkflowStatus(dataRef.current, projectKey, statusId);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const createTransition = useCallback(
    (projectKey: string, input: { from: string; to: string; name: string; guard?: TransitionGuard }) => {
      if (!allowed(projectKey, "manage")) {
        refuse();
        return false;
      }
      const result = addWorkflowTransition(dataRef.current, projectKey, input);
      if ("error" in result) {
        toast({ title: result.error, variant: "danger" });
        return false;
      }
      commit(result.data);
      toast({ title: "Transition added", variant: "success" });
      return true;
    },
    [allowed, commit, refuse, toast]
  );

  const deleteTransition = useCallback(
    (projectKey: string, transitionId: string) => {
      if (!allowed(projectKey, "manage")) {
        refuse();
        return;
      }
      commit(removeWorkflowTransition(dataRef.current, projectKey, transitionId));
    },
    [allowed, commit, refuse]
  );

  const announce = useCallback((issueId: string) => {
    publish({ type: "presence", actorId: actorRef.current, issueId, at: Date.now() });
  }, []);

  const readNotice = useCallback(
    (noticeId: string) => {
      commit(markNoticeRead(dataRef.current, noticeId, actorRef.current));
    },
    [commit]
  );

  const readAllNotices = useCallback(() => {
    commit(markAllNoticesRead(dataRef.current, actorRef.current));
  }, [commit]);

  const value = useMemo(
    () => ({
      ...data,
      actorId,
      setActor: chooseActor,
      createIssue,
      updateIssue: update,
      bulkUpdate,
      placeIssue: place,
      deleteIssue: remove,
      addComment: comment,
      updateComment: editComment,
      deleteComment: removeComment,
      cloneIssue: copyIssue,
      createSprint: addSprint,
      startSprint: beginSprint,
      completeSprint: finishSprint,
      assignSprint: moveToSprint,
      saveFilter: storeFilter,
      deleteFilter: removeFilter,
      addAttachment: attach,
      removeAttachment: detach,
      toggleWatch: watch,
      addLink: linkIssue,
      removeLink: unlinkIssue,
      setMembership: changeMembership,
      addWorkflowStatus: createStatus,
      removeWorkflowStatus: deleteStatus,
      addWorkflowTransition: createTransition,
      removeWorkflowTransition: deleteTransition,
      presence,
      announce,
      markNoticeRead: readNotice,
      markAllNoticesRead: readAllNotices
    }),
    [
      actorId,
      announce,
      addSprint,
      attach,
      beginSprint,
      bulkUpdate,
      place,
      changeMembership,
      chooseActor,
      comment,
      copyIssue,
      editComment,
      removeComment,
      createIssue,
      createStatus,
      createTransition,
      data,
      deleteStatus,
      deleteTransition,
      detach,
      finishSprint,
      linkIssue,
      unlinkIssue,
      watch,
      moveToSprint,
      presence,
      readAllNotices,
      readNotice,
      remove,
      removeFilter,
      storeFilter,
      update
    ]
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker(): TrackerContextValue {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker는 TrackerProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
