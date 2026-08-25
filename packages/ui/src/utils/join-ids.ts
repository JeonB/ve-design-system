/** 공백으로 구분된 id 목록을 중복 없이 합친다. */
export function joinIds(...values: Array<string | undefined>): string | undefined {
  const ids = values
    .flatMap((value) => value?.trim().split(/\s+/g) ?? [])
    .filter((id) => id.length > 0);

  if (ids.length === 0) {
    return undefined;
  }

  return [...new Set(ids)].join(" ");
}
