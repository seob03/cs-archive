import { StudyGraphData } from "./study-graph"

type StudyGraphProps = {
  noteCount: number
  graphData: StudyGraphData
}

const StudyGraph = ({ noteCount, graphData }: StudyGraphProps) => {
  const categories = Array.from(
    graphData.nodes.reduce((counts, node) => {
      counts.set(node.category, (counts.get(node.category) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  ).sort(([left], [right]) => left.localeCompare(right))

  return (
    <aside
      class="study-graph"
      data-study-graph
      data-study-graph-data={JSON.stringify(graphData)}
      aria-label="Knowledge graph"
    >
      <div class="study-graph-heading">
        <div>
          <p class="study-graph-kicker">RELATIONSHIPS</p>
          <p class="study-graph-title">KNOWLEDGE GRAPH</p>
        </div>
        <button
          class="study-graph-button"
          data-study-graph-open
          type="button"
          aria-label="Open knowledge graph"
          aria-haspopup="dialog"
        >
          Graph
        </button>
      </div>
      <div
        class="study-graph-preview study-graph-canvas"
        data-study-graph-preview
        role="img"
        aria-label={`${noteCount}개 노트의 관계 그래프`}
      />
      <div class="study-graph-overlay" data-study-graph-overlay aria-hidden="true" hidden>
        <div class="study-graph-full-header">
          <a class="study-graph-home internal" data-study-graph-home href="./">
            ← Home
          </a>
          <strong>KNOWLEDGE GRAPH</strong>
          <span data-study-graph-count>{noteCount} notes</span>
          <button
            class="study-graph-close"
            data-study-graph-close
            type="button"
            aria-label="Close knowledge graph"
          >
            ×
          </button>
        </div>
        <nav class="study-graph-filter-bar" aria-label="그래프 카테고리">
          <button
            class="study-graph-filter is-active"
            data-study-graph-category="ALL"
            type="button"
            aria-pressed="true"
          >
            ALL <span>{noteCount}</span>
          </button>
          {categories.map(([category, count]) => (
            <button
              class="study-graph-filter"
              data-study-graph-category={category}
              type="button"
              aria-pressed="false"
            >
              {category} <span>{count}</span>
            </button>
          ))}
        </nav>
        <div class="study-graph-full-canvas study-graph-canvas" data-study-graph-full />
      </div>
    </aside>
  )
}

export default StudyGraph
