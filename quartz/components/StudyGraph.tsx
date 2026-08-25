import { StudyGraphData } from "./study-graph"
import { buildStudyActivityGrid } from "./study-activity"
import type { StudyNoteCard } from "./study-notes"

type StudyGraphProps = {
  noteCount: number
  graphData: StudyGraphData
  notes: StudyNoteCard[]
  referenceDate?: Date
}

const StudyGraph = ({ noteCount, graphData, notes, referenceDate }: StudyGraphProps) => {
  const categories = Array.from(
    graphData.nodes.reduce((counts, node) => {
      counts.set(node.category, (counts.get(node.category) ?? 0) + 1)
      return counts
    }, new Map<string, number>()),
  ).sort(([left], [right]) => left.localeCompare(right))
  const activity = buildStudyActivityGrid(notes, undefined, referenceDate)

  return (
    <aside
      class="study-graph"
      data-study-graph
      data-study-graph-data={JSON.stringify(graphData)}
      aria-label="Knowledge graph"
    >
      <div class="study-activity" data-study-activity>
        <p class="study-activity-label">ACTIVITY</p>
        <div
          class="study-activity-grid"
          data-study-activity-grid
          role="group"
          aria-label={`${noteCount}개 노트 등록 활동`}
        >
          {activity.map((week, weekIndex) => (
            <div class="study-activity-week" key={`week-${weekIndex}`}>
              {week.map((day) =>
                day.isFuture ? (
                  <span
                    class="study-activity-cell is-future"
                    data-study-activity-future
                    aria-hidden="true"
                    key={day.date}
                  />
                ) : (
                  <button
                    class={`study-activity-cell level-${day.level}`}
                    data-study-activity-cell
                    data-study-activity-date={day.date}
                    data-study-activity-tooltip={`${day.date} · ${day.count}개 노트`}
                    type="button"
                    aria-pressed={false}
                    key={day.date}
                    aria-label={`${day.date}: ${day.count}개 노트`}
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
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
