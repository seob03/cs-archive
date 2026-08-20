import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { buildRelatedStudyGraphData, buildStudyGraphData } from "./study-graph"

const RelatedGraph: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || slug === "index") return null

  const studyGraphData = buildStudyGraphData(allFiles)
  const graphData = buildRelatedStudyGraphData(studyGraphData, slug)
  const outlinkIds = new Set(
    studyGraphData.links.filter((link) => link.source === slug).map((link) => link.target),
  )
  const backlinkIds = new Set(
    studyGraphData.links.filter((link) => link.target === slug).map((link) => link.source),
  )
  const outlinkNotes = graphData.nodes.filter((node) => outlinkIds.has(node.id))
  const backlinkNotes = graphData.nodes.filter((node) => backlinkIds.has(node.id))
  if (graphData.nodes.length === 0 && outlinkNotes.length === 0 && backlinkNotes.length === 0) {
    return null
  }

  const safeSlug = slug.replace(/[^a-zA-Z0-9_-]+/g, "-")
  const graphId = `related-graph-${safeSlug}`
  const notesId = `related-notes-${safeSlug}`
  const renderListSection = (
    section: "outlinks" | "backlinks",
    label: string,
    notes: typeof graphData.nodes,
  ) => (
    <div class="related-notes-section" data-study-related-list-section={section}>
      <p class="related-notes-section-label">{label}</p>
      {notes.length > 0 ? (
        <ul class="related-notes-list">
          {notes.map((note) => (
            <li key={note.id}>
              <a class="internal" href={resolveRelative(slug, note.id as FullSlug)}>
                {note.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p class="related-notes-empty">없음</p>
      )}
    </div>
  )

  return (
    <section
      class="related-graph"
      data-study-graph
      data-study-graph-data={JSON.stringify(graphData)}
      data-study-graph-current={slug}
      data-study-graph-home-href={resolveRelative(slug, "index" as FullSlug)}
      aria-labelledby="related-graph-title"
    >
      <div class="related-panel-header">
        <h3 id="related-graph-title">연관 자료</h3>
      </div>
      <div class="related-panel-grid">
        <div id={graphId} class="related-graph-view">
          <div
            class="related-graph-canvas study-graph-canvas"
            data-study-graph-preview
            role="img"
            aria-label={`${graphData.nodes.length}개 연관 노트의 그래프`}
          />
        </div>
        <div id={notesId} class="related-notes-view">
          {renderListSection("outlinks", "아웃링크", outlinkNotes)}
          {renderListSection("backlinks", "백링크", backlinkNotes)}
        </div>
      </div>
    </section>
  )
}

export default RelatedGraph
