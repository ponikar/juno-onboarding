// Returns the typed text when it matches no option and is not already picked, so search never dead-ends.
export function customEntry(query: string, options: readonly string[], picked: readonly string[]): string | null {
  const text = query.trim().replace(/\s+/g, ' ');
  if (text.length < 2) return null;
  const same = (x: string) => x.toLowerCase() === text.toLowerCase();
  return options.some(same) || picked.some(same) ? null : text;
}
