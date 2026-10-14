import { Link } from "react-router";
import type { Person } from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";
import { issuesByProject } from "../domain/issues";
import { buildSpaceSummary } from "../domain/space-summary";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import {
  padded,
  summaryCard,
  summaryGrid,
  summaryLink,
  summaryList,
  summaryRow,
  summarySplit,
  summaryStack
} from "../layout/shell.css";

type ProjectSummaryProps = {
  projectKey: string;
};

function personName(people: Person[], assigneeId: string): string {
  if (assigneeId.length === 0) {
    return "Unassigned";
  }
  return people.find((person) => person.id === assigneeId)?.name ?? assigneeId;
}

export function ProjectSummary({ projectKey }: ProjectSummaryProps) {
  const data = useTracker();
  const issues = issuesByProject(data, projectKey);
  const workflow = workflowFor(data, projectKey);
  const summary = buildSpaceSummary(issues, workflow, new Date().toISOString());
  const listHref = `/p/${projectKey}/list`;

  return (
    <div className={`${padded} ${summaryStack}`}>
      <div className={summaryGrid}>
        <section className={summaryCard}>
          <h2>Completed</h2>
          <strong>{summary.activity.completed}</strong>
          <span>in the last 7 days</span>
        </section>
        <section className={summaryCard}>
          <h2>Updated</h2>
          <strong>{summary.activity.updated}</strong>
          <span>in the last 7 days</span>
        </section>
        <section className={summaryCard}>
          <h2>Created</h2>
          <strong>{summary.activity.created}</strong>
          <span>in the last 7 days</span>
        </section>
        <section className={summaryCard}>
          <h2>Due soon</h2>
          <strong>{summary.activity.dueSoon}</strong>
          <span>in the next 7 days</span>
        </section>
      </div>

      <section className={summaryCard}>
        <h2>Status overview</h2>
        <Link className={summaryLink} to={listHref}>
          View all work items
        </Link>
        <ul className={summaryList}>
          <li className={summaryRow}>
            <span>Total</span>
            <strong>{summary.total}</strong>
          </li>
          {summary.statuses.map((status) => (
            <li key={status.id} className={summaryRow}>
              <span>{status.name}</span>
              <strong>{status.count}</strong>
            </li>
          ))}
        </ul>
      </section>

      <div className={summarySplit}>
        <section className={summaryCard}>
          <h2>Priority breakdown</h2>
          <ul className={summaryList}>
            {summary.priorities.map((item) => (
              <li key={item.id} className={summaryRow}>
                <span>{priorityLabel(item.id)}</span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </section>
        <section className={summaryCard}>
          <h2>Types of work</h2>
          <ul className={summaryList}>
            {summary.types.map((item) => (
              <li key={item.id} className={summaryRow}>
                <span>{typeLabel(item.id)}</span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={summaryCard}>
        <h2>Team workload</h2>
        <ul className={summaryList}>
          {summary.workload.map((item) => (
            <li key={item.assigneeId || "unassigned"} className={summaryRow}>
              <span>{personName(data.people, item.assigneeId)}</span>
              <strong>{item.count}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className={summaryCard}>
        <h2>Epic progress</h2>
        {summary.epics.length === 0 ? <p>No epics yet.</p> : null}
        <ul className={summaryList}>
          {summary.epics.map((epic) => (
            <li key={epic.id} className={summaryRow}>
              <span>
                {epic.key} {epic.summary}
              </span>
              <strong>
                {epic.done}/{epic.total}
              </strong>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
