import { Route, Routes, useParams } from "react-router";
import { Inbox } from "./features/inbox";
import { IssueDetail } from "./features/issue-detail";
import { IssueList } from "./features/issue-list";
import { ProjectBacklog } from "./features/project-backlog";
import { ProjectBoard } from "./features/project-board";
import { ProjectList } from "./features/project-list";
import { ProjectSection } from "./features/project-section";
import { ProjectSettings } from "./features/project-settings";
import { ProjectSummary } from "./features/project-summary";
import { AppShell } from "./layout/app-shell";
import { padded } from "./layout/shell.css";

export function TrackerRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ProjectList />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="p/:projectKey" element={<ProjectSection />}>
          <Route index element={<BoardRoute />} />
          <Route path="summary" element={<SummaryRoute />} />
          <Route path="backlog" element={<BacklogRoute />} />
          <Route path="list" element={<ListRoute />} />
          <Route path="settings" element={<SettingsRoute />} />
          <Route path="issues/:issueId" element={<DetailRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}

function SummaryRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectSummary projectKey={projectKey} />;
}

function BacklogRoute() {
  const { projectKey = "" } = useParams();
  return (
    <div className={padded}>
      <ProjectBacklog projectKey={projectKey} />
    </div>
  );
}

function BoardRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectBoard projectKey={projectKey} />;
}

function SettingsRoute() {
  const { projectKey = "" } = useParams();
  return (
    <div className={padded}>
      <ProjectSettings projectKey={projectKey} />
    </div>
  );
}

function ListRoute() {
  const { projectKey = "" } = useParams();
  return <IssueList projectKey={projectKey} />;
}

function DetailRoute() {
  const { issueId = "" } = useParams();
  return <IssueDetail key={issueId} issueId={issueId} />;
}
