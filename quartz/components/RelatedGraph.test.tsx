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
  it("renders a compact note-only graph without an expand control", () => {
    const html = render(RelatedGraph(props("backend/spring/bean")))

    assert.match(html, /class="related-graph"/)
    assert.match(html, /data-study-graph-current="backend\/spring\/bean"/)
    assert.match(html, /data-study-graph-preview/)
    assert.match(html, /Bean/)
    assert.match(html, /Autowired/)
    assert.doesNotMatch(html, /Redis/)
    assert.doesNotMatch(html, /data-study-graph-open/)
    assert.doesNotMatch(html, /global-graph-icon/)
  })

  it("does not render on the archive home page", () => {
    assert.equal(render(RelatedGraph(props("index"))), "")
  })
})
