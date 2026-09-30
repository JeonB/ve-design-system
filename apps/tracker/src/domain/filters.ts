import type { SavedFilter, TrackerData } from "./issue.types";

export type SaveFilterInput = Omit<SavedFilter, "id">;

function nextFilterId(data: TrackerData, projectKey: string): string {
  const numbers = data.savedFilters.map((filter) => {
    const match = /-F(\d+)$/.exec(filter.id);
    return match ? Number(match[1]) : 0;
  });
  const next = Math.max(0, ...numbers) + 1;
  return `${projectKey}-F${next}`;
}

export function saveFilter(
  data: TrackerData,
  input: SaveFilterInput
): { data: TrackerData; filter: SavedFilter } | { error: string } {
  const name = input.name.trim();
  if (name.length === 0) {
    return { error: "Filter name is required." };
  }
  const filter: SavedFilter = {
    ...input,
    name,
    id: nextFilterId(data, input.projectKey)
  };
  return { data: { ...data, savedFilters: [...data.savedFilters, filter] }, filter };
}

export function deleteFilter(data: TrackerData, filterId: string): TrackerData {
  return { ...data, savedFilters: data.savedFilters.filter((filter) => filter.id !== filterId) };
}
