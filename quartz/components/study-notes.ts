import { QuartzPluginData } from "../plugins/vfile"
import { unescapeHTML } from "../util/escape"
import { FullSlug } from "../util/path"

export type StudyNoteCard = {
  slug: FullSlug
  title: string
  excerpt: string
  categories: string[]
}

const studyNotesPrefix = "backend/spring/"
const excerptLimit = 150

export function summarizeNote(description?: string, fallback = "노트 내용을 열어보세요."): string {
  const normalized = unescapeHTML(description ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (!normalized) return fallback
  if (normalized.length <= excerptLimit) return normalized

  return `${normalized.slice(0, excerptLimit - 1).trimEnd()}…`
}

export function selectStudyNotes(files: QuartzPluginData[]): StudyNoteCard[] {
  return files
    .filter(
      (file): file is QuartzPluginData & { slug: FullSlug } =>
        typeof file.slug === "string" &&
        file.slug.startsWith(studyNotesPrefix) &&
        !file.slug.endsWith("/index"),
    )
    .map((file) => {
      const segments = file.slug.split("/")
      const title = file.frontmatter?.title ?? segments.at(-1) ?? "Untitled note"

      return {
        slug: file.slug,
        title,
        excerpt: summarizeNote(file.description),
        categories: segments.slice(0, 2).map((segment) => segment.toUpperCase()),
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ko"))
}
