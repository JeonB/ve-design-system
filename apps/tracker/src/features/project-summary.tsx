import { issuesByProject } from "../domain/issues";
import { useTracker } from "../domain/tracker-context";
import { workflowFor } from "../domain/workflow";
import { padded, summaryCard, summaryGrid } from "../layout/shell.css";

type ProjectSummaryProps = {
  projectKey: string;
};

export function ProjectSummary({ projectKey }: ProjectSummaryProps) {
  const data = useTracker();
  const issues = issuesByProject(data, projectKey);
  const workflow = workflowFor(data, projectKey);

  return (
    <div className={padded}>
      <div className={summaryGrid}>
        <section className={summaryCard}>
          <span>Work items</span>
          <strong>{issues.length}</strong>
        </section>
        {workflow.statuses.map((status) => (
          <section key={status.id} className={summaryCard}>
            <span>{status.name}</span>
            <strong>{issues.filter((issue) => issue.status === status.id).length}</strong>
          </section>
        ))}
      </div>
    </div>
  );
}
