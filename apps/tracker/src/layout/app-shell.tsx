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
            <Button asChild variant="ghost">
              <Link to="/inbox">
                Inbox
                {data.notices.some((notice) => notice.recipientId === data.actorId && !notice.read)
                  ? ` (${data.notices.filter((notice) => notice.recipientId === data.actorId && !notice.read).length})`
                  : ""}
              </Link>
            </Button>
            <ThemeToggle />
          </Stack>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
