import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { FullSlug } from "../util/path"
import type { StudyNoteCard } from "./study-notes"
import { limitSearchResults, matchesStudyNote, normalizeSearchText } from "./archive-search"

const note = (overrides: Partial<StudyNoteCard> = {}): StudyNoteCard => ({
  slug: "backend/spring/@autowired" as FullSlug,
  title: "@Autowired",
  excerpt: "스프링 빈을 자동으로 주입하는 애노테이션입니다.",
  categoryKey: "BACKEND",
  categoryLabel: "BACKEND",
  path: ["BACKEND", "SPRING"],
  tags: ["spring", "dependency injection"],
  ...overrides,
})

describe("archive search helpers", () => {
  it("normalizes case, unicode width, and whitespace", () => {
    assert.equal(normalizeSearchText("  Ａｕｔｏ\n  wired  "), "auto wired")
  })

  it("matches across title, excerpt, category, tags, and path", () => {
    assert.equal(matchesStudyNote(note(), "AUTOWIRED"), true)
    assert.equal(matchesStudyNote(note(), "빈 주입"), true)
    assert.equal(matchesStudyNote(note(), "DEPENDENCY"), true)
    assert.equal(matchesStudyNote(note(), "spring"), true)
    assert.equal(matchesStudyNote(note(), "backend"), true)
    assert.equal(matchesStudyNote(note(), "redis"), false)
    assert.equal(matchesStudyNote(note(), ""), false)
  })

  it("returns only matching notes and respects the result limit", () => {
    const notes = [
      note(),
      note({ slug: "backend/spring/@bean" as FullSlug, title: "@Bean" }),
      note({ slug: "database/redis" as FullSlug, title: "Redis" }),
    ]

    assert.deepEqual(
      limitSearchResults(notes, "spring", 1).map((item) => item.title),
      ["@Autowired"],
    )
    assert.deepEqual(limitSearchResults(notes, "", 8), [])
  })
})
