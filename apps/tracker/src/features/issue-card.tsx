import { Avatar } from "@ve/ui";
import { Link } from "react-router";
import { personById } from "../domain/issues";
import type { Issue, IssueType, TrackerData } from "../domain/issue.types";
import { typeMark, workCard, workCardFoot, workCardTop, workKey, workSummary } from "../layout/shell.css";

const TYPE_MARK: Record<IssueType, string> = {
  epic: "E",
  story: "S",
  task: "T",
  bug: "B",
  subtask: "s"
};

type IssueCardProps = {
  issue: Issue;
  data: TrackerData;
  draggable?: boolean;
  onPlaceBefore?: (draggedId: string) => void;
};

export function IssueCard({ issue, data, draggable = true, onPlaceBefore }: IssueCardProps) {
  const assignee = personById(data, issue.assigneeId);

  return (
    <Link
      className={workCard}
      draggable={draggable}
      to={`/p/${issue.projectKey}/issues/${issue.id}`}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", issue.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(event) => {
        if (!onPlaceBefore) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
      }}
      onDrop={(event) => {
        if (!onPlaceBefore) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        const draggedId = event.dataTransfer.getData("text/plain");
        if (draggedId.length > 0 && draggedId !== issue.id) {
          onPlaceBefore(draggedId);
        }
      }}
    >
      <span className={workCardTop}>
        <span className={typeMark} data-type={issue.type}>
          {TYPE_MARK[issue.type]}
        </span>
        <span className={workKey}>{issue.key}</span>
      </span>
      <p className={workSummary}>{issue.summary}</p>
      <span className={workCardFoot}>{assignee ? <Avatar alt={assignee.name} size="sm" /> : null}</span>
    </Link>
  );
}
