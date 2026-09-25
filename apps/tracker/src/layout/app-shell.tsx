import { Button, Select, Stack, ThemeToggle } from "@ve/ui";
import { Link, Outlet, useMatch, useNavigate } from "react-router";
import { projectByKey } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { header, headerStart, page, shell } from "./shell.css";

export function AppShell() {
  const data = useTracker();
  const navigate = useNavigate();
  const projectMatch = useMatch({ path: "/p/:projectKey", end: false });
  const projectKey = projectMatch?.params.projectKey;
  const project = projectKey ? projectByKey(data, projectKey) : undefined;

  return (
    <div className={page}>
      <div className={shell}>
        <header className={header}>
          <div className={headerStart}>
            <Button asChild variant="ghost">
              <Link to="/">Tracker</Link>
            </Button>
            {project ? (
              <Select
                aria-label="Project"
                name="project"
                value={project.key}
                onChange={(event) => navigate(`/p/${event.target.value}`)}
              >
                {data.projects.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.key} · {item.name}
                  </option>
                ))}
              </Select>
            ) : null}
          </div>
          <Stack direction="horizontal" gap="sm" align="center">
            <span>{data.people.find((person) => person.id === data.actorId)?.name}</span>
            <ThemeToggle />
          </Stack>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
