import { basename } from "node:path"

export type NotionLinkNormalization = {
  content: string
  replacements: number
}

const importerSuffix = /^(.*) \d+$/

function normalizePath(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\.md$/i, "")
}

function splitFragment(target: string): { noteTarget: string; fragment: string } {
  const fragmentStart = target.search(/[#!^]/)
  if (fragmentStart < 0) return { noteTarget: target, fragment: "" }

  return {
    noteTarget: target.slice(0, fragmentStart),
    fragment: target.slice(fragmentStart),
  }
}

function splitAlias(link: string): { target: string; alias: string | undefined } {
  const aliasStart = link.indexOf("|")
  if (aliasStart < 0) return { target: link, alias: undefined }

  return {
    target: link.slice(0, aliasStart),
    alias: link.slice(aliasStart + 1),
  }
}

export function normalizeNotionLinks(content: string, notePaths: readonly string[]): NotionLinkNormalization {
  const normalizedPaths = notePaths.map(normalizePath)
  const exactPaths = new Set(normalizedPaths)
  const titles = new Map<string, string[]>()

  for (const notePath of normalizedPaths) {
    const title = basename(notePath)
    const candidates = titles.get(title) ?? []
    candidates.push(notePath)
    titles.set(title, candidates)
  }

  let replacements = 0
  const nextContent = content.replace(/(?<!!)\[\[([^\]\n]+)\]\]/g, (whole, rawLink: string) => {
    const { target, alias } = splitAlias(rawLink)
    const { noteTarget, fragment } = splitFragment(target)
    const normalizedTarget = normalizePath(noteTarget)
    const suffixMatch = normalizedTarget.match(importerSuffix)

    if (!suffixMatch) return whole

    const canonicalTarget = suffixMatch[1]
    const exactTargetExists = normalizedTarget.includes("/")
      ? exactPaths.has(normalizedTarget)
      : (titles.get(normalizedTarget)?.length ?? 0) > 0
    if (exactTargetExists) return whole

    const canonicalExists = canonicalTarget.includes("/")
      ? exactPaths.has(canonicalTarget)
      : (titles.get(canonicalTarget)?.length ?? 0) === 1
    if (!canonicalExists) return whole

    replacements++
    const nextAlias = alias === noteTarget ? canonicalTarget : alias
    const aliasPart = nextAlias === undefined ? "" : `|${nextAlias}`
    return `[[${canonicalTarget}${fragment}${aliasPart}]]`
  })

  return { content: nextContent, replacements }
}
