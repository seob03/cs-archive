import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { buildRelatedStudyGraphData, buildStudyGraphData, buildStudyGraphHref } from "./study-graph"

const file = (slug: string, title: string, links: string[] = []) =>
  ({
    slug,
    frontmatter: { title },
    links,
  }) as any

describe("study graph data", () => {
  it("keeps only note pages and removes folder, tag, and virtual nodes", () => {
    const graph = buildStudyGraphData([
      file("index", "Home"),
      file("backend/index", "BACKEND"),
      file("backend/spring/index", "SPRING"),
      file("tags/index", "태그 목록"),
      file("backend/spring/@bean", "@Bean", ["backend/spring/@autowired", "backend/index"]),
      file("backend/spring/@autowired", "@Autowired"),
    ])

    assert.deepEqual(
      graph.nodes.map((node) => node.id),
      ["backend/spring/@bean", "backend/spring/@autowired"],
    )
    assert.deepEqual(graph.links, [
      {
        source: "backend/spring/@bean",
        target: "backend/spring/@autowired",
      },
    ])
    assert.ok(!graph.nodes.some((node) => node.id.startsWith("tags/")))
  })

  it("uses one stable color for each category", () => {
    const graph = buildStudyGraphData([
      file("backend/spring/bean", "Bean"),
      file("backend/spring/autowired", "Autowired"),
      file("database/redis", "Redis"),
    ])

    const backendColors = graph.nodes
      .filter((node) => node.category === "BACKEND")
      .map((node) => node.color)
    const databaseColor = graph.nodes.find((node) => node.category === "DATABASE")?.color

    assert.equal(new Set(backendColors).size, 1)
    assert.notEqual(backendColors[0], databaseColor)
  })
})

describe("study graph links", () => {
  it("resolves note links from the site home for local and GitHub Pages URLs", () => {
    assert.equal(
      buildStudyGraphHref("backend/spring/@bean", "http://localhost:8080/"),
      "http://localhost:8080/backend/spring/@bean",
    )
    assert.equal(
      buildStudyGraphHref("backend/spring/@bean", "https://seob03.github.io/cs-note/"),
      "https://seob03.github.io/cs-note/backend/spring/@bean",
    )
  })

  it("does not duplicate the configured GitHub Pages base path", () => {
    assert.equal(
      buildStudyGraphHref("/cs-note/backend/spring/@bean", "https://seob03.github.io/cs-note/"),
      "https://seob03.github.io/cs-note/backend/spring/@bean",
    )
  })
})

describe("related study graph", () => {
  it("keeps the current note and its direct neighbors only", () => {
    const graph = buildStudyGraphData([
      file("backend/spring/bean", "Bean", ["backend/spring/autowired"]),
      file("backend/spring/autowired", "Autowired", ["backend/spring/component"]),
      file("backend/spring/component", "Component"),
      file("database/redis", "Redis"),
    ])

    const related = buildRelatedStudyGraphData(graph, "backend/spring/autowired")

    assert.deepEqual(
      related.nodes.map((node) => node.id),
      ["backend/spring/bean", "backend/spring/autowired", "backend/spring/component"],
    )
    assert.deepEqual(related.links, [
      { source: "backend/spring/bean", target: "backend/spring/autowired" },
      { source: "backend/spring/autowired", target: "backend/spring/component" },
    ])
    assert.equal(new Set(related.nodes.map((node) => node.color)).size, 1)
  })

  it("returns an empty graph when the current page is not a note node", () => {
    const graph = buildStudyGraphData([file("backend/spring/bean", "Bean")])

    assert.deepEqual(buildRelatedStudyGraphData(graph, "backend/index"), {
      nodes: [],
      links: [],
    })
  })
})
