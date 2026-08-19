import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import RelatedGraph from "./RelatedGraph"

const props = (slug: string) =>
  ({
    fileData: { slug },
    allFiles: [
      {
        slug: "backend/spring/bean",
        frontmatter: { title: "Bean" },
        links: ["backend/spring/autowired"],
      },
      {
        slug: "backend/spring/autowired",
        frontmatter: { title: "Autowired" },
        links: [],
      },
      {
        slug: "database/redis",
        frontmatter: { title: "Redis" },
        links: [],
      },
    ],
  }) as any

const bidirectionalProps = () =>
  ({
    fileData: { slug: "backend/spring/bean" },
    allFiles: [
      {
        slug: "backend/spring/bean",
        frontmatter: { title: "Bean" },
        links: ["backend/spring/autowired"],
      },
      {
        slug: "backend/spring/autowired",
        frontmatter: { title: "Autowired" },
        links: ["backend/spring/bean"],
      },
    ],
  }) as any

describe("RelatedGraph component", () => {
  it("renders independent Graph and List tabs for the related material", () => {
    const html = render(RelatedGraph(props("backend/spring/bean")))

    assert.match(html, /class="related-graph"/)
    assert.match(html, /data-study-graph-current="backend\/spring\/bean"/)
    assert.match(html, /data-study-graph-preview/)
    assert.match(html, /class="related-panel-tabs"/)
    assert.match(html, /data-study-related-tab="graph"/)
    assert.match(html, /data-study-related-tab="list"/)
    assert.match(html, />Graph<\/button>/)
    assert.match(html, />List<\/button>/)
    assert.doesNotMatch(html, /data-study-related-toggle/)
    assert.doesNotMatch(html, /참고 노트 보기|그래프 보기/)
    assert.match(html, /data-study-related-view="notes"/)
    assert.match(html, /없음/)
    assert.match(html, /Bean/)
    assert.match(html, /Autowired/)
    assert.doesNotMatch(html, /Redis/)
    assert.doesNotMatch(html, /data-study-graph-open/)
    assert.doesNotMatch(html, /global-graph-icon/)
  })

  it("renders incoming related notes inside the same panel", () => {
    const html = render(RelatedGraph(props("backend/spring/autowired")))

    assert.match(html, /data-study-related-view="notes"/)
    assert.match(html, /related-notes-list/)
    assert.match(html, /href="\.\.\/\.\.\/backend\/spring\/bean"/)
    assert.match(html, />Bean<\/a>/)
  })

  it("keeps the list tab available when a note has no incoming links", () => {
    const html = render(RelatedGraph(props("backend/spring/bean")))

    assert.match(html, /data-study-related-tab="list"/)
    assert.match(html, /없음/)
  })

  it("shows outlinks and backlinks as separate List sections", () => {
    const html = render(RelatedGraph(bidirectionalProps()))

    assert.match(html, /data-study-related-list-section="outlinks"/)
    assert.match(html, /data-study-related-list-section="backlinks"/)
    assert.match(html, />아웃링크<\//)
    assert.match(html, />백링크<\//)
    assert.match(html, /related-notes-list/)
    assert.match(html, /Autowired/)
  })

  it("does not render on the archive home page", () => {
    assert.equal(render(RelatedGraph(props("index"))), "")
  })
})
