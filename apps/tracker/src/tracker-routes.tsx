import { Route, Routes, useParams } from "react-router";
import { IssueDetail } from "./features/issue-detail";
import { IssueList } from "./features/issue-list";
import { ProjectBacklog } from "./features/project-backlog";
import { ProjectBoard } from "./features/project-board";
import { ProjectList } from "./features/project-list";
import { ProjectSection } from "./features/project-section";
import { ProjectSettings } from "./features/project-settings";
import { AppShell } from "./layout/app-shell";

export function TrackerRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ProjectList />} />
        <Route path="p/:projectKey" element={<ProjectSection />}>
          <Route index element={<BoardRoute />} />
          <Route path="backlog" element={<BacklogRoute />} />
          <Route path="list" element={<ListRoute />} />
          <Route path="settings" element={<SettingsRoute />} />
          <Route path="issues/:issueId" element={<DetailRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}

function BacklogRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectBacklog projectKey={projectKey} />;
}

function BoardRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectBoard projectKey={projectKey} />;
}

function SettingsRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectSettings projectKey={projectKey} />;
}

function ListRoute() {
  const { projectKey = "" } = useParams();
  return <IssueList projectKey={projectKey} />;
}

function DetailRoute() {
  const { issueId = "" } = useParams();
  return <IssueDetail key={issueId} issueId={issueId} />;
}
