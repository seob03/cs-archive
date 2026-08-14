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
        dates: { modified: new Date("2026-08-15T00:00:00.000Z") },
      },
      {
        slug: "backend/spring/lifecycle",
        frontmatter: { title: "Bean lifecycle" },
        description: "Follow a bean from creation to destruction.",
        dates: { modified: new Date("2026-08-13T00:00:00.000Z") },
      },
      {
        slug: "database/redis/transactions",
        frontmatter: { title: "Redis transactions" },
        description: "Understand Redis transaction boundaries.",
        dates: { modified: new Date("2026-08-14T00:00:00.000Z") },
      },
    ],
  }) as any

describe("StudyNotes component", () => {
  it("does not render on a note page", () => {
    assert.equal(render(StudyNotes(props("backend/spring/@bean"))), "")
  })

  it("renders the dynamic study catalog structure on the home page", () => {
    const html = render(StudyNotes(props("index")))

    assert.match(html, /class="study-home"/)
    assert.match(html, /class="study-hero"/)
    assert.match(html, /배운 CS를 오래 남기는 공간/)
    assert.match(html, /study-hero-accent/)
    assert.match(html, /3 NOTES PUBLISHED/)
    assert.match(html, /2 CATEGORIES/)
    assert.match(html, /class="study-category-bar" aria-label="노트 카테고리"/)
    assert.match(html, /data-study-filter="ALL"[^>]*>ALL.*?<span>3<\/span>/)
    assert.match(html, /data-study-filter="BACKEND"[^>]*>BACKEND.*?<span>2<\/span>/)
    assert.match(html, /data-study-filter="DATABASE"[^>]*>DATABASE.*?<span>1<\/span>/)
    assert.match(html, /class="study-card-grid"/)
    assert.match(html, /class="study-card is-featured internal"[^>]*data-study-category="BACKEND"/)
    assert.match(html, /class="study-card internal"[^>]*data-study-category="DATABASE"/)
    assert.doesNotMatch(
      html,
      /class="study-card is-featured internal"[^>]*data-study-category="DATABASE"/,
    )
    assert.match(html, /class="study-card-badge">BACKEND/)
    assert.match(html, /class="study-card-date">2026-08-15/)
    assert.match(html, /class="study-card-title">@Bean/)
    assert.match(html, /class="study-card-excerpt">Register a bean\./)
    assert.match(html, /class="study-card-path">BACKEND \/ SPRING/)
    assert.doesNotMatch(html, /study-note-card-number/)
    assert.doesNotMatch(html, /study-note-card-arrow/)
    assert.doesNotMatch(html, /↗/)
  })
})
