import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { buildRelatedStudyGraphData, buildStudyGraphData } from "./study-graph"

const RelatedGraph: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const slug = fileData.slug
  if (!slug || slug === "index") return null

  const graphData = buildRelatedStudyGraphData(buildStudyGraphData(allFiles), slug)
  if (graphData.nodes.length === 0) return null

  return (
    <section
      class="related-graph"
      data-study-graph
      data-study-graph-data={JSON.stringify(graphData)}
      data-study-graph-current={slug}
      data-study-graph-home-href={resolveRelative(slug, "index" as FullSlug)}
      aria-labelledby="related-graph-title"
    >
      <h3 id="related-graph-title">연관 그래프</h3>
      <div
        class="related-graph-canvas study-graph-canvas"
        data-study-graph-preview
        role="img"
        aria-label={`${graphData.nodes.length}개 연관 노트의 그래프`}
      />
    </section>
  )
}

export default RelatedGraph
