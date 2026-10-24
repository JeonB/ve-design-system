import { useState } from "react";
import { Link } from "react-router";
import { formatActivity, timeAgo } from "../domain/activity-text";
import { typeLabel } from "../domain/labels";
import { issuesByProject, personById } from "../domain/issues";
import { buildSpaceSummary, filterByAssignees, type ActivityTile } from "../domain/space-summary";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import { Icon, type IconName } from "../layout/icons";
import { PersonMark } from "../layout/marks";
import { EmptyState, PriorityBars, ShareName, ShareTable, StatusDonut } from "./summary-charts";
import {
  avatarStack,
  avatarToggle,
  card,
  cardBody,
  cardNote,
  cardTitle,
  cards,
  column,
  epicDone,
  epicHead,
  epicList,
  epicProgress,
  barTrack,
  filterLegend,
  filterOption,
  filterPanel,
  filterRow,
  link,
  outlineButton,
  recentItem,
  recentList,
  recentMeta,
  recentText,
  scroll,
  tile,
  tileIcon,
  tileNote,
  tileTitle,
  tiles,
  typeTone
} from "./summary.css";

type ProjectSummaryProps = {
  projectKey: string;
};

type TileSpec = {
  icon: IconName;
  label: string;
  note: string;
  tile: ActivityTile;
};

function listHref(projectKey: string, jql: string): string {
  return `/p/${projectKey}/list?jql=${encodeURIComponent(jql)}`;
}

