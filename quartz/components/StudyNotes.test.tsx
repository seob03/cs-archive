import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import StudyNotes from "./StudyNotes"

const props = (slug: string) =>
  ({
    fileData: { slug },
    allFiles: [
      {
        slug: "backend/spring/@bean",
        frontmatter: { title: "@Bean" },
        description: "Register a bean.",
      },
    ],
  }) as any

describe("StudyNotes component", () => {
  it("does not render on a note page", () => {
    assert.equal(render(StudyNotes(props("backend/spring/@bean"))), "")
  })

  it("renders filters and the card title/excerpt on the home page", () => {
    const html = render(StudyNotes(props("index")))

    assert.match(html, /study-notes-filters/)
    assert.match(html, /@Bean/)
    assert.match(html, /Register a bean\./)
  })
})
