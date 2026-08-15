import { QuartzPluginData } from "../plugins/vfile"

export type StudyGraphNode = {
  id: string
  title: string
  category: string
  color: string
}

export type StudyGraphLink = {
  source: string
  target: string
}

export type StudyGraphData = {
  nodes: StudyGraphNode[]
  links: StudyGraphLink[]
}

const categoryPalette = [
  "#37c99b",
  "#54a8ff",
  "#ff9c52",
  "#8c83ff",
  "#ed729c",
  "#a8d94f",
  "#f0c94d",
  "#b68cff",
]

const categoryColors: Record<string, string> = {
  BACKEND: "#37c99b",
  DATABASE: "#54a8ff",
  FRONTEND: "#ff9c52",
  INFRA: "#2cc7b5",
  NETWORK: "#8c83ff",
  OS: "#b68cff",
  DAILY: "#f0c94d",
  STUDY: "#ed729c",
  ALGO: "#a8d94f",
  "DS&A": "#f2778d",
}

function normalizeGraphSlug(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const withoutAnchor = value.trim().split("#", 1)[0]
  const segments = withoutAnchor
    .replace(/^\/+/, "")
    .replace(/\.html?$/, "")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments[0]?.toLowerCase() === "cs-note") segments.shift()
  return segments.length > 0 ? segments.join("/") : undefined
}

export function isStudyGraphNoteSlug(slug: unknown): slug is string {
  const normalized = normalizeGraphSlug(slug)
  if (!normalized || normalized === "404" || normalized === "index") return false
  if (normalized === "tags" || normalized.startsWith("tags/")) return false
  return !normalized.endsWith("/index")
}

export function categoryColor(category: string): string {
  const normalized = category.trim().toUpperCase() || "GENERAL"
  const knownColor = categoryColors[normalized]
  if (knownColor) return knownColor

  let hash = 0
  for (const character of normalized) hash = (hash * 31 + character.charCodeAt(0)) | 0
  return categoryPalette[Math.abs(hash) % categoryPalette.length]
}

function noteTitle(file: QuartzPluginData, slug: string): string {
  const frontmatter = file.frontmatter as { title?: unknown } | undefined
  if (typeof frontmatter?.title === "string" && frontmatter.title.trim()) {
    return frontmatter.title.trim()
  }

  return slug.split("/").at(-1) ?? "Untitled note"
}

export function buildStudyGraphData(files: QuartzPluginData[]): StudyGraphData {
  const noteFiles = files.flatMap((file) => {
    const slug = normalizeGraphSlug(file.slug)
    return isStudyGraphNoteSlug(slug) && slug ? [{ file, slug }] : []
  })
  const noteIds = new Set(noteFiles.map(({ slug }) => slug))

  const nodes = noteFiles.map(({ file, slug }) => {
    const category = slug.split("/")[0]?.toUpperCase() || "GENERAL"
    return {
      id: slug,
      title: noteTitle(file, slug),
      category,
      color: categoryColor(category),
    }
  })

  const seenLinks = new Set<string>()
  const links: StudyGraphLink[] = []
  for (const { file, slug: source } of noteFiles) {
    const rawLinks = Array.isArray(file.links) ? file.links : []
    for (const rawTarget of rawLinks) {
      const target = normalizeGraphSlug(rawTarget)
      if (!target || !noteIds.has(target) || target === source) continue

      const linkKey = `${source}->${target}`
      if (seenLinks.has(linkKey)) continue
      seenLinks.add(linkKey)
      links.push({ source, target })
    }
  }

  return { nodes, links }
}

export function buildRelatedStudyGraphData(
  graph: StudyGraphData,
  currentSlug: string,
  depth = 1,
): StudyGraphData {
  const current = normalizeGraphSlug(currentSlug)
  const nodeIds = new Set(graph.nodes.map((node) => node.id))
  if (!current || !nodeIds.has(current)) return { nodes: [], links: [] }

  const included = new Set([current])
  let frontier = new Set([current])
  for (let level = 0; level < Math.max(0, depth); level += 1) {
    const next = new Set<string>()
    for (const link of graph.links) {
      if (frontier.has(link.source) && !included.has(link.target)) next.add(link.target)
      if (frontier.has(link.target) && !included.has(link.source)) next.add(link.source)
    }
    for (const nodeId of next) included.add(nodeId)
    frontier = next
  }

  return {
    nodes: graph.nodes.filter((node) => included.has(node.id)),
    links: graph.links.filter((link) => included.has(link.source) && included.has(link.target)),
  }
}

export function buildStudyGraphHref(slug: string, homeHref: string): string {
  const normalizedSlug = normalizeGraphSlug(slug) ?? ""
  const fallbackOrigin = "http://localhost:8080/"
  const home = new URL(homeHref, fallbackOrigin)
  const homePath = home.pathname.endsWith("/") ? home.pathname : `${home.pathname}/`
  const baseSegments = homePath.split("/").filter(Boolean)
  const targetSegments = normalizedSlug.split("/").filter(Boolean)

  if (
    baseSegments.length > 0 &&
    targetSegments.slice(0, baseSegments.length).join("/") === baseSegments.join("/")
  ) {
    targetSegments.splice(0, baseSegments.length)
  }

  const targetRoot = new URL(homePath, home.origin)
  return new URL(targetSegments.join("/"), targetRoot).toString()
}