export function ProjectSummary({ projectKey }: ProjectSummaryProps) {
  const data = useTracker();
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const now = new Date().toISOString();
  const workflow = workflowFor(data, projectKey);
  const issues = filterByAssignees(issuesByProject(data, projectKey), assigneeIds);
  const summary = buildSpaceSummary(projectKey, issues, workflow, now);
  const people = [{ id: "", name: "Unassigned" }, ...data.people];

  const toggleAssignee = (id: string) => {
    setAssigneeIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const tileSpecs: TileSpec[] = [
    { icon: "completed", label: "completed", note: "in the last 7 days", tile: summary.activity.completed },
    { icon: "updated", label: "updated", note: "in the last 7 days", tile: summary.activity.updated },
    { icon: "created", label: "created", note: "in the last 7 days", tile: summary.activity.created },
    { icon: "calendar", label: "due soon", note: "in the next 7 days", tile: summary.activity.dueSoon }
  ];

  return (
    <div className={scroll}>
      <div className={column}>
        <div className={filterRow}>
          <div aria-label="Filter by assignee" className={avatarStack} role="group">
            {people.map((person) => (
              <button
                key={person.id || "unassigned"}
                aria-label={`Filter assignees by ${person.name}`}
                aria-pressed={assigneeIds.includes(person.id)}
                className={avatarToggle}
                type="button"
                onClick={() => toggleAssignee(person.id)}
              >
                <PersonMark person={person.id ? personById(data, person.id) : undefined} />
              </button>
            ))}
          </div>
          <button
            aria-controls="summary-filter"
            aria-expanded={filterOpen}
            className={outlineButton}
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
          >
            <Icon name="filter" />
            Filter
          </button>
          {filterOpen ? (
            <fieldset className={filterPanel} id="summary-filter">
              <legend className={filterLegend}>Assignee</legend>
              {people.map((person) => (
                <label key={person.id || "unassigned"} className={filterOption}>
                  <input
                    checked={assigneeIds.includes(person.id)}
                    name="summary-assignee"
                    type="checkbox"
                    value={person.id || "unassigned"}
                    onChange={() => toggleAssignee(person.id)}
                  />
                  {person.name}
                </label>
              ))}
            </fieldset>
          ) : null}
        </div>

        <div className={tiles}>
          {tileSpecs.map((spec) => (
            <Link
              key={spec.label}
              aria-label={`${spec.tile.count} ${spec.label} ${spec.note}`}
              className={tile}
              to={listHref(projectKey, spec.tile.jql)}
            >
              <span className={tileIcon}>
                <Icon name={spec.icon} size={20} />
              </span>
              <span>
                <h4 className={tileTitle}>
                  {spec.tile.count} {spec.label}
                </h4>
                <span className={tileNote}>{spec.note}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className={cards}>
          <section className={card}>
            <h2 className={cardTitle}>Status overview</h2>
            <p className={cardNote}>
              Get a snapshot of the status of your work items.{" "}
              <Link className={link} to={`/p/${projectKey}/list`}>
                View all work items
              </Link>
            </p>
            <div className={cardBody}>
              {summary.total === 0 ? (
                <EmptyState art="activity" title="No work items yet">
                  Create a work item to see its status here.
                </EmptyState>
              ) : (
                <StatusDonut projectKey={projectKey} statuses={summary.statuses} total={summary.total} />
              )}
            </div>
          </section>

          <section className={card}>
            {summary.recent.length === 0 ? (
              <EmptyState art="activity" title="No activity yet">
                Create a few work items and invite some teammates to your space to see your space activity.
              </EmptyState>
            ) : (
              <>
                <h2 className={cardTitle}>Recent activity</h2>
                <p className={cardNote}>Stay up to date with what&apos;s happening across the space.</p>
                <ul className={recentList}>
                  {summary.recent.map((item) => (
                    <li key={`${item.issueId}-${item.entry.id}`} className={recentItem}>
                      <PersonMark person={personById(data, item.entry.actorId)} />
                      <span className={recentText}>
                        <span>
                          {personById(data, item.entry.actorId)?.name ?? item.entry.actorId}{" "}
                          {formatActivity(item.entry, data.people)}{" "}
                          <Link className={link} to={`/p/${projectKey}/issues/${item.issueId}`}>
                            {item.issueKey}: {item.summary}
                          </Link>
                        </span>
                        <span className={recentMeta}>{timeAgo(item.entry.at, now)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Priority breakdown</h2>
            <p className={cardNote}>Get a holistic view of how work is being prioritized.</p>
            <PriorityBars axis={summary.priorityAxis} priorities={summary.priorities} projectKey={projectKey} />
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Types of work</h2>
            <p className={cardNote}>
              Get a breakdown of work items by their types.{" "}
              <Link className={link} to={`/p/${projectKey}/list`}>
                View all items
              </Link>
            </p>
            <ShareTable
              nameHeader="Type"
              projectKey={projectKey}
              renderName={(row) => (
                <>
                  <span className={typeTone[row.id]}>
                    <Icon name={row.id} />
                  </span>
                  <ShareName>{typeLabel(row.id)}</ShareName>
                </>
              )}
              rows={summary.types}
            />
          </section>

          <section className={card}>
            <h2 className={cardTitle}>Team workload</h2>
            <p className={cardNote}>Monitor the capacity of your team.</p>
            {summary.workload.length === 0 ? (
              <EmptyState art="activity" title="No assignees yet">
                Assign work items to see how work is spread across the team.
              </EmptyState>
            ) : (
              <ShareTable
                nameHeader="Assignee"
                projectKey={projectKey}
                renderName={(row) => {
                  const person = row.id ? personById(data, row.id) : undefined;
                  return (
                    <>
                      <PersonMark person={person} />
                      <ShareName>{person?.name ?? "Unassigned"}</ShareName>
                    </>
                  );
                }}
                rows={summary.workload}
              />
            )}
          </section>

          <section className={card}>
            {summary.epics.length === 0 ? (
              <EmptyState art="epic" title="Epic progress">
                Use epics to track larger initiatives in your space.
              </EmptyState>
            ) : (
              <>
                <h2 className={cardTitle}>Epic progress</h2>
                <p className={cardNote}>See how your epics are progressing at a glance.</p>
                <ul className={epicList}>
                  {summary.epics.map((epic) => (
                    <li key={epic.id}>
                      <div className={epicHead}>
                        <Link className={link} to={`/p/${projectKey}/issues/${epic.id}`}>
                          {epic.key} {epic.summary}
                        </Link>
                        <span>{epic.percentDone}% done</span>
                      </div>
                      <svg aria-label={`${epic.done} done, ${epic.inProgress} in progress, ${epic.todo} to do`} height="8" role="img" width="100%">
                        <rect className={barTrack} height="8" rx="4" width="100%" />
                        {epic.total > 0 ? (
                          <>
                            <rect
                              className={epicProgress}
                              height="8"
                              rx="4"
                              width={`${((epic.done + epic.inProgress) / epic.total) * 100}%`}
                            />
                            <rect className={epicDone} height="8" rx="4" width={`${(epic.done / epic.total) * 100}%`} />
                          </>
                        ) : null}
                      </svg>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
