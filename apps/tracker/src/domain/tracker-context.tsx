import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "@ve/ui";
import { addComment, appendIssue, deleteIssue, updateIssue } from "./issues";
import type { CreateIssueInput, Issue, IssuePatch, TrackerData } from "./issue.types";
import { CURRENT_ACTOR_ID, seedTracker } from "./seed";
import { statusLabel } from "./labels";

type TrackerContextValue = TrackerData & {
  actorId: string;
  createIssue: (projectKey: string, input: CreateIssueInput) => Issue;
  updateIssue: (issueId: string, patch: IssuePatch) => void;
  deleteIssue: (issueId: string) => void;
  addComment: (issueId: string, body: string) => boolean;
};

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(seedTracker);
  const dataRef = useRef(data);
  const { toast } = useToast();

  const commit = useCallback((next: TrackerData) => {
    dataRef.current = next;
    setData(next);
  }, []);

  const createIssue = useCallback(
    (projectKey: string, input: CreateIssueInput) => {
      const result = appendIssue(dataRef.current, projectKey, input, new Date().toISOString(), CURRENT_ACTOR_ID);
      commit(result.data);
      toast({ title: `${result.issue.key} created`, variant: "success" });
      return result.issue;
    },
    [commit, toast]
  );

  const update = useCallback(
    (issueId: string, patch: IssuePatch) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      commit(updateIssue(dataRef.current, issueId, patch, new Date().toISOString()));
      const statusOnly = Object.keys(patch).length === 1 && patch.status !== undefined;
      if (statusOnly && current && patch.status && patch.status !== current.status) {
        toast({ title: `${current.key} moved to ${statusLabel(patch.status)}`, variant: "success" });
        return;
      }
      toast({ title: "Saved", variant: "success" });
    },
    [commit, toast]
  );

  const remove = useCallback(
    (issueId: string) => {
      const current = dataRef.current.issues.find((issue) => issue.id === issueId);
      commit(deleteIssue(dataRef.current, issueId));
      toast({ title: current ? `${current.key} deleted` : "Issue deleted", variant: "neutral" });
    },
    [commit, toast]
  );

  const comment = useCallback(
    (issueId: string, body: string) => {
      if (body.trim().length === 0) {
        return false;
      }
      commit(addComment(dataRef.current, issueId, body, CURRENT_ACTOR_ID, new Date().toISOString()));
      toast({ title: "Comment added", variant: "success" });
      return true;
    },
    [commit, toast]
  );

  const value = useMemo(
    () => ({
      ...data,
      actorId: CURRENT_ACTOR_ID,
      createIssue,
      updateIssue: update,
      deleteIssue: remove,
      addComment: comment
    }),
    [comment, createIssue, data, remove, update]
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
