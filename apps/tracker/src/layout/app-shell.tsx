import { useTheme } from "@ve/ui";
import { useState } from "react";
import { Link, Outlet, useMatch, useNavigate, useSearchParams } from "react-router";
import { personById, projectByKey } from "../domain/issues";
import { activeSprint } from "../domain/sprints";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import { CreateIssueDialog } from "../features/create-issue-dialog";
import { Icon } from "./icons";
import { PersonMark, SpaceMark } from "./marks";
import {
  actorSelect,
  appHome,
  appMark,
  badgeCount,
  createButton,
  iconButton,
  searchBox,
  searchIcon,
  searchInput,
  sideGroup,
  sideList,
  sideNav,
  sideRow,
  sideRowActive,
  sideRowEnd,
  sideRowNested,
  topCenter,
  topEnd,
  topNav,
  topStart
} from "./nav.css";
import { frame, main, page } from "./shell.css";

export function AppShell() {
  const data = useTracker();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [sideOpen, setSideOpen] = useState(true);
  const { resolvedTheme, toggle: toggleTheme } = useTheme();
  const forYouMatch = useMatch({ path: "/", end: true });
  const inboxMatch = useMatch("/inbox");
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
      <header className={topNav}>
        <div className={topStart}>
          <button
            aria-controls="tracker-sidebar"
            aria-expanded={sideOpen}
            aria-label={sideOpen ? "Collapse sidebar" : "Expand sidebar"}
            className={iconButton}
            type="button"
            onClick={() => setSideOpen((open) => !open)}
          >
            <Icon name="sidebar" />
          </button>
          <Link aria-label="All spaces" className={iconButton} to="/">
            <Icon name="apps" />
          </Link>
          <Link className={appHome} to={project ? `/p/${project.key}/summary` : "/"}>
            <span aria-hidden className={appMark}>
              T
            </span>
            Tracker
          </Link>
        </div>
        <div className={topCenter}>
          <form
            className={searchBox}
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const key = project?.key ?? data.projects[0]?.key;
              if (!key) {
                return;
              }
              navigate(`/p/${key}/list?q=${encodeURIComponent(search.trim())}`);
            }}
          >
            <Icon className={searchIcon} name="search" />
            <input
              aria-label="Search"
              className={searchInput}
              name="search"
              placeholder="Search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>
          <button className={createButton} disabled={!project} type="button" onClick={openCreate}>
            <Icon name="plus" />
            Create
          </button>
        </div>
        <div className={topEnd}>
          <Link aria-label={unread > 0 ? `Inbox, ${unread} unread` : "Inbox"} className={iconButton} to="/inbox">
            <Icon name="bell" />
            {unread > 0 ? <span className={badgeCount}>{unread > 9 ? "9+" : unread}</span> : null}
          </Link>
          <button
            aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className={iconButton}
            type="button"
            onClick={toggleTheme}
          >
            <Icon name={resolvedTheme === "dark" ? "sun" : "moon"} />
          </button>
          <select
            aria-label="Acting as"
            className={actorSelect}
            name="actor"
            value={data.people.some((person) => person.id === data.actorId) ? data.actorId : (data.people[0]?.id ?? "")}
            onChange={(event) => data.setActor(event.target.value)}
          >
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <PersonMark person={actor} />
        </div>
      </header>
      <div className={frame}>
        {sideOpen ? (
          <nav aria-label="Sidebar" className={sideNav} id="tracker-sidebar">
            <ul className={sideList}>
              <li>
                <Link className={forYouMatch ? `${sideRow} ${sideRowActive}` : sideRow} to="/">
                  <Icon name="forYou" />
                  For you
                </Link>
              </li>
              <li>
                <Link className={inboxMatch ? `${sideRow} ${sideRowActive}` : sideRow} to="/inbox">
                  <Icon name="inbox" />
                  Inbox
                  {unread > 0 ? <span className={sideRowEnd}>{unread}</span> : null}
                </Link>
              </li>
              <li>
                <Link className={sideRow} to="/">
                  <Icon name="spaces" />
                  Spaces
                </Link>
              </li>
              <li>
                <p className={sideGroup}>Recent</p>
                <ul className={sideList}>
                  {data.projects.map((item) => {
                    const active = item.key === project?.key;
                    return (
                      <li key={item.key}>
                        <Link
                          aria-current={active ? "page" : undefined}
                          className={active ? `${sideRow} ${sideRowNested} ${sideRowActive}` : `${sideRow} ${sideRowNested}`}
                          to={`/p/${item.key}/summary`}
                        >
                          <SpaceMark spaceKey={item.key} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        ) : null}
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
