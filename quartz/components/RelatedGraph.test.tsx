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

describe("RelatedGraph component", () => {
  it("renders a compact graph with a toggleable related-notes view", () => {
    const html = render(RelatedGraph(props("backend/spring/bean")))

    assert.match(html, /class="related-graph"/)
    assert.match(html, /data-study-graph-current="backend\/spring\/bean"/)
    assert.match(html, /data-study-graph-preview/)
    assert.match(html, /data-study-related-toggle/)
    assert.match(html, /data-study-related-view="notes"/)
    assert.match(html, /연관 노트가 없습니다\./)
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

  it("does not render on the archive home page", () => {
    assert.equal(render(RelatedGraph(props("index"))), "")
  })
})
