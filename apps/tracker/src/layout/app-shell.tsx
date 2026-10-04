import { Avatar, Button, Input, Select, ThemeToggle } from "@ve/ui";
import { useState } from "react";
import { Link, Outlet, useMatch, useNavigate, useSearchParams } from "react-router";
import { personById, projectByKey } from "../domain/issues";
import { activeSprint } from "../domain/sprints";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import { CreateIssueDialog } from "../features/create-issue-dialog";
import {
  frame,
  main,
  page,
  searchForm,
  sideItem,
  sideItemActive,
  sideLabel,
  sidebar,
  spaceMark,
  topActions,
  topbar,
  wordmark
} from "./shell.css";

export function AppShell() {
  const data = useTracker();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const projectMatch = useMatch({ path: "/p/:projectKey", end: false });
  const projectKey = projectMatch?.params.projectKey;
  const project = projectKey ? projectByKey(data, projectKey) : undefined;
  const actor = personById(data, data.actorId);
  const unread = data.notices.filter((notice) => notice.recipientId === data.actorId && !notice.read).length;
  const createOpen = params.get("create") === "1" && Boolean(project);

  const closeCreate = () => {
    const next = new URLSearchParams(params);
    next.delete("create");
    next.delete("status");
    setParams(next, { replace: true });
  };

  const openCreate = () => {
    if (!project) {
      return;
    }
    const next = new URLSearchParams(params);
    next.set("create", "1");
    next.delete("status");
    setParams(next);
  };

  return (
    <div className={page}>
      <header className={topbar}>
        <Link className={wordmark} to={project ? `/p/${project.key}` : "/"}>
          Tracker
        </Link>
        <form
          className={searchForm}
          onSubmit={(event) => {
            event.preventDefault();
            const key = project?.key ?? data.projects[0]?.key;
            if (!key) {
              return;
            }
            navigate(`/p/${key}/list?q=${encodeURIComponent(search.trim())}`);
          }}
        >
          <Input
            aria-label="Search"
            fullWidth
            name="search"
            placeholder="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>
        <div className={topActions}>
          <Button disabled={!project} type="button" onClick={openCreate}>
            Create
          </Button>
          <Button asChild variant="ghost">
            <Link to="/inbox">{unread > 0 ? `Inbox (${unread})` : "Inbox"}</Link>
          </Button>
          {actor ? <Avatar alt={actor.name} size="sm" /> : null}
          <Select
            aria-label="Acting as"
            name="actor"
            value={data.people.some((person) => person.id === data.actorId) ? data.actorId : (data.people[0]?.id ?? "")}
            onChange={(event) => data.setActor(event.target.value)}
          >
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </Select>
          <ThemeToggle />
        </div>
      </header>
      <div className={frame}>
        <aside className={sidebar}>
          <p className={sideLabel}>Spaces</p>
          {data.projects.map((item) => {
            const active = item.key === project?.key;
            return (
              <Link
                key={item.key}
                className={active ? `${sideItem} ${sideItemActive}` : sideItem}
                to={`/p/${item.key}`}
              >
                <span className={spaceMark}>{item.key.slice(0, 1)}</span>
                {item.name}
              </Link>
            );
          })}
          <p className={sideLabel}>You</p>
          <Link className={sideItem} to="/inbox">
            Inbox
          </Link>
          <Link className={sideItem} to="/">
            All spaces
          </Link>
        </aside>
        <main className={main}>
          <Outlet />
        </main>
      </div>
      {project ? (
        <CreateIssueDialog
          hint={createHint(data, project.key, params.get("status"))}
          open={createOpen}
          onOpenChange={(open) => {
            if (!open) {
              closeCreate();
            }
          }}
          onCreate={(input) => {
            const requested = params.get("status");
            const workflow = workflowFor(data, project.key);
            const status = requested && workflow.statuses.some((item) => item.id === requested) ? requested : undefined;
            const sprintId = project.boardType === "scrum" ? (activeSprint(data, project.key)?.id ?? null) : null;
            const issue = data.createIssue(project.key, { ...input, status, sprintId });
            closeCreate();
            if (issue) {
              navigate(`/p/${project.key}/issues/${issue.id}`);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function createHint(
  data: Parameters<typeof workflowFor>[0],
  projectKey: string,
  statusId: string | null
): string {
  if (!statusId) {
    return "New work starts in To Do.";
  }
  const name = workflowFor(data, projectKey).statuses.find((status) => status.id === statusId)?.name;
  return name ? `New work starts in ${name}.` : "New work starts in To Do.";
}
