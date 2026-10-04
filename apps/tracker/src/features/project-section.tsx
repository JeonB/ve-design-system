import { Alert } from "@ve/ui";
import { Link, Outlet, useMatch, useParams } from "react-router";
import { projectByKey } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { ProjectBoard } from "./project-board";
import {
  space,
  spaceBody,
  spaceHeader,
  spaceTitle,
  viewLink,
  viewLinkActive,
  viewNav
} from "../layout/shell.css";

const VIEWS = [
  { id: "summary", label: "Summary", suffix: "/summary" },
  { id: "list", label: "List", suffix: "/list" },
  { id: "board", label: "Board", suffix: "" },
  { id: "backlog", label: "Backlog", suffix: "/backlog" },
  { id: "settings", label: "Settings", suffix: "/settings" }
] as const;

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

  const tab = summaryMatch ? "summary" : listMatch ? "list" : backlogMatch ? "backlog" : settingsMatch ? "settings" : "board";

  return (
    <div className={space}>
      <header className={spaceHeader}>
        <h1 className={spaceTitle}>{project.name}</h1>
      </header>
      <nav aria-label="Space views" className={viewNav}>
        {VIEWS.map((view) => {
          const active = view.id === tab;
          return (
            <Link
              key={view.id}
              className={active ? `${viewLink} ${viewLinkActive}` : viewLink}
              to={`/p/${project.key}${view.suffix}`}
            >
              {view.label}
            </Link>
          );
        })}
      </nav>
      <div className={spaceBody}>
        {detailMatch ? <ProjectBoard projectKey={project.key} /> : null}
        <Outlet />
      </div>
    </div>
  );
}
