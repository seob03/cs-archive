import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { buildStudyNotesIndex, formatNoteDate } from "./study-notes"
import { studyNoteSearchText } from "./archive-search"

const studyNotesScript = `
const initStudyNotes = () => {
  const root = document.querySelector(".study-home")
  if (!root || root.dataset.studyNotesReady === "true") return

  const filterButtons = Array.from(root.querySelectorAll("[data-study-filter]"))
  const cards = Array.from(root.querySelectorAll("[data-study-card]"))
  const emptyState = root.querySelector("[data-study-empty]")

  const applyFilter = (filter) => {
    const query = root.dataset.studyQuery || ""
    const tokens = query.split(" ").filter(Boolean)
    let visibleCount = 0

    for (const card of cards) {
      const category = card.getAttribute("data-study-category")
      const searchText = card.getAttribute("data-study-search") || ""
      const matchesSearch = tokens.length === 0 || tokens.every((token) => searchText.includes(token))
      const shouldShow = (filter === "ALL" || category === filter) && matchesSearch
      card.hidden = !shouldShow
      if (shouldShow) visibleCount += 1
    }

    if (emptyState instanceof HTMLElement) emptyState.hidden = visibleCount > 0

    for (const button of filterButtons) {
      const isActive = button.getAttribute("data-study-filter") === filter
      button.classList.toggle("is-active", isActive)
      button.setAttribute("aria-pressed", String(isActive))
    }
  }

  const onClick = (event) => {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest("[data-study-filter]")
    if (!button) return
    applyFilter(button.getAttribute("data-study-filter") || "ALL")
  }

  const onSearch = () => {
    const activeFilter = root.querySelector("[data-study-filter].is-active")
    applyFilter(activeFilter?.getAttribute("data-study-filter") || "ALL")
  }

  root.addEventListener("click", onClick)
  root.addEventListener("study-search", onSearch)
  root.dataset.studyNotesReady = "true"
  const activeFilter = root.querySelector("[data-study-filter].is-active")
  applyFilter(activeFilter?.getAttribute("data-study-filter") || "ALL")

  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => {
      root.removeEventListener("click", onClick)
      root.removeEventListener("study-search", onSearch)
    })
  }
}

document.addEventListener("nav", initStudyNotes)
document.addEventListener("render", initStudyNotes)
initStudyNotes()
`

const StudyNotes: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  if (fileData.slug !== "index") return null

  const { notes, categories } = buildStudyNotesIndex(allFiles)

  return (
    <section class="study-home" aria-labelledby="study-notes-title">
      <header class="study-hero">
        <div class="study-frame">
          <p class="study-hero-eyebrow">PERSONAL KNOWLEDGE BASE</p>
          <h1 id="study-notes-title" class="study-hero-title">
            Seob&apos;s <span class="study-hero-accent">CS</span> STUDY ARCHIVE
          </h1>
          <p class="study-hero-subtitle">배운 것을 오래 남기는 공간</p>
          <p class="study-hero-publication">
            {notes.length} NOTES PUBLISHED · {categories.length} CATEGORIES
          </p>
        </div>
      </header>

      <nav class="study-category-bar" aria-label="노트 카테고리">
        <div class="study-frame">
          <button
            type="button"
            class="study-category-filter is-active"
            data-study-filter="ALL"
            aria-pressed
          >
            ALL <span>{notes.length}</span>
          </button>
          {categories.map((category) => (
            <button
              type="button"
              class="study-category-filter"
              data-study-filter={category.key}
              aria-pressed={false}
            >
              {category.label} <span>{category.count}</span>
            </button>
          ))}
        </div>
      </nav>

      <div class="study-catalog">
        <div class="study-frame">
          <div class="study-card-grid">
            {notes.map((note, index) => (
              <a
                class={`study-card${index === 0 ? " is-featured" : ""} internal`}
                data-study-card
                data-study-category={note.categoryKey}
                data-study-search={studyNoteSearchText(note)}
                href={resolveRelative(fileData.slug!, note.slug)}
                title={note.title}
              >
                <span class="study-card-badge">{note.categoryLabel}</span>
                <span class="study-card-date">{formatNoteDate(note.modified)}</span>
                <span class="study-card-title">{note.title}</span>
                <span class="study-card-excerpt">{note.excerpt}</span>
                <span class="study-card-path">{note.path.join(" / ") || note.categoryLabel}</span>
              </a>
            ))}
          </div>
          <p class="study-empty-state" data-study-empty hidden>
            일치하는 노트가 없습니다.
          </p>
        </div>
      </div>
    </section>
  )
}

StudyNotes.afterDOMLoaded = studyNotesScript

export default StudyNotes
