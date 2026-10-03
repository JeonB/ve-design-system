import {
  PROJECT_ROLES,
  type Membership,
  type Person,
  type Project,
  type ProjectAction,
  type ProjectRole,
  type TrackerData
} from "./issue.types";

export type { Membership, ProjectAction, ProjectRole };

export const ACTOR_STORAGE_KEY = "ve-tracker-actor";

export function isProjectRole(value: string): value is ProjectRole {
  return (PROJECT_ROLES as readonly string[]).includes(value);
}

export function defaultMemberships(projects: Project[], people: Person[]): Membership[] {
  return projects.flatMap((project) =>
    people.map((person) => ({
      projectKey: project.key,
      personId: person.id,
      role: roleForPerson(person.id)
    }))
  );
}

function roleForPerson(personId: string): ProjectRole {
  if (personId === "ada") {
    return "admin";
  }
  if (personId === "grace") {
    return "member";
  }
  return "viewer";
}

export function membershipFor(data: TrackerData, projectKey: string, personId: string): Membership | undefined {
  return data.memberships.find((membership) => membership.projectKey === projectKey && membership.personId === personId);
}

export function can(data: TrackerData, actorId: string, projectKey: string, action: ProjectAction): boolean {
  const role = membershipFor(data, projectKey, actorId)?.role;
  if (!role) {
    return false;
  }
  switch (role) {
    case "admin":
      return true;
    case "viewer":
      return action === "view";
    case "member":
      return action === "view" || action === "create" || action === "edit" || action === "comment" || action === "transition" || action === "attach";
    default: {
      const exhaustive: never = role;
      return exhaustive;
    }
  }
}

export function setMembership(
  data: TrackerData,
  projectKey: string,
  personId: string,
  role: ProjectRole
): { data: TrackerData } | { error: string } {
  const next = data.memberships.map((membership) =>
    membership.projectKey === projectKey && membership.personId === personId ? { ...membership, role } : membership
  );
  const exists = data.memberships.some((membership) => membership.projectKey === projectKey && membership.personId === personId);
  const memberships = exists ? next : [...next, { projectKey, personId, role }];
  const admins = memberships.filter((membership) => membership.projectKey === projectKey && membership.role === "admin");
  if (admins.length === 0) {
    return { error: "A project needs an admin." };
  }
  return { data: { ...data, memberships } };
}
