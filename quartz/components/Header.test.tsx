import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import HeaderConstructor from "./Header"

const Header = HeaderConstructor()

const props = (slug: string) =>
  ({
    fileData: { slug },
    children: [],
  }) as any

describe("global header", () => {
  it("renders the graph action on the home page", () => {
    const html = render(
      Header({
        ...props("index"),
        children: [<span class="archive-search" />],
      }),
    )

    assert.match(html, /data-study-graph-header-open/)
    assert.match(html, /aria-label="Open knowledge graph"/)
  })

  it("does not render the home-only graph action on note pages", () => {
    const html = render(Header(props("backend/spring/@bean")))

    assert.doesNotMatch(html, /data-study-graph-header-open/)
  })
})
