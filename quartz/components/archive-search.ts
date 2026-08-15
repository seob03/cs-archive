import { StudyNoteCard } from "./study-notes"

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, " ").trim()
}

export function studyNoteSearchText(note: StudyNoteCard): string {
  return normalizeSearchText(
    [
      note.title,
      note.excerpt,
      note.categoryKey,
      note.categoryLabel,
      note.slug,
      ...note.tags,
      ...note.path,
    ].join(" "),
  )
}

export function matchesStudyNote(note: StudyNoteCard, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return false

  const haystack = studyNoteSearchText(note)
  return normalizedQuery.split(" ").every((token) => haystack.includes(token))
}

export function limitSearchResults(
  notes: StudyNoteCard[],
  query: string,
  limit = 8,
): StudyNoteCard[] {
  if (!normalizeSearchText(query) || limit <= 0) return []
  return notes.filter((note) => matchesStudyNote(note, query)).slice(0, limit)
}
