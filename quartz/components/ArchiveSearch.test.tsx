import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import ArchiveSearch from "./ArchiveSearch"

const props = (slug: string) =>
  ({
    fileData: { slug },
    allFiles: [
      {
        slug: "backend/spring/@autowired",
        frontmatter: { title: "@Autowired", tags: ["spring"] },
        description: "빈을 자동 주입합니다.",
      },
      {
        slug: "database/redis",
        frontmatter: { title: "Redis" },
        description: "인메모리 데이터 저장소입니다.",
      },
    ],
  }) as any

describe("ArchiveSearch component", () => {
  it("renders an always-visible archive input for the home page", () => {
    const html = render(ArchiveSearch(props("index")))

    assert.match(html, /class="archive-search"/)
    assert.match(html, /data-archive-search-page="home"/)
    assert.match(html, /data-archive-search-input/)
    assert.match(html, /placeholder="노트 검색"/)
    assert.match(html, /data-archive-search-results/)
  })

  it("renders direct result links for note-page dropdown search", () => {
    const html = render(ArchiveSearch(props("backend/spring/@autowired")))

    assert.match(html, /data-archive-search-page="note"/)
    assert.match(html, /data-archive-search-result/)
    assert.match(html, /@Autowired/)
    assert.match(html, /Redis/)
    assert.doesNotMatch(html, /search-container/)
  })
})
