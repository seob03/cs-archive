import { afterEach, describe, it } from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { tmpdir } from "node:os"
import { createGitUploadDateResolver } from "./git-upload-date"

const temporaryDirectories: string[] = []

function temporaryDirectory(prefix: string): string {
  const directory = mkdtempSync(join(tmpdir(), prefix))
  temporaryDirectories.push(directory)
  return directory
}

function git(repository: string, args: string[], date?: string): void {
  execFileSync("git", args, {
    cwd: repository,
    env: date
      ? {
          ...process.env,
          GIT_AUTHOR_DATE: date,
          GIT_COMMITTER_DATE: date,
        }
      : process.env,
    stdio: "ignore",
  })
}

function commit(repository: string, message: string, date: string): void {
  git(repository, ["add", "--all"])
  git(repository, ["commit", "-m", message], date)
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe("Git upload dates", () => {
  it("keeps the first-added date after later edits", () => {
    const repository = temporaryDirectory("quartz-upload-date-")
    const notePath = join(repository, "content", "BACKEND", "note.md")
    mkdirSync(dirname(notePath), { recursive: true })
    git(repository, ["init"])
    git(repository, ["config", "user.name", "Quartz Test"])
    git(repository, ["config", "user.email", "quartz@example.com"])

    writeFileSync(notePath, "# First version\n")
    commit(repository, "add note", "2026-08-01T09:00:00Z")
    writeFileSync(notePath, "# Edited later\n")
    commit(repository, "edit note", "2026-08-10T12:30:00Z")

    const resolveUploadDate = createGitUploadDateResolver(repository)

    assert.equal(resolveUploadDate(notePath)?.toISOString(), "2026-08-01T09:00:00.000Z")
  })

  it("returns undefined when Git history is unavailable", () => {
    const directory = temporaryDirectory("quartz-no-git-")
    const notePath = join(directory, "note.md")
    writeFileSync(notePath, "# Untracked\n")

    const resolveUploadDate = createGitUploadDateResolver(directory)

    assert.equal(resolveUploadDate(notePath), undefined)
  })
})
