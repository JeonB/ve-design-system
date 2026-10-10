import { Badge, Button, Card, Stack } from "@ve/ui";
import { Link } from "react-router";
import { NOTIFICATION_KINDS } from "../domain/issue.types";
import { useTracker } from "../domain/tracker-context";
import { padded } from "../layout/shell.css";

export function Inbox() {
  const data = useTracker();
  const notices = data.notices.filter((notice) => notice.recipientId === data.actorId).slice().reverse();

  return (
    <div className={padded}>
    <Stack gap="md">
      <Stack direction="horizontal" align="center" justify="between">
        <h1>Inbox</h1>
        <Button type="button" variant="outline" onClick={() => data.markAllNoticesRead()}>
          Mark all read
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="md">
        {NOTIFICATION_KINDS.map((kind) => {
          const muted = data.mailMutes.some((item) => item.personId === data.actorId && item.kind === kind);
          return (
            <label key={kind}>
              <input checked={muted} name={`mute-${kind}`} type="checkbox" onChange={(event) => data.setMailMute(kind, event.target.checked)} /> Mute {kind}
            </label>
          );
        })}
      </Stack>
      {notices.length === 0 ? <p>No messages.</p> : null}
      {notices.map((notice) => (
        <Card key={notice.id} padding="sm">
          <Stack gap="sm">
            <Stack direction="horizontal" gap="sm" align="center">
              <Badge size="sm" variant={notice.read ? "neutral" : "primary"}>
                {notice.kind}
              </Badge>
              <Card.Title>{notice.subject}</Card.Title>
            </Stack>
            <Card.Description>{notice.body}</Card.Description>
            <Stack direction="horizontal" gap="sm">
              <Button asChild size="sm" variant="outline">
                <Link to={`/p/${notice.issueKey.split("-")[0]}/issues/${notice.issueId}`} onClick={() => data.markNoticeRead(notice.id)}>
                  Open
                </Link>
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Stack>
    </div>
  );
}
