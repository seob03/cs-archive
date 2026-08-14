import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { selectStudyNotes, summarizeNote } from "./study-notes"

describe("study note data", () => {
  it("selects Spring notes, excludes folder indexes, and sorts by title", () => {
    const cards = selectStudyNotes([
      { slug: "backend/spring/z-note", frontmatter: { title: "Z note" }, description: "z" },
      { slug: "backend/spring/index", frontmatter: { title: "Spring" }, description: "folder" },
      { slug: "backend/spring/a-note", frontmatter: { title: "A note" }, description: "a" },
      { slug: "backend/other-note", frontmatter: { title: "Other" }, description: "other" },
    ])

    assert.deepEqual(
      cards.map((card) => card.title),
      ["A note", "Z note"],
    )
    assert.deepEqual(cards[0]?.categories, ["BACKEND", "SPRING"])
  })

  it("normalizes HTML entities and whitespace in a preview", () => {
    const excerpt = summarizeNote("A &quot;useful&quot; note\nwith extra spacing", "fallback")

    assert.equal(excerpt, 'A "useful" note with extra spacing')
  })
})
