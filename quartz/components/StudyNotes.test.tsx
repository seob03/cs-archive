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
        filePath: "/missing/content/backend/spring/@bean.md",
        frontmatter: { title: "@Bean" },
        description: "Register a bean.",
        dates: {
          created: new Date("2026-08-12T00:00:00.000Z"),
          modified: new Date("2026-08-15T00:00:00.000Z"),
        },
      },
      {
        slug: "backend/spring/lifecycle",
        filePath: "/missing/content/backend/spring/lifecycle.md",
        frontmatter: { title: "Bean lifecycle" },
        description: "Follow a bean from creation to destruction.",
        dates: {
          created: new Date("2026-08-10T00:00:00.000Z"),
          modified: new Date("2026-08-13T00:00:00.000Z"),
        },
      },
      {
        slug: "database/redis/transactions",
        filePath: "/missing/content/database/redis/transactions.md",
        frontmatter: { title: "Redis transactions" },
        description: "Understand Redis transaction boundaries.",
        dates: {
          created: new Date("2026-08-11T00:00:00.000Z"),
          modified: new Date("2026-08-14T00:00:00.000Z"),
        },
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
    assert.match(html, /class="study-graph"/)
    assert.match(html, /class="study-activity"/)
    assert.match(html, /data-study-activity-grid/)
    assert.equal((html.match(/class="study-activity-cell/g) ?? []).length, 24 * 7)
    assert.doesNotMatch(html, /class="study-graph-preview study-graph-canvas"/)
    assert.doesNotMatch(html, /class="study-graph-heading"/)
    assert.doesNotMatch(html, /class="study-graph-kicker"/)
    assert.doesNotMatch(html, /class="study-graph-title"/)
    assert.doesNotMatch(html, /class="study-graph-button"/)
    assert.match(html, /data-study-activity-date="2026-08-12"/)
    assert.match(html, /data-study-activity-tooltip="2026-08-12 · 1개 노트"/)
    assert.match(html, /data-study-graph-data=/)
    assert.match(html, /data-study-graph-overlay/)
    assert.match(html, /data-study-graph-category="ALL"/)
    assert.match(html, /data-study-graph-category="BACKEND"/)
    assert.match(html, /data-study-graph-category="DATABASE"/)
    assert.match(html, /KNOWLEDGE GRAPH/)
    assert.match(html, /PERSONAL KNOWLEDGE BASE/)
    assert.match(html, /Seob's <span class="study-hero-accent">CS<\/span> STUDY ARCHIVE/)
    assert.match(html, /배운 것을 오래 남기는 공간/)
    assert.match(html, /3 NOTES PUBLISHED/)
    assert.match(html, /2 CATEGORIES/)
    assert.match(html, /class="study-category-bar" aria-label="노트 카테고리"/)
    assert.match(html, /data-study-filter="ALL"[^>]*>ALL.*?<span>3<\/span>/)
    assert.match(html, /data-study-filter="BACKEND"[^>]*>BACKEND.*?<span>2<\/span>/)
    assert.match(html, /data-study-filter="DATABASE"[^>]*>DATABASE.*?<span>1<\/span>/)
    assert.match(html, /data-study-filter="BACKEND"[^>]*style="--study-category-color: #37c99b"/)
    assert.match(html, /class="study-card-grid"/)
    assert.match(html, /data-study-search=/)
    assert.match(html, /data-study-empty/)
    assert.doesNotMatch(html, /study-card is-featured/)
    assert.match(html, /class="study-card internal"[^>]*data-study-category="DATABASE"/)
    assert.match(html, /data-study-category="DATABASE"[^>]*style="--study-category-color: #54a8ff"/)
    assert.match(html, /data-study-date="2026-08-12"/)
    assert.match(html, /class="study-card-badge">BACKEND/)
    assert.match(html, /class="study-card-date">2026-08-12/)
    assert.match(html, /class="study-card-title">@Bean/)
    assert.match(html, /class="study-card-excerpt">Register a bean\./)
    assert.match(html, /class="study-card-path">BACKEND \/ SPRING/)
    assert.doesNotMatch(html, /study-note-card-number/)
    assert.doesNotMatch(html, /study-note-card-arrow/)
    assert.doesNotMatch(html, /study-graph-button-mark/)
    assert.doesNotMatch(html, /min read/)
    const afterDOMLoaded = String(StudyNotes.afterDOMLoaded)
    assert.match(afterDOMLoaded, /activeActivityDate/)
    assert.match(afterDOMLoaded, /data-study-activity-cell/)
    assert.match(afterDOMLoaded, /data-study-date/)
    assert.match(
      afterDOMLoaded,
      /const isActive = !activeActivityDate && button\.getAttribute\("data-study-filter"\) === filter/,
    )
    assert.match(
      afterDOMLoaded,
      /activeActivityDate = activeActivityDate === date \? "" : date[\s\S]*?applyFilter\("ALL"\)/,
    )
    assert.match(
      afterDOMLoaded,
      /activeActivityDate = ""[\s\S]*?applyFilter\(button\.getAttribute\("data-study-filter"\) \|\| "ALL"\)/,
    )
  })
})
