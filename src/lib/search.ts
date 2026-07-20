import type { SearchEntry } from "@/lib/content";
import { normalizeSearch } from "@/lib/utils";

export function scoreSearchEntry(entry: SearchEntry, rawQuery: string) {
  const query = normalizeSearch(rawQuery.trim());
  if (!query) return 1;

  const terms = query.split(/\s+/).filter(Boolean);
  const title = normalizeSearch(entry.title);
  const subtitle = normalizeSearch(entry.subtitle);
  const tags = normalizeSearch(entry.tags.join(" "));
  const haystack = normalizeSearch(
    [entry.title, entry.subtitle, entry.category, entry.tags.join(" "), entry.searchText].join(" "),
  );

  if (!terms.every((term) => haystack.includes(term))) return 0;

  let score = 0;
  if (title === query) score += 100;
  if (title.startsWith(query)) score += 45;
  if (title.includes(query)) score += 25;
  if (subtitle.includes(query)) score += 15;
  if (tags.includes(query)) score += 12;

  for (const term of terms) {
    if (title.includes(term)) score += 10;
    if (subtitle.includes(term)) score += 6;
    if (tags.includes(term)) score += 5;
    if (haystack.includes(term)) score += 1;
  }

  return score;
}

export function searchEntries(entries: SearchEntry[], query: string) {
  return entries
    .map((entry) => ({ entry, score: scoreSearchEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "es"))
    .map((result) => result.entry);
}
