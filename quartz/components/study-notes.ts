import { QuartzPluginData } from "../plugins/vfile"
import { unescapeHTML } from "../util/escape"
import { FullSlug } from "../util/path"
import { GitUploadDateResolver } from "./git-upload-date"

export type StudyNoteCard = {
  slug: FullSlug
  title: string
  excerpt: string
  categoryKey: string
  categoryLabel: string
  path: string[]
  uploaded?: Date
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

function textFromHtml(value: unknown, skipCodeBlocks = false): string {
  if (typeof value === "string") return value
  if (!value || typeof value !== "object") return ""

  const node = value as { value?: unknown; children?: unknown[]; tagName?: unknown }
  if (skipCodeBlocks && node.tagName === "pre") return ""
  if (typeof node.value === "string") return node.value
  return (node.children ?? []).map((child) => textFromHtml(child, skipCodeBlocks)).join(" ")
}

function hasCodeBlock(value: unknown): boolean {
  if (!value || typeof value !== "object") return false

  const node = value as { children?: unknown[]; tagName?: unknown }
  if (node.tagName === "pre") return true
  return (node.children ?? []).some(hasCodeBlock)
}

function validDate(value: unknown): Date | undefined {
  if (!(value instanceof Date) && typeof value !== "string" && typeof value !== "number") {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value)
  return !Number.isNaN(date.getTime()) ? date : undefined
}

function frontmatterCreatedDate(file: QuartzPluginData): Date | undefined {
  return validDate(file.frontmatter?.created)
}

function storedCreatedDate(file: QuartzPluginData): Date | undefined {
  const value = file.dates && typeof file.dates === "object" ? file.dates.created : undefined
  return validDate(value)
}

function uploadDate(
  file: QuartzPluginData,
  resolveUploadDate?: GitUploadDateResolver,
): Date | undefined {
  const explicitCreated = frontmatterCreatedDate(file)
  if (explicitCreated) return explicitCreated

  const filePath = typeof file.filePath === "string" ? file.filePath : undefined
  const resolved = resolveUploadDate?.(filePath)
  if (resolved instanceof Date && !Number.isNaN(resolved.getTime())) return resolved
  return storedCreatedDate(file)
}

function tagsFrom(file: QuartzPluginData): string[] {
  const tags = file.frontmatter?.tags
  if (typeof tags === "string") return [tags]
  if (Array.isArray(tags)) return tags.filter((tag): tag is string => typeof tag === "string")
  return []
}

export function buildStudyNotesIndex(
  files: QuartzPluginData[],
  resolveUploadDate?: GitUploadDateResolver,
): StudyNotesIndex {
  const notes = files
    .flatMap((file) => {
      if (typeof file.slug !== "string" || file.slug === "404") return []

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
          : hasCodeBlock(file.htmlAst)
            ? textFromHtml(file.htmlAst, true)
            : typeof file.description === "string"
              ? file.description
              : textFromHtml(file.htmlAst)
      const uploaded = uploadDate(file, resolveUploadDate)

      return [
        {
          slug: segments.join("/") as FullSlug,
          title,
          excerpt: summarizeNote(description),
          categoryKey,
          categoryLabel: categoryKey,
          path: folders,
          ...(uploaded ? { uploaded } : {}),
          tags: tagsFrom(file),
        },
      ]
    })
    .sort((a, b) => {
      if (a.uploaded && b.uploaded) {
        const difference = b.uploaded.getTime() - a.uploaded.getTime()
        if (difference !== 0) return difference
      } else if (a.uploaded) {
        return -1
      } else if (b.uploaded) {
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

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function selectStudyNotes(
  files: QuartzPluginData[],
): Array<StudyNoteCard & { categories: string[] }> {
  return buildStudyNotesIndex(files).notes.map((note) => ({
    ...note,
    categories: note.path,
  }))
}
