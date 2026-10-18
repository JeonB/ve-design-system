import type { Person } from "../domain/issue.types";
import { Icon } from "./icons";
import { TONE_COUNT, avatar, spaceIcon, tone } from "./nav.css";

type Tone = keyof typeof tone;

function toneFor(seed: string): Tone {
  let sum = 0;
  for (const char of seed) {
    sum += char.charCodeAt(0);
  }
  const index = sum % TONE_COUNT;
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return index;
    default:
      return 0;
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}` : (parts[0]?.slice(0, 2) ?? "");
  return letters.toUpperCase();
}

type SpaceMarkProps = {
  spaceKey: string;
};

export function SpaceMark({ spaceKey }: SpaceMarkProps) {
  return (
    <span aria-hidden className={`${spaceIcon} ${tone[toneFor(spaceKey)]}`}>
      {spaceKey.slice(0, 1)}
    </span>
  );
}

type PersonMarkProps = {
  person: Person | undefined;
};

export function PersonMark({ person }: PersonMarkProps) {
  if (!person) {
    return (
      <span aria-hidden className={avatar}>
        <Icon name="person" size={14} />
      </span>
    );
  }
  return (
    <span aria-hidden className={`${avatar} ${tone[toneFor(person.id)]}`} title={person.name}>
      {initials(person.name)}
    </span>
  );
}
