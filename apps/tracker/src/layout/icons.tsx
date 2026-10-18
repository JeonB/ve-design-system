import type { ReactNode } from "react";

export const ICON_NAMES = [
  "sidebar",
  "apps",
  "search",
  "plus",
  "bell",
  "help",
  "sun",
  "moon",
  "forYou",
  "spaces",
  "inbox",
  "chevronRight",
  "more",
  "people",
  "summary",
  "list",
  "board",
  "backlog",
  "settings",
  "filter",
  "completed",
  "updated",
  "created",
  "calendar",
  "person",
  "highest",
  "high",
  "medium",
  "low",
  "lowest",
  "task",
  "epic",
  "bug",
  "feature",
  "story",
  "subtask"
] as const;

export type IconName = (typeof ICON_NAMES)[number];

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
};

function glyph(name: IconName): ReactNode {
  switch (name) {
    case "sidebar":
      return (
        <>
          <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
          <path d="M5.75 2.75v10.5M9.5 6.25 7.75 8l1.75 1.75" />
        </>
      );
    case "apps":
      return (
        <>
          <rect x="2.25" y="2.25" width="4.5" height="4.5" rx="1.25" />
          <rect x="9.25" y="2.25" width="4.5" height="4.5" rx="1.25" />
          <rect x="2.25" y="9.25" width="4.5" height="4.5" rx="1.25" />
          <rect x="9.25" y="9.25" width="4.5" height="4.5" rx="1.25" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="7" cy="7" r="4.75" />
          <path d="m10.5 10.5 3.25 3.25" />
        </>
      );
    case "plus":
      return <path d="M8 2.5v11M2.5 8h11" />;
    case "bell":
      return <path d="M4 11.25V7a4 4 0 0 1 8 0v4.25l1 1.25H3zM6.5 14h3" />;
    case "help":
      return (
        <>
          <circle cx="8" cy="8" r="6.25" />
          <path d="M6.25 6.25a1.75 1.75 0 1 1 2.5 1.6c-.5.25-.75.6-.75 1.15v.25M8 11.25v.01" />
        </>
      );
    case "sun":
      return (
        <>
          <circle cx="8" cy="8" r="3" />
          <path d="M8 1.5v1.25M8 13.25v1.25M14.5 8h-1.25M2.75 8H1.5M12.6 3.4l-.9.9M4.3 11.7l-.9.9M12.6 12.6l-.9-.9M4.3 4.3l-.9-.9" />
        </>
      );
    case "moon":
      return <path d="M13.25 9.75A5.5 5.5 0 0 1 6.25 2.75a5.5 5.5 0 1 0 7 7" />;
    case "forYou":
      return (
        <>
          <circle cx="8" cy="8" r="6.25" />
          <circle cx="8" cy="6.5" r="2" />
          <path d="M4.25 12.5c.75-1.5 2.15-2.25 3.75-2.25s3 .75 3.75 2.25" />
        </>
      );
    case "spaces":
      return (
        <>
          <circle cx="8" cy="8" r="4" />
          <path d="M3.4 10.9C1.5 12.6.9 14 1.6 14.5c1.1.8 4.6-1.1 7.9-4.3s5.4-6.6 4.7-7.6c-.4-.6-1.8-.2-3.6 1" />
        </>
      );
    case "inbox":
      return (
        <>
          <path d="M2.25 9.25 4 3.25h8l1.75 6v3.5a1 1 0 0 1-1 1H3.25a1 1 0 0 1-1-1z" />
          <path d="M2.25 9.25h3.5l.75 1.5h3l.75-1.5h3.5" />
        </>
      );
    case "chevronRight":
      return <path d="m6.25 3.75 4.25 4.25-4.25 4.25" />;
    case "more":
      return (
        <>
          <circle cx="3.5" cy="8" r=".6" />
          <circle cx="8" cy="8" r=".6" />
          <circle cx="12.5" cy="8" r=".6" />
        </>
      );
    case "people":
      return (
        <>
          <circle cx="5.75" cy="5.75" r="2" />
          <circle cx="11" cy="6.25" r="1.6" />
          <path d="M2 12.75c.5-2 2-3 3.75-3s3.25 1 3.75 3M10 9.75c1.75-.2 3.25.6 4 2.75" />
        </>
      );
    case "summary":
      return (
        <>
          <circle cx="8" cy="8" r="6.25" />
          <path d="M1.75 8h12.5M8 1.75c1.75 1.75 2.5 3.9 2.5 6.25S9.75 12.5 8 14.25C6.25 12.5 5.5 10.35 5.5 8S6.25 3.5 8 1.75" />
        </>
      );
    case "list":
      return (
        <>
          <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.25" />
          <path d="M1.75 6.25h12.5M1.75 9.75h12.5M5.75 2.75v10.5" />
        </>
      );
    case "board":
      return (
        <>
          <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.25" />
          <path d="M6 2.75v10.5M10 2.75v10.5" />
        </>
      );
    case "backlog":
      return <path d="M2.25 3.75h11.5M2.25 8h11.5M2.25 12.25h7" />;
    case "settings":
      return (
        <>
          <circle cx="8" cy="8" r="2" />
          <path d="M8 1.75v1.5M8 12.75v1.5M14.25 8h-1.5M3.25 8h-1.5M12.4 3.6l-1.05 1.05M4.65 11.35 3.6 12.4M12.4 12.4l-1.05-1.05M4.65 4.65 3.6 3.6" />
          <circle cx="8" cy="8" r="4.5" />
        </>
      );
    case "filter":
      return <path d="M2.25 4h11.5M4.25 8h7.5M6.25 12h3.5" />;
    case "completed":
      return (
        <>
          <circle cx="8" cy="8" r="6.25" />
          <path d="m5.25 8.25 1.9 1.9 3.6-4" />
        </>
      );
    case "updated":
      return (
        <>
          <path d="M9.75 3.5 12.5 6.25 6.25 12.5H3.5V9.75z" />
          <circle cx="2.75" cy="3" r=".6" />
          <circle cx="2.75" cy="6" r=".6" />
        </>
      );
    case "created":
      return (
        <>
          <rect x="4.25" y="4.25" width="9.5" height="9.5" rx="1.25" />
          <path d="M2.25 11.25v-8a1 1 0 0 1 1-1h8M6.75 9.25l1.75 1.5 2.75-3" />
        </>
      );
    case "calendar":
      return (
        <>
          <rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5" />
          <path d="M2.25 6.75h11.5M5.25 1.75v3M10.75 1.75v3" />
        </>
      );
    case "person":
      return (
        <>
          <circle cx="8" cy="5.75" r="2.5" />
          <path d="M3.25 13.5c.6-2.4 2.5-3.75 4.75-3.75s4.15 1.35 4.75 3.75" />
        </>
      );
    case "highest":
      return <path d="m3.75 8.25 4.25-3.5 4.25 3.5M3.75 12l4.25-3.5 4.25 3.5" />;
    case "high":
      return <path d="M3.75 10.25 8 6.25l4.25 4" />;
    case "medium":
      return <path d="M3.25 6.25h9.5M3.25 9.75h9.5" />;
    case "low":
      return <path d="M3.75 5.75 8 9.75l4.25-4" />;
    case "lowest":
      return <path d="m3.75 4 4.25 3.5L12.25 4M3.75 7.75l4.25 3.5 4.25-3.5" />;
    case "task":
      return (
        <>
          <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2" />
          <path d="m5.25 8.25 1.9 1.9 3.6-4" />
        </>
      );
    case "epic":
      return <path d="M9.25 1.75 3.75 9h4l-1 5.25L12.25 7h-4z" />;
    case "bug":
      return (
        <>
          <rect x="4.75" y="4.75" width="6.5" height="8.5" rx="3.25" />
          <path d="M8 4.75V13.25M6 4.75a2 2 0 0 1 4 0M2.25 9h2.5M11.25 9h2.5M3 5.25l1.9 1.25M13 5.25l-1.9 1.25M3 12.75l1.9-1.25M13 12.75l-1.9-1.25" />
        </>
      );
    case "feature":
      return (
        <>
          <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.25" />
          <rect x="5" y="6" width="6" height="4" rx=".75" />
        </>
      );
    case "story":
      return <path d="M4.25 2.25h7.5v11.5L8 10.75l-3.75 3z" />;
    case "subtask":
      return (
        <>
          <rect x="2.25" y="2.25" width="7" height="7" rx="1.25" />
          <rect x="6.75" y="6.75" width="7" height="7" rx="1.25" />
        </>
      );
    default: {
      const exhaustive: never = name;
      return exhaustive;
    }
  }
}

export function Icon({ name, size = 16, className, label }: IconProps) {
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      fill="none"
      height={size}
      role={label ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      width={size}
    >
      {glyph(name)}
    </svg>
  );
}
