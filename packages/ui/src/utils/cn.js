/** @param {...(string | undefined | null | false)} values */
export function cn(...values) {
  return values.filter(Boolean).join(" ");
}
