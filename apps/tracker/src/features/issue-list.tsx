import { useEffect, useState } from "react";
import { Alert, Avatar, Button, Field, Input, Select, Stack } from "@ve/ui";
import { Link, useSearchParams } from "react-router";
import { filterIssues, issuesByProject } from "../domain/issues";
import { evaluateJql } from "../domain/jql";
import { ISSUE_TYPES, PRIORITIES, isIssueType, type Issue, type IssueType, type SavedFilter } from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";
import { workflowFor } from "../domain/workflow";
import { useTracker } from "../domain/tracker-context";
import {
  emptyState,
  emptyTitle,
  filterPanel,
  groupHead,
  listFooter,
  listPage,
  tableWrap,
  toolbar,
  toolbarGrow,
  typeMark,
  workCell,
  workKey,
  workTable
} from "../layout/shell.css";

type IssueListProps = {
  projectKey: string;
};

type GroupBy = "none" | "assignee" | "priority";

const TYPE_MARK: Record<IssueType, string> = {
  epic: "E",
  story: "S",
  task: "T",
  bug: "B",
  subtask: "s"
};

function isGroupBy(value: string): value is GroupBy {
  return value === "none" || value === "assignee" || value === "priority";
}

function day(value: string | null): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

export function IssueList({ projectKey }: IssueListProps) {
  const data = useTracker();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [type, setType] = useState<IssueType | "all">("all");
  const [status, setStatus] = useState("all");
  const [assigneeId, setAssigneeId] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [jql, setJql] = useState("");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [selected, setSelected] = useState<string[]>([]);
  const workflow = workflowFor(data, projectKey);
  const saved = data.savedFilters.filter((filter) => filter.projectKey === projectKey);
  const queryFromUrl = params.get("q") ?? "";

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  const jqlText = jql.trim();
  const jqlResult = jqlText.length === 0 ? null : evaluateJql(data, jqlText, data.actorId);
  const jqlError = jqlResult && "error" in jqlResult ? jqlResult.error : null;
  const issues =
    jqlResult && !("error" in jqlResult)
      ? jqlResult.issues.filter((issue) => issue.projectKey === projectKey)
      : jqlError
        ? []
        : filterIssues(issuesByProject(data, projectKey), { query, type, status, assigneeId });

  const applyFilter = (filter: SavedFilter) => {
    setQuery(filter.query);
    setType(filter.type);
    setStatus(filter.status);
    setAssigneeId(filter.assigneeId);
    setJql(filter.jql);
    setFiltersOpen(true);
  };

  const storeFilter = () => {
    const savedFilter = data.saveFilter({ projectKey, name: filterName, query, type, status, assigneeId, jql });
    if (savedFilter) {
      setFilterName("");
    }
  };

  const toggle = (issueId: string) => {
    setSelected((current) => (current.includes(issueId) ? current.filter((id) => id !== issueId) : [...current, issueId]));
  };

  const groups = groupIssues(issues, groupBy, data.people);

  return (
    <div className={listPage}>
      <div className={toolbar}>
        <div className={toolbarGrow}>
          <Input
            aria-label="Search work"
            name="query"
            placeholder="Search work"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button type="button" variant={filtersOpen ? "secondary" : "outline"} onClick={() => setFiltersOpen((open) => !open)}>
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
        {selected.length > 0 ? (
          <>
            <span>{selected.length} selected</span>
            <Select
              aria-label="Set assignee"
              name="bulk-assignee"
              value=""
              onChange={(event) => {
                const assigneeId = event.target.value;
                if (assigneeId.length === 0) {
                  return;
                }
                if (data.bulkUpdate(selected, { assigneeId })) {
                  setSelected([]);
                }
              }}
            >
              <option value="">Assignee</option>
              {data.people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Set status"
              name="bulk-status"
              value=""
              onChange={(event) => {
                const nextStatus = event.target.value;
                if (nextStatus.length === 0) {
                  return;
                }
                if (data.bulkUpdate(selected, { status: nextStatus })) {
                  setSelected([]);
                }
              }}
            >
              <option value="">Status</option>
              {workflow.statuses.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </>
        ) : null}
      </div>
      {filtersOpen ? (
        <div className={filterPanel}>
          <Field>
            <Field.Label>Type</Field.Label>
            <Select
              name="filter-type"
              value={type}
              onChange={(event) => {
                const next = event.target.value;
                if (next === "all" || isIssueType(next)) {
                  setType(next);
                }
              }}
            >
              <option value="all">All types</option>
              {ISSUE_TYPES.map((option) => (
                <option key={option} value={option}>
                  {typeLabel(option)}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Field.Label>Status</Field.Label>
            <Select name="filter-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              {workflow.statuses.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Field.Label>Assignee</Field.Label>
            <Select name="filter-assignee" value={assigneeId} onChange={(event) => setAssigneeId(event.target.value)}>
              <option value="all">Anyone</option>
              {data.people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field>
            <Field.Label>JQL</Field.Label>
            <Input
              name="jql"
              placeholder="status = in_progress AND assignee = currentUser()"
              value={jql}
              onChange={(event) => setJql(event.target.value)}
            />
          </Field>
          <Field>
            <Field.Label>Save filter</Field.Label>
            <Input name="filter-name" value={filterName} onChange={(event) => setFilterName(event.target.value)} />
          </Field>
          <Stack direction="horizontal" gap="sm" align="center">
            <Button type="button" variant="outline" onClick={storeFilter}>
              Save
            </Button>
            {saved.map((filter) => (
              <Stack key={filter.id} direction="horizontal" gap="sm" align="center">
                <Button type="button" size="sm" variant="secondary" onClick={() => applyFilter(filter)}>
                  {filter.name}
                </Button>
                <Button type="button" size="sm" variant="ghost" aria-label={`Delete ${filter.name}`} onClick={() => data.deleteFilter(filter.id)}>
                  Delete
                </Button>
              </Stack>
            ))}
          </Stack>
        </div>
      ) : null}
      {jqlError ? (
        <Alert title="JQL" variant="danger">
          {jqlError}
        </Alert>
      ) : null}
      {issues.length === 0 ? (
        <div className={emptyState}>
          <h2 className={emptyTitle}>There are no work items here yet</h2>
          <p>You either don't have any work items or your existing ones don't match the current filters.</p>
        </div>
      ) : (
        <div className={tableWrap}>
          <table className={workTable}>
            <thead>
              <tr>
                <th>
                  <input
                    aria-label="Select all work"
                    checked={selected.length === issues.length}
                    name="select-all"
                    type="checkbox"
                    onChange={(event) => setSelected(event.target.checked ? issues.map((issue) => issue.id) : [])}
                  />
                </th>
                <th>Work</th>
                <th>Assignee</th>
                <th>Reporter</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Resolution</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <GroupRows
                  key={group.id}
                  group={group}
                  people={data.people}
                  projectKey={projectKey}
                  selected={selected}
                  showHeading={groupBy !== "none"}
                  workflow={workflow}
                  onToggle={toggle}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={listFooter}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const next = new URLSearchParams(params);
            next.set("create", "1");
            next.delete("status");
            setParams(next);
          }}
        >
          + Create
        </Button>
      </div>
    </div>
  );
}

function GroupRows({
  group,
  showHeading,
  projectKey,
  people,
  workflow,
  selected,
  onToggle
}: {
  group: { id: string; label: string; issues: Issue[] };
  showHeading: boolean;
  projectKey: string;
  people: Array<{ id: string; name: string }>;
  workflow: ReturnType<typeof workflowFor>;
  selected: string[];
  onToggle: (issueId: string) => void;
}) {
  return (
    <>
      {showHeading ? (
        <tr>
          <td className={groupHead} colSpan={10}>
            {group.label}
          </td>
        </tr>
      ) : null}
      {group.issues.map((issue) => {
        const assignee = people.find((person) => person.id === issue.assigneeId);
        const reporter = people.find((person) => person.id === issue.reporterId);
        const category = workflow.statuses.find((item) => item.id === issue.status)?.category;
        return (
          <tr key={issue.id}>
            <td>
              <input
                aria-label={`Select ${issue.key}`}
                checked={selected.includes(issue.id)}
                name={`select-${issue.id}`}
                type="checkbox"
                onChange={() => onToggle(issue.id)}
              />
            </td>
            <td>
              <Link className={workCell} to={`/p/${projectKey}/issues/${issue.id}`}>
                <span className={typeMark} data-type={issue.type}>
                  {TYPE_MARK[issue.type]}
                </span>
                <span className={workKey}>{issue.key}</span>
                <span>{issue.summary}</span>
              </Link>
            </td>
            <td>{assignee ? <Avatar alt={assignee.name} size="sm" /> : null}</td>
            <td>{reporter?.name ?? ""}</td>
            <td>{priorityLabel(issue.priority)}</td>
            <td>{workflow.statuses.find((item) => item.id === issue.status)?.name ?? issue.status}</td>
            <td>{category === "done" ? "Done" : "Unresolved"}</td>
            <td>{day(issue.createdAt)}</td>
            <td>{day(issue.updatedAt)}</td>
            <td>{day(issue.dueDate)}</td>
          </tr>
        );
      })}
    </>
  );
}

function groupIssues(
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
