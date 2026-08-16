import { QuartzComponent, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { buildStudyNotesIndex, formatNoteDate } from "./study-notes"
import { studyNoteSearchText } from "./archive-search"
import { resolveGitUploadDate } from "./git-upload-date"

const archiveSearchScript = `
const initArchiveSearch = () => {
  const root = document.querySelector("[data-archive-search]")
  if (!root || root.dataset.archiveSearchReady === "true") return

  const input = root.querySelector("[data-archive-search-input]")
  const resultBox = root.querySelector("[data-archive-search-results]")
  const results = Array.from(root.querySelectorAll("[data-archive-search-result]"))
  const emptyState = root.querySelector("[data-archive-search-empty]")
  if (!(input instanceof HTMLInputElement) || !(resultBox instanceof HTMLElement)) return

  const normalize = (value) =>
    value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\\s+/g, " ").trim()
  const setOpen = (open) => {
    root.classList.toggle("is-open", open)
    resultBox.hidden = !open
    input.setAttribute("aria-expanded", String(open))
  }

  const maxResults = 8

  const applySearch = () => {
    const query = normalize(input.value)
    if (root.dataset.archiveSearchPage === "home") {
      const studyHome = document.querySelector(".study-home")
      if (studyHome) {
        studyHome.dataset.studyQuery = query
        studyHome.dispatchEvent(new CustomEvent("study-search"))
      }
      setOpen(false)
      return
    }

    const tokens = query.split(" ").filter(Boolean)
    let visibleCount = 0
    for (const result of results) {
      const text = result.getAttribute("data-search-text") || ""
      const matches =
        tokens.length > 0 &&
        visibleCount < maxResults &&
        tokens.every((token) => text.includes(token))
      result.hidden = !matches
      if (matches) visibleCount += 1
    }

    if (emptyState instanceof HTMLElement) emptyState.hidden = !query || visibleCount > 0
    setOpen(Boolean(query))
  }

  const onKeydown = (event) => {
    if (event.key !== "Escape") return
    input.value = ""
    applySearch()
    input.blur()
  }

  const onShortcut = (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return
    event.preventDefault()
    input.focus()
    input.select()
  }

  const onDocumentClick = (event) => {
    if (event.target instanceof Node && !root.contains(event.target)) setOpen(false)
  }

  input.addEventListener("input", applySearch)
  input.addEventListener("keydown", onKeydown)
  document.addEventListener("click", onDocumentClick)
  document.addEventListener("keydown", onShortcut)
  root.dataset.archiveSearchReady = "true"

  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => {
      input.removeEventListener("input", applySearch)
      input.removeEventListener("keydown", onKeydown)
      document.removeEventListener("click", onDocumentClick)
      document.removeEventListener("keydown", onShortcut)
    })
  }
}

document.addEventListener("nav", initArchiveSearch)
document.addEventListener("render", initArchiveSearch)
initArchiveSearch()
`

const graphBasePathScript = `
const normalizeLocalGraphBasePath = () => {
  if (!/^(localhost|127(?:\\.[0-9]+){3})$/.test(window.location.hostname)) return
  if (document.body?.dataset?.basepath) document.body.dataset.basepath = ""
}

normalizeLocalGraphBasePath()
document.addEventListener("DOMContentLoaded", normalizeLocalGraphBasePath, { once: true })
`

const ArchiveSearch: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const { notes } = buildStudyNotesIndex(allFiles, resolveGitUploadDate)
  const isHome = fileData.slug === "index"

  return (
    <div
      class="archive-search"
      data-archive-search
      data-archive-search-page={isHome ? "home" : "note"}
    >
      <label class="archive-search-label" for="archive-search-input">
        노트 검색
      </label>
      <div class="archive-search-field">
        <svg class="archive-search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          id="archive-search-input"
          data-archive-search-input
          type="search"
          placeholder="노트 검색"
          aria-label="노트 검색"
          aria-controls="archive-search-results"
          aria-expanded={false}
          autocomplete="off"
          spellcheck={false}
        />
        <kbd class="archive-search-shortcut">⌘K</kbd>
      </div>
      <div
        id="archive-search-results"
        class="archive-search-results"
        data-archive-search-results
        role="listbox"
        aria-label="노트 검색 결과"
        hidden
      >
        {notes.map((note) => (
          <a
            class="archive-search-result internal"
            data-archive-search-result
            data-search-text={studyNoteSearchText(note)}
            href={resolveRelative(fileData.slug!, note.slug)}
            role="option"
            hidden
          >
            <span class="archive-search-result-title">{note.title}</span>
            <span class="archive-search-result-meta">
              {note.categoryLabel} · {formatNoteDate(note.uploaded)}
            </span>
          </a>
        ))}
        <p class="archive-search-empty" data-archive-search-empty hidden>
          일치하는 노트가 없습니다.
        </p>
      </div>
    </div>
  )
}

ArchiveSearch.afterDOMLoaded = archiveSearchScript
ArchiveSearch.beforeDOMLoaded = graphBasePathScript

export default ArchiveSearch
