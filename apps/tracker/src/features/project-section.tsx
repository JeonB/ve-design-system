import { useState } from "react";
import { Alert, Button, Stack, Tabs } from "@ve/ui";
import { Outlet, useMatch, useNavigate, useParams } from "react-router";
import { projectByKey } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { CreateIssueDialog } from "./create-issue-dialog";

export function ProjectSection() {
  const { projectKey = "" } = useParams();
  const data = useTracker();
  const navigate = useNavigate();
  const project = projectByKey(data, projectKey);
  const listMatch = useMatch("/p/:projectKey/list");
  const detailMatch = useMatch("/p/:projectKey/issues/:issueId");
  const [createOpen, setCreateOpen] = useState(false);

  if (!project) {
    return (
      <Alert title="Project not found" variant="danger">
        That project key is not in this workspace.
      </Alert>
    );
  }

  const tab = listMatch ? "list" : "board";

  return (
    <Stack gap="md">
      <Stack direction="horizontal" align="center" justify="between">
        <h1>
          {project.name}{" "}
          <span>{project.key}</span>
        </h1>
        {detailMatch ? null : (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Create issue
          </Button>
        )}
      </Stack>
      {detailMatch ? null : (
        <Tabs
          value={tab}
          onValueChange={(value) => {
            if (value === "list") {
              navigate(`/p/${project.key}/list`);
              return;
            }
            navigate(`/p/${project.key}`);
          }}
        >
          <Tabs.List aria-label="Project views">
            <Tabs.Trigger value="board">Board</Tabs.Trigger>
            <Tabs.Trigger value="list">List</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      )}
      <Outlet />
      <CreateIssueDialog
        open={createOpen}
        onCreate={(input) => {
          const issue = data.createIssue(project.key, input);
          setCreateOpen(false);
          navigate(`/p/${project.key}/issues/${issue.id}`);
        }}
        onOpenChange={setCreateOpen}
      />
    </Stack>
  );
}
