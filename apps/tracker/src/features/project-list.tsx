import { Badge, Button, Card, Stack } from "@ve/ui";
import { Link } from "react-router";
import { countByProject } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { padded, projectGrid } from "../layout/shell.css";

export function ProjectList() {
  const data = useTracker();

  return (
    <div className={padded}>
    <Stack gap="md">
      <h1>Projects</h1>
      <div className={projectGrid}>
        {data.projects.map((project) => (
          <Card key={project.key}>
            <Card.Header>
              <Stack direction="horizontal" gap="sm" align="center" justify="between">
                <Card.Title>{project.name}</Card.Title>
                <Badge variant="outline">{project.key}</Badge>
              </Stack>
              <Card.Description>
                {project.description} · {countByProject(data, project.key)} issues
              </Card.Description>
            </Card.Header>
            <Card.Footer>
              <Button asChild>
                <Link to={`/p/${project.key}`}>Open board</Link>
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </Stack>
    </div>
  );
}
