import { execFileSync } from "node:child_process"
import { realpathSync } from "node:fs"
import { isAbsolute, relative, resolve } from "node:path"

export type GitUploadDateResolver = (filePath?: string) => Date | undefined

function gitOutput(repository: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd: repository,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim()
}

export function createGitUploadDateResolver(startDirectory = process.cwd()): GitUploadDateResolver {
  let repository: string
  try {
    repository = realpathSync(gitOutput(startDirectory, ["rev-parse", "--show-toplevel"]))
  } catch {
    return () => undefined
  }

  const cache = new Map<string, Date | undefined>()

  return (filePath) => {
    if (!filePath) return undefined

    let absolutePath: string
    try {
      absolutePath = realpathSync(
        isAbsolute(filePath) ? filePath : resolve(startDirectory, filePath),
      )
    } catch {
      return undefined
    }
    if (cache.has(absolutePath)) return cache.get(absolutePath)

    const relativePath = relative(repository, absolutePath)
    if (relativePath.startsWith("..")) {
      cache.set(absolutePath, undefined)
      return undefined
    }

    try {
      const history = gitOutput(repository, [
        "log",
        "--diff-filter=A",
        "--follow",
        "--format=%cI",
        "--",
        relativePath,
      ])
      const firstAdded = history
        .split(/\r?\n/)
        .map((value) => new Date(value))
        .filter((date) => !Number.isNaN(date.getTime()))
        .at(-1)
      cache.set(absolutePath, firstAdded)
      return firstAdded
    } catch {
      cache.set(absolutePath, undefined)
      return undefined
    }
  }
}

export const resolveGitUploadDate = createGitUploadDateResolver()
