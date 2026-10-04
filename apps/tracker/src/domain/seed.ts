import type { Issue, TrackerData } from "./issue.types";
import { defaultMemberships } from "./permissions";
import { defaultWorkflow } from "./workflow";

export const CURRENT_ACTOR_ID = "ada";

type DraftIssue = Omit<Issue, "activity" | "sprintId" | "rank" | "labels" | "storyPoints" | "parentId" | "attachments">;

function draftTracker(): { projects: TrackerData["projects"]; people: TrackerData["people"]; issues: DraftIssue[] } {
  return {
    projects: [
      {
        key: "WEB",
        name: "Website",
        description: "Marketing site and docs"
      },
      {
        key: "API",
        name: "Platform API",
        description: "Public API and auth"
      }
    ],
    people: [
      { id: "ada", name: "Ada Lovelace" },
      { id: "grace", name: "Grace Hopper" },
      { id: "min", name: "Min Seo" }
    ],
    issues: [
      {
        id: "WEB-1",
        number: 1,
        key: "WEB-1",
        projectKey: "WEB",
        type: "story",
        status: "in_progress",
        priority: "high",
        summary: "Publish the pricing page",
        description: "Replace the placeholder pricing table and link it from the header.",
        assigneeId: "ada",
        reporterId: "grace",
        createdAt: "2026-09-18T09:00:00.000Z",
        updatedAt: "2026-09-24T02:00:00.000Z",
        comments: [
          {
            id: "WEB-1-c1",
            authorId: "grace",
            body: "Keep the free tier visible without a scroll.",
            createdAt: "2026-09-20T01:00:00.000Z"
          }
        ]
      },
      {
        id: "WEB-2",
        number: 2,
        key: "WEB-2",
        projectKey: "WEB",
        type: "bug",
        status: "todo",
        priority: "urgent",
        summary: "Login button ignores the disabled state",
        description: "The submit button stays clickable while the form is invalid.",
        assigneeId: "min",
        reporterId: "ada",
        createdAt: "2026-09-21T09:00:00.000Z",
        updatedAt: "2026-09-23T08:00:00.000Z",
        comments: []
      },
      {
        id: "WEB-3",
        number: 3,
        key: "WEB-3",
        projectKey: "WEB",
        type: "task",
        status: "done",
        priority: "medium",
        summary: "Add the status page footer link",
        description: "Footer should point at the public status page.",
        assigneeId: "grace",
        reporterId: "ada",
        createdAt: "2026-09-12T09:00:00.000Z",
        updatedAt: "2026-09-19T08:00:00.000Z",
        comments: []
      },
      {
        id: "WEB-4",
        number: 4,
        key: "WEB-4",
        projectKey: "WEB",
        type: "epic",
        status: "todo",
        priority: "medium",
        summary: "Docs IA refresh",
        description: "Group getting started, guides, and reference.",
        assigneeId: "grace",
        reporterId: "min",
        createdAt: "2026-09-10T09:00:00.000Z",
        updatedAt: "2026-09-16T08:00:00.000Z",
        comments: []
      },
      {
        id: "WEB-5",
        number: 5,
        key: "WEB-5",
        projectKey: "WEB",
        type: "story",
        status: "in_review",
        priority: "low",
        summary: "Empty state for the changelog",
        description: "Show a short note when no releases are published.",
        assigneeId: "ada",
        reporterId: "min",
        createdAt: "2026-09-22T09:00:00.000Z",
        updatedAt: "2026-09-25T01:00:00.000Z",
        comments: []
      },
      {
        id: "API-1",
        number: 1,
        key: "API-1",
        projectKey: "API",
        type: "task",
        status: "in_progress",
        priority: "high",
        summary: "Document the token refresh error",
        description: "401 responses need a stable error code.",
        assigneeId: "grace",
        reporterId: "ada",
        createdAt: "2026-09-19T09:00:00.000Z",
        updatedAt: "2026-09-24T04:00:00.000Z",
        comments: []
      },
      {
        id: "API-2",
        number: 2,
        key: "API-2",
        projectKey: "API",
        type: "bug",
        status: "done",
        priority: "medium",
        summary: "Health check returns 500 when idle",
        description: "The readiness probe should stay 200 with no traffic.",
        assigneeId: "min",
        reporterId: "grace",
        createdAt: "2026-09-15T09:00:00.000Z",
        updatedAt: "2026-09-22T08:00:00.000Z",
        comments: []
      }
    ]
  };
}

export function seedTracker(): TrackerData {
  const drafted = draftTracker();
  return {
    projects: drafted.projects,
    people: drafted.people,
    sprints: [
      {
        id: "WEB-S1",
        projectKey: "WEB",
        name: "Sprint 1",
        state: "active",
        startDate: "2026-09-22",
        endDate: "2026-10-03"
      },
      {
        id: "API-S1",
        projectKey: "API",
        name: "Sprint 1",
        state: "active",
        startDate: "2026-09-22",
        endDate: "2026-10-03"
      }
    ],
    issues: drafted.issues.map((issue) => ({
      ...issue,
      activity: [],
      sprintId: issue.id === "WEB-4" ? null : `${issue.projectKey}-S1`,
      rank: issue.number,
      labels: issue.id === "WEB-1" ? ["pricing"] : [],
      storyPoints: issue.id === "WEB-1" ? 5 : issue.id === "WEB-2" ? 2 : null,
      parentId: null,
      attachments: []
    })),
    savedFilters: [],
    memberships: defaultMemberships(drafted.projects, drafted.people),
    workflows: drafted.projects.map((project) => defaultWorkflow(project.key)),
    notices: []
  };
}
