import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { selectStudyNotes } from "./study-notes"

const filters = [
  { value: "all", label: "ALL NOTES" },
  { value: "backend", label: "BACKEND" },
  { value: "spring", label: "SPRING" },
]

const studyNotesScript = `
const initStudyNotes = () => {
  const root = document.querySelector(".study-notes")
  if (!root || root.dataset.studyNotesReady === "true") return

  const filterButtons = Array.from(root.querySelectorAll("[data-study-filter]"))
  const cards = Array.from(root.querySelectorAll("[data-study-card]"))
  const count = root.querySelector("[data-study-count]")
  const empty = root.querySelector("[data-study-empty]")

  const applyFilter = (filter) => {
    let visible = 0

    for (const card of cards) {
      const categories = (card.getAttribute("data-categories") || "").split(" ")
      const shouldShow = filter === "all" || categories.includes(filter)
      card.hidden = !shouldShow
      if (shouldShow) visible += 1
    }

    for (const button of filterButtons) {
      const isActive = button.getAttribute("data-study-filter") === filter
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", String(isActive))
    }

    if (count) count.textContent = visible + " NOTES"
    if (empty) empty.hidden = visible !== 0
  }

  const onClick = (event) => {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest("[data-study-filter]")
    if (!button) return
    applyFilter(button.getAttribute("data-study-filter") || "all")
  }

  root.addEventListener("click", onClick)
  root.dataset.studyNotesReady = "true"
  const activeFilter = root.querySelector("[data-study-filter].is-active")
  applyFilter(activeFilter?.getAttribute("data-study-filter") || "all")

  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => root.removeEventListener("click", onClick))
  }
}

document.addEventListener("nav", initStudyNotes)
document.addEventListener("render", initStudyNotes)
initStudyNotes()
`

const StudyNotes: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null

  const notes = selectStudyNotes(allFiles)

  return (
    <section class="study-notes" aria-labelledby="study-notes-title">
      <div class="study-notes-heading">
        <div>
          <p class="study-notes-eyebrow">BACKEND / SPRING</p>
          <h1 id="study-notes-title">Study notes</h1>
        </div>
        <span class="study-notes-count" data-study-count>
          {notes.length} NOTES
        </span>
      </div>

      <nav class="study-notes-filters" aria-label="Note categories">
        {filters.map((filter, index) => (
          <button
            type="button"
            class={`study-notes-filter${index === 0 ? " is-active" : ""}`}
            data-study-filter={filter.value}
            aria-pressed={index === 0}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      <div class="study-notes-grid">
        {notes.map((note, index) => (
          <a
            class="study-note-card internal"
            data-study-card
            data-categories={note.categories.map((category) => category.toLowerCase()).join(" ")}
            href={resolveRelative(fileData.slug!, note.slug)}
            title={note.title}
          >
            <span class="study-note-card-number">{String(index + 1).padStart(2, "0")}</span>
            <span class="study-note-card-body">
              <span class="study-note-card-path">{note.categories.join(" / ")}</span>
              <span class="study-note-card-title">{note.title}</span>
              <span class="study-note-card-excerpt">{note.excerpt}</span>
            </span>
            <span class="study-note-card-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>

      <p class="study-notes-empty" data-study-empty hidden>
        이 카테고리에는 아직 노트가 없습니다.
      </p>
    </section>
  )
}

StudyNotes.afterDOMLoaded = studyNotesScript

export default StudyNotes
