import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  if (children.length === 0) return null

  const isStudyHome = fileData.slug === "index"
  return (
    <header>
      {children}
      {isStudyHome && (
        <button
          class="study-graph-header-button"
          data-study-graph-header-open
          type="button"
          aria-label="Open knowledge graph"
          aria-haspopup="dialog"
        >
          Graph
        </button>
      )}
    </header>
  )
}

Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
