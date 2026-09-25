import { Route, Routes, useParams } from "react-router";
import { IssueDetail } from "./features/issue-detail";
import { IssueList } from "./features/issue-list";
import { ProjectBoard } from "./features/project-board";
import { ProjectList } from "./features/project-list";
import { ProjectSection } from "./features/project-section";
import { AppShell } from "./layout/app-shell";

export function TrackerRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ProjectList />} />
        <Route path="p/:projectKey" element={<ProjectSection />}>
          <Route index element={<BoardRoute />} />
          <Route path="list" element={<ListRoute />} />
          <Route path="issues/:issueId" element={<DetailRoute />} />
        </Route>
      </Route>
    </Routes>
  );
}

function BoardRoute() {
  const { projectKey = "" } = useParams();
  return <ProjectBoard projectKey={projectKey} />;
}

function ListRoute() {
  const { projectKey = "" } = useParams();
  return <IssueList projectKey={projectKey} />;
}

function DetailRoute() {
  const { issueId = "" } = useParams();
  return <IssueDetail key={issueId} issueId={issueId} />;
}
