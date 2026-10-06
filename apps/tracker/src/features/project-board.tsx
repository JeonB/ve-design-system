import { useState } from "react";
import { Button, Input, Select } from "@ve/ui";
import { useSearchParams } from "react-router";
import { issuesByProject, matchesQuickFilter, projectByKey } from "../domain/issues";
import { PRIORITIES, type Issue } from "../domain/issue.types";
import { priorityLabel } from "../domain/labels";
import { can } from "../domain/permissions";
import { activeSprint, issuesInSprint } from "../domain/sprints";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import { IssueCard } from "./issue-card";
import {
  board,
  boardCanvas,
  column,
  columnAdd,
  columnCount,
  columnHead,
  lane,
  laneTitle,
  toolbar,
  toolbarGrow
} from "../layout/shell.css";

type ProjectBoardProps = {
  projectKey: string;
};

type GroupBy = "none" | "assignee" | "priority";

function isGroupBy(value: string): value is GroupBy {
  return value === "none" || value === "assignee" || value === "priority";
}

export function ProjectBoard({ projectKey }: ProjectBoardProps) {
  const data = useTracker();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [dropStatus, setDropStatus] = useState<string | null>(null);
  const project = projectByKey(data, projectKey);
  const workflow = workflowFor(data, projectKey);
  const mayTransition = can(data, data.actorId, projectKey, "transition");
  const mayCreate = can(data, data.actorId, projectKey, "create");
  const sprint = activeSprint(data, projectKey);
  const source =
    project?.boardType === "scrum" ? (sprint ? issuesInSprint(data, sprint.id) : []) : issuesByProject(data, projectKey);
  const visible = source.filter((issue) => matchesQuickFilter(issue, query, onlyMine ? data.actorId : null));
  const groups = lanes(visible, groupBy, data.people);

  const openCreate = (statusId: string) => {
    const next = new URLSearchParams(params);
    next.set("create", "1");
    next.set("status", statusId);
    setParams(next);
  };

  return (
    <div className={boardCanvas}>
      <div className={toolbar}>
        <div className={toolbarGrow}>
          <Input
            aria-label="Search work"
            name="board-query"
            placeholder="Search work"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button type="button" variant={onlyMine ? "secondary" : "outline"} onClick={() => setOnlyMine((current) => !current)}>
          Filter
        </Button>
        <Select
          aria-label="Group"
          name="group"
          value={groupBy}
          onChange={(event) => {
            const next = event.target.value;
            if (isGroupBy(next)) {
              setGroupBy(next);
            }
          }}
        >
          <option value="none">Group</option>
          <option value="assignee">Assignee</option>
          <option value="priority">Priority</option>
        </Select>
      </div>
      {project?.boardType === "scrum" && !sprint ? (
        <p>Start a sprint from Backlog to fill this board.</p>
      ) : null}
      {groups.map((group) => (
        <section key={group.id} className={lane}>
          {groupBy === "none" ? null : <h2 className={laneTitle}>{group.label}</h2>}
          <div className={board}>
            {workflow.statuses.map((status) => {
              const columnIssues = group.issues
                .filter((issue) => issue.status === status.id)
                .slice()
                .sort((left, right) => left.rank - right.rank || left.number - right.number);
              return (
                <section
                  key={status.id}
                  className={column}
                  data-drop={dropStatus === `${group.id}:${status.id}` ? "true" : undefined}
                  onDragOver={(event) => {
                    if (!mayTransition) {
                      return;
                    }
                    event.preventDefault();
                    setDropStatus(`${group.id}:${status.id}`);
                  }}
                  onDragLeave={() => setDropStatus((current) => (current === `${group.id}:${status.id}` ? null : current))}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDropStatus(null);
                    const issueId = event.dataTransfer.getData("text/plain");
                    if (issueId.length === 0 || !mayTransition) {
                      return;
                    }
                    data.placeIssue(issueId, status.id, null);
                  }}
                >
                  <header className={columnHead}>
                    <strong>{status.name}</strong>
                    <span className={columnCount}>{columnIssues.length}</span>
                    <button
                      className={columnAdd}
                      disabled={!mayCreate}
                      type="button"
                      aria-label={`Create in ${status.name}`}
                      onClick={() => openCreate(status.id)}
                    >
                      +
                    </button>
                  </header>
                  {columnIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      data={data}
                      draggable={mayTransition}
                      issue={issue}
                      onPlaceBefore={(draggedId) => data.placeIssue(draggedId, status.id, issue.id)}
                    />
                  ))}
                </section>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function lanes(
  issues: Issue[],
  groupBy: GroupBy,
  people: Array<{ id: string; name: string }>
): Array<{ id: string; label: string; issues: Issue[] }> {
  switch (groupBy) {
    case "none":
      return [{ id: "all", label: "", issues }];
    case "assignee": {
      const ids = [...new Set(issues.map((issue) => issue.assigneeId))];
      return ids.map((id) => ({
        id,
        label: people.find((person) => person.id === id)?.name ?? id,
        issues: issues.filter((issue) => issue.assigneeId === id)
      }));
    }
    case "priority":
      return PRIORITIES.filter((priority) => issues.some((issue) => issue.priority === priority)).map((priority) => ({
        id: priority,
        label: priorityLabel(priority),
        issues: issues.filter((issue) => issue.priority === priority)
      }));
    default: {
      const exhaustive: never = groupBy;
      return exhaustive;
    }
  }
}
