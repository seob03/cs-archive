import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { buildRelatedStudyGraphData, buildStudyGraphData } from "./study-graph"

const RelatedGraph: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || slug === "index") return null

  const graphData = buildRelatedStudyGraphData(buildStudyGraphData(allFiles), slug)
  const backlinkIds = new Set(
    graphData.links.filter((link) => link.target === slug).map((link) => link.source),
  )
  const relatedNotes = graphData.nodes.filter((node) => backlinkIds.has(node.id))
  if (graphData.nodes.length === 0 && relatedNotes.length === 0) return null

  const startsWithNotes = graphData.nodes.length === 0
  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]+/g, "-")
  const graphId = `related-graph-${safeSlug}`
  const notesId = `related-notes-${safeSlug}`

  return (
    <section
      class="related-graph"
      data-study-graph
      data-study-graph-data={JSON.stringify(graphData)}
      data-study-graph-current={slug}
      data-study-graph-home-href={resolveRelative(slug, "index" as FullSlug)}
      data-study-related-mode={startsWithNotes ? "list" : "graph"}
      aria-labelledby="related-graph-title"
    >
      <div class="related-panel-header">
        <h3 id="related-graph-title">연관 자료</h3>
        <div class="related-panel-tabs" role="group" aria-label="연관 자료 보기">
          <button
            type="button"
            class="related-panel-tab"
            data-study-related-tab="graph"
            aria-controls={graphId}
            aria-pressed={!startsWithNotes}
          >
            Graph
          </button>
          <span class="related-panel-divider" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            class="related-panel-tab"
            data-study-related-tab="list"
            aria-controls={notesId}
            aria-pressed={startsWithNotes}
          >
            List
          </button>
        </div>
      </div>
      <div
        id={graphId}
        data-study-related-view="graph"
        class="related-graph-view"
        hidden={startsWithNotes}
      >
        <div
          class="related-graph-canvas study-graph-canvas"
          data-study-graph-preview
          role="img"
          aria-label={`${graphData.nodes.length}개 연관 노트의 그래프`}
        />
      </div>
      <div
        id={notesId}
        data-study-related-view="notes"
        class="related-notes-view"
        hidden={!startsWithNotes}
      >
        {relatedNotes.length > 0 ? (
          <ul class="related-notes-list">
            {relatedNotes.map((note) => (
              <li>
                <a class="internal" href={resolveRelative(slug, note.id as FullSlug)}>
                  {note.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p class="related-notes-empty">연관 노트가 없습니다.</p>
        )}
      </div>
    </section>
  )
}

export default RelatedGraph
