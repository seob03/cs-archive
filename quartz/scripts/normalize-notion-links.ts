import { readdir, readFile, writeFile } from "node:fs/promises"
import { join, relative, resolve } from "node:path"
import { normalizeNotionLinks } from "../util/notion-links"

type FileEntry = { absolutePath: string; relativePath: string }

async function collectMarkdownFiles(root: string, directory = root): Promise<FileEntry[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files: FileEntry[] = []

  for (const entry of entries) {
    if (entry.name === ".trash") continue

    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(root, absolutePath)))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push({ absolutePath, relativePath: relative(root, absolutePath) })
    }
  }

  return files
}

const contentRoot = resolve(process.argv[2] ?? "content")
const files = await collectMarkdownFiles(contentRoot)
const notePaths = files.map((file) => file.relativePath)
let changedFiles = 0
let replacements = 0

for (const file of files) {
  const content = await readFile(file.absolutePath, "utf8")
  const normalized = normalizeNotionLinks(content, notePaths)

  if (normalized.content === content) continue

  await writeFile(file.absolutePath, normalized.content, "utf8")
  changedFiles++
  replacements += normalized.replacements
}

if (replacements === 0) {
  console.log("No importer-suffixed links found.")
} else {
  console.log(`Normalized ${replacements} links in ${changedFiles} files.`)
}
