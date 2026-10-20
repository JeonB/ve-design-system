import { Alert } from "@ve/ui";
import { Link, Outlet, useMatch, useParams } from "react-router";
import { projectByKey } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { ProjectBoard } from "./project-board";
import { Icon, type IconName } from "../layout/icons";
import { SpaceMark } from "../layout/marks";
import { breadcrumb, spaceHeader, spaceTitle, spaceTitleRow, tab, tabActive, tabs } from "../layout/nav.css";
import { space, spaceBody } from "../layout/shell.css";

type ViewId = "summary" | "list" | "board" | "backlog" | "settings";

const VIEWS: readonly { id: ViewId; label: string; suffix: string; icon: IconName }[] = [
  { id: "summary", label: "Summary", suffix: "/summary", icon: "summary" },
  { id: "list", label: "List", suffix: "/list", icon: "list" },
  { id: "board", label: "Board", suffix: "", icon: "board" },
  { id: "backlog", label: "Backlog", suffix: "/backlog", icon: "backlog" },
  { id: "settings", label: "Settings", suffix: "/settings", icon: "settings" }
];

export function ProjectSection() {
  const { projectKey = "" } = useParams();
  const data = useTracker();
  const project = projectByKey(data, projectKey);
  const summaryMatch = useMatch("/p/:projectKey/summary");
  const listMatch = useMatch("/p/:projectKey/list");
  const backlogMatch = useMatch("/p/:projectKey/backlog");
  const settingsMatch = useMatch("/p/:projectKey/settings");
  const detailMatch = useMatch("/p/:projectKey/issues/:issueId");

  if (!project) {
    return (
      <Alert title="Project not found" variant="danger">
        That project key is not in this workspace.
      </Alert>
    );
  }

  const current: ViewId = summaryMatch
    ? "summary"
    : listMatch
      ? "list"
      : backlogMatch
        ? "backlog"
        : settingsMatch
          ? "settings"
          : "board";

  return (
    <div className={space}>
      <header className={spaceHeader}>
        <Link className={breadcrumb} to="/">
          Spaces
        </Link>
        <div className={spaceTitleRow}>
          <SpaceMark spaceKey={project.key} />
          <h1 className={spaceTitle}>{project.name}</h1>
        </div>
        <nav aria-label="Space views">
          <ul className={tabs}>
            {VIEWS.map((view) => {
              const active = view.id === current;
              return (
                <li key={view.id}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className={active ? `${tab} ${tabActive}` : tab}
                    to={`/p/${project.key}${view.suffix}`}
                  >
                    <Icon name={view.icon} />
                    {view.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <div className={spaceBody}>
        {detailMatch ? <ProjectBoard projectKey={project.key} /> : null}
        <Outlet />
      </div>
    </div>
  );
}
