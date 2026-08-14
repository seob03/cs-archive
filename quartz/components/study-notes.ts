import { QuartzPluginData } from "../plugins/vfile"
import { unescapeHTML } from "../util/escape"
import { FullSlug } from "../util/path"

export type StudyNoteCard = {
  slug: FullSlug
  title: string
  excerpt: string
  categoryKey: string
  categoryLabel: string
  path: string[]
  modified?: Date
  tags: string[]
}

export type StudyNoteCategory = {
  key: string
  label: string
  count: number
}

export type StudyNotesIndex = {
  notes: StudyNoteCard[]
  categories: StudyNoteCategory[]
}

const excerptLimit = 150

function normalizeText(value: string): string {
  return unescapeHTML(value)
    .replace(/<[^>]+>/g, "")
    .replace(/[\*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function summarizeNote(description?: string, fallback = "노트 내용을 열어보세요."): string {
  const normalized = normalizeText(description ?? "")
  if (!normalized) return fallback
  if (normalized.length <= excerptLimit) return normalized

  return `${normalized.slice(0, excerptLimit - 1).trimEnd()}…`
}

function textFromHtml(value: unknown): string {
  if (typeof value === "string") return value
  if (!value || typeof value !== "object") return ""

  const node = value as { value?: unknown; children?: unknown[] }
  if (typeof node.value === "string") return node.value
  return (node.children ?? []).map(textFromHtml).join(" ")
}

function modifiedDate(file: QuartzPluginData): Date | undefined {
  const value = file.dates && typeof file.dates === "object" ? file.dates.modified : undefined
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : undefined
}

function tagsFrom(file: QuartzPluginData): string[] {
  const tags = file.frontmatter?.tags
  if (typeof tags === "string") return [tags]
  if (Array.isArray(tags)) return tags.filter((tag): tag is string => typeof tag === "string")
  return []
}

export function buildStudyNotesIndex(files: QuartzPluginData[]): StudyNotesIndex {
  const notes = files
    .flatMap((file) => {
      if (typeof file.slug !== "string") return []

      const segments = file.slug
        .split("/")
        .map((segment) => segment.trim())
        .filter(Boolean)
      if (segments.length === 0 || segments.at(-1) === "index") return []

      const folders = segments.slice(0, -1).map((segment) => segment.toUpperCase())
      const categoryKey = folders[0] ?? "GENERAL"
      const title =
        typeof file.frontmatter?.title === "string"
          ? file.frontmatter.title
          : (segments.at(-1) ?? "Untitled note")
      const description =
        typeof file.frontmatter?.description === "string"
          ? file.frontmatter.description
          : typeof file.description === "string"
            ? file.description
            : textFromHtml(file.htmlAst)
      const modified = modifiedDate(file)

      return [
        {
          slug: segments.join("/") as FullSlug,
          title,
          excerpt: summarizeNote(description),
          categoryKey,
          categoryLabel: categoryKey,
          path: folders,
          ...(modified ? { modified } : {}),
          tags: tagsFrom(file),
        },
      ]
    })
    .sort((a, b) => {
      if (a.modified && b.modified) {
        const difference = b.modified.getTime() - a.modified.getTime()
        if (difference !== 0) return difference
      } else if (a.modified) {
        return -1
      } else if (b.modified) {
        return 1
      }
      return a.title.localeCompare(b.title, "ko")
    })

  const counts = new Map<string, number>()
  for (const note of notes) counts.set(note.categoryKey, (counts.get(note.categoryKey) ?? 0) + 1)

  const categories = [...counts.entries()]
    .sort(([a], [b]) => (a === "GENERAL" ? 1 : b === "GENERAL" ? -1 : a.localeCompare(b)))
    .map(([key, count]) => ({ key, label: key, count }))

  return { notes, categories }
}

export function formatNoteDate(date?: Date): string {
  if (!date) return ""
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function selectStudyNotes(
  files: QuartzPluginData[],
): Array<StudyNoteCard & { categories: string[] }> {
  return buildStudyNotesIndex(files).notes.map((note) => ({
    ...note,
    categories: note.path,
  }))
}
