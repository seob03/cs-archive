import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const config = readFileSync("quartz.config.yaml", "utf8")
const styles = readFileSync("quartz/styles/custom.scss", "utf8")
const home = readFileSync("content/index.md", "utf8")
const studyNotes = readFileSync("quartz/components/StudyNotes.tsx", "utf8")

describe("archive branding and relationship layout", () => {
  it("uses the archive name instead of the default index label", () => {
    assert.match(config, /pageTitle:\s*["']Seob CS Archive["']/)
    assert.match(home, /^---\s+[\s\S]*?title:\s*["']Seob CS Archive["']/)
  })

  it("uses the inline archive search instead of Quartz's modal search", () => {
    assert.match(config, /source:\s*["']@quartz-community\/search["'][\s\S]*?enabled:\s*false/)
    assert.match(styles, /\.archive-search\s*\{/)
    assert.match(
      styles,
      /\.archive-search-field:focus-within\s*\{[\s\S]*box-shadow:\s*none\s*!important;/,
    )
    assert.match(
      styles,
      /\.archive-search input:focus-visible\s*\{[\s\S]*outline:\s*none\s*!important;/,
    )
  })

  it("keeps the home archive graph compact and cards uniform", () => {
    assert.match(styles, /\.study-card-grid\s*\{[\s\S]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/)
    assert.doesNotMatch(styles, /\.study-card\.is-featured\s*\{[\s\S]*grid-column:\s*span\s*2/)
    assert.match(styles, /\.study-graph-preview\s*\{[\s\S]*height:\s*14rem;/)
    assert.match(styles, /\.study-graph-edge\s*\{[\s\S]*stroke-width:\s*1\.35;/)
    assert.match(styles, /\.study-graph-tooltip\s*\{/)
    assert.match(styles, /\.study-graph-filter-bar\s*\{/)
    assert.doesNotMatch(styles, /\.study-graph-canvas\s*\{[\s\S]*?height:\s*100%\s*!important;/)
    assert.doesNotMatch(styles, /\.global-graph-icon/)
  })

  it("balances card previews and keeps cards uniform", () => {
    assert.match(styles, /a\.study-card\s*\{[\s\S]*height:\s*14rem;/)
    assert.match(styles, /\.study-card-title\s*\{[\s\S]*max-height:\s*calc\(1\.4em\s*\*\s*2\);/)
    assert.match(styles, /\.study-card-title\s*\{[\s\S]*-webkit-line-clamp:\s*2;/)
    assert.match(styles, /\.study-card-excerpt\s*\{[\s\S]*max-height:\s*calc\(1\.65em\s*\*\s*3\);/)
    assert.match(styles, /\.study-card-excerpt\s*\{[\s\S]*-webkit-line-clamp:\s*3;/)
    assert.match(
      styles,
      /a\.study-card\[data-study-title-lines="2"\]\s+\.study-card-excerpt\s*\{[\s\S]*max-height:\s*calc\(1\.65em\s*\*\s*2\);/,
    )
    assert.match(
      styles,
      /a\.study-card\[data-study-title-lines="2"\][\s\S]*-webkit-line-clamp:\s*2;/,
    )
    assert.match(studyNotes, /data-study-title-lines/)
    assert.match(studyNotes, /getBoundingClientRect\(\)/)
  })

  it("uses graph category colors as restrained card and filter accents", () => {
    assert.match(
      styles,
      /\.study-category-filter\s*\{[\s\S]*--study-category-color:\s*var\(--site-brand\);/,
    )
    assert.match(
      styles,
      /\.study-category-filter\.is-active,[\s\S]*background:\s*color-mix\([\s\S]*var\(--study-category-color\)/,
    )
    assert.match(
      styles,
      /a\.study-card:hover,[\s\S]*border-color:\s*var\(--study-category-color\)\s*!important;/,
    )
    assert.match(
      styles,
      /\.study-card-badge\s*\{[\s\S]*background:\s*color-mix\([\s\S]*var\(--study-category-color\)/,
    )
  })

  it("removes estimated reading time from note metadata", () => {
    assert.match(
      config,
      /source:\s*["']@quartz-community\/content-meta["'][\s\S]*?enabled:\s*true[\s\S]*?options:[\s\S]*?showReadingTime:\s*false[\s\S]*?showComma:\s*false/,
    )
  })

  it("keeps the note sidebar compact and the table of contents always open", () => {
    assert.match(
      styles,
      /#quartz-root\.page\s*\{[\s\S]*background:\s*var\(--site-bg\)\s*!important;/,
    )
    assert.match(
      styles,
      /#quartz-body\s*>\s*\.right\.sidebar\s*\{[\s\S]*background:\s*transparent\s*!important;/,
    )
    assert.match(styles, /#quartz-body\s*>\s*\.right\.sidebar\s*\{[\s\S]*gap:\s*0\.45rem;/)
    assert.match(styles, /--site-toc:\s*320px;/)
    assert.match(
      styles,
      /#quartz-body\s*>\s*\.right\.sidebar:not\(:empty\)\s*\{[\s\S]*margin-right:\s*0\.75rem;/,
    )
    assert.match(styles, /\.toc\s+\.toc-header\s*\{[\s\S]*min-height:\s*2\.1rem;/)
    assert.match(styles, /\.toc\s+\.toc-header\s+svg\s*\{[\s\S]*display:\s*none;/)
    assert.match(styles, /\.toc\s+\.toc-content\.collapsed[\s\S]*display:\s*block\s*!important;/)
    assert.match(styles, /\.related-panel-grid\s*\{[\s\S]*display:\s*grid;/)
    assert.match(styles, /\.related-panel-grid\s*\{[\s\S]*grid-template-columns:/)
    assert.match(styles, /\.related-graph-view\s*\{[\s\S]*aspect-ratio:\s*1;/)
    assert.match(styles, /\.toc\s+\.overflow-end\s*\{[\s\S]*display:\s*none\s*!important;/)
  })

  it("keeps long table-of-contents lists scrollable inside the sticky sidebar", () => {
    assert.match(
      styles,
      /#quartz-body\s*>\s*\.right\.sidebar:not\(:empty\)\s*\{[\s\S]*height:\s*calc\(100vh\s*-\s*var\(--site-header\)\s*-\s*1\.5rem\);/,
    )
    assert.match(
      styles,
      /#quartz-body\s*>\s*\.right\.sidebar:not\(:empty\)\s*\{[\s\S]*overflow:\s*hidden;/,
    )
    assert.match(styles, /\.toc\s*\{[\s\S]*margin-bottom:\s*1rem;/)
    assert.match(
      styles,
      /\.toc\s*\{[\s\S]*display:\s*flex;[\s\S]*flex-direction:\s*column;[\s\S]*min-height:\s*0;/,
    )
    assert.match(
      styles,
      /\.toc\s+\.toc-content,\s*\.toc\s+\.toc-content\.collapsed\s*\{[\s\S]*max-height:\s*none;[\s\S]*overflow-y:\s*auto;[\s\S]*overscroll-behavior:\s*contain;/,
    )
    assert.match(styles, /\.toc\s*\{[\s\S]*flex:\s*0\s+1\s+auto;/)
    assert.doesNotMatch(styles, /\.toc\s*\{[^}]*flex:\s*1\s+1\s+auto;/)
    assert.match(
      styles,
      /\.toc\s+\.toc-content\s+li\s*>\s*a\s*\{[\s\S]*text-overflow:\s*clip;[\s\S]*white-space:\s*normal;[\s\S]*overflow-wrap:\s*anywhere;/,
    )
  })

  it("indents nested table-of-contents levels", () => {
    assert.match(
      styles,
      /\.toc\s+\.toc-content\s+li\.depth-1\s*>\s*a\s*\{[\s\S]*padding-left:\s*1\.35rem;/,
    )
    assert.match(
      styles,
      /\.toc\s+\.toc-content\s+li\.depth-2\s*>\s*a\s*\{[\s\S]*padding-left:\s*2\.25rem;/,
    )
    assert.match(
      styles,
      /\.toc\s+\.toc-content\s+li\s*>\s*a\.is-current\s*\{[\s\S]*background:\s*color-mix\([\s\S]*var\(--site-brand\)\s+8%[\s\S]*color:\s*color-mix\([\s\S]*font-weight:\s*650;/,
    )
    assert.match(
      styles,
      /\.toc\s+\.toc-content\s+li\s*>\s*a\.is-current::before\s*\{[\s\S]*position:\s*absolute;[\s\S]*inset:\s*0\s+auto\s+0\s+0;[\s\S]*width:\s*2px;[\s\S]*border-radius:\s*0;/,
    )
  })

  it("keeps the code copy control visible and correctly aligned", () => {
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*width:\s*2rem\s*!important;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*height:\s*2rem\s*!important;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*margin:\s*0\s*!important;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*opacity:\s*1\s*!important;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*border:\s*0\s*!important;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*background:\s*transparent\s*!important;/)
    assert.match(
      styles,
      /\.clipboard-button\s*\{[\s\S]*background-color:\s*transparent\s*!important;/,
    )
    assert.match(
      styles,
      /\.clipboard-button\s*>\s*svg\s*\{[\s\S]*width:\s*1rem;[\s\S]*height:\s*1rem;[\s\S]*fill:\s*currentColor\s*!important;[\s\S]*filter:\s*none\s*!important;/,
    )
    assert.match(styles, /\.clipboard-button:hover,[\s\S]*background:\s*transparent\s*!important;/)
    assert.match(styles, /\.clipboard-button:hover,[\s\S]*color:\s*#60a5fa\s*!important;/)
    assert.doesNotMatch(
      styles,
      /\.clipboard-button:hover,\s*\.clipboard-button:focus-visible\s*\{[^}]*background(?:-color)?:\s*#23232a/,
    )
  })

  it("keeps graph and related links in one two-column note panel", () => {
    assert.doesNotMatch(config, /source:\s*["']@quartz-community\/backlinks["']/)
    assert.doesNotMatch(config, /source:\s*["']@quartz-community\/graph["']/)
    assert.match(styles, /\.related-graph(?:\s*,|\s*\{)/)
    assert.match(styles, /\.related-panel-header\s*\{/)
    assert.match(styles, /\.related-panel-grid\s*\{/)
    assert.match(styles, /\.related-notes-list\s*\{/)
    assert.doesNotMatch(styles, /\.related-panel-tabs\s*\{/)
    assert.doesNotMatch(styles, /\.related-panel-tab\s*\{/)
    assert.match(
      styles,
      /\.related-notes-view\s*\{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\);/,
    )
    assert.match(styles, /\.related-notes-section\s*\{/)
    assert.match(
      styles,
      /\.page-afterbody\s*\{[\s\S]*width:\s*min\(100%,\s*var\(--site-related\)\);/,
    )
    assert.match(
      styles,
      /\.related-notes-list\s*>\s*li\s*>\s*a\s*\{[\s\S]*background:\s*transparent\s*!important;/,
    )
    assert.match(
      styles,
      /\.related-notes-list\s*>\s*li\s*>\s*a:hover\s*\{[\s\S]*background:\s*transparent\s*!important;/,
    )
  })

  it("keeps the theme toggle readable in both color modes", () => {
    assert.match(styles, /\.darkmode\s*\{[\s\S]*appearance:\s*none;/)
    assert.match(styles, /:root\[saved-theme="dark"\]\s+\.darkmode\s*\{/)
    assert.match(styles, /button\.darkmode\s*\{[\s\S]*mask-image:\s*none\s*!important;/)
    assert.match(styles, /button\.darkmode\s*>\s*svg\s*\{[\s\S]*display:\s*none\s*!important;/)
    assert.match(
      styles,
      /button\.darkmode::before\s*\{[\s\S]*background:\s*var\(--site-brand\)\s*!important;/,
    )
    assert.match(styles, /button\.darkmode::before\s*\{[\s\S]*mask-image:\s*var\(--sun-icon\);/)
    assert.match(
      styles,
      /saved-theme="dark"\][\s\S]*button\.darkmode::before\s*\{[\s\S]*mask-image:\s*var\(--moon-icon\);/,
    )
  })

  it("keeps graph colors readable in light mode", () => {
    assert.match(styles, /--site-graph-bg:\s*#f5f6fb;/)
    assert.match(styles, /--site-graph-edge:\s*rgba\(67,\s*56,\s*202,\s*0\.56\);/)
    assert.match(styles, /--site-graph-node-stroke:\s*rgba\(30,\s*41,\s*59,\s*0\.32\);/)
    assert.match(
      styles,
      /:root:not\(\[saved-theme="dark"\]\)\s+\.study-graph-node-dot[\s\S]*filter:\s*saturate\(1\.15\)/,
    )
    assert.match(styles, /.related-graph-canvas\s*\{[\s\S]*background:\s*var\(--site-graph-bg\);/)
  })

  it("keeps Mermaid theme colors compatible with its color parser", () => {
    assert.match(styles, /--secondary:\s*#5b5ce2;/)
    assert.match(styles, /--tertiary:\s*#7c6ee6;/)
    assert.match(styles, /:root\[saved-theme="dark"\][\s\S]*--secondary:\s*#9b9cf7;/)
    assert.match(styles, /:root\[saved-theme="dark"\][\s\S]*--tertiary:\s*#b8a9ff;/)
  })

  it("keeps Mermaid controls minimal and edge labels readable in dark mode", () => {
    assert.match(
      styles,
      /pre:has\(>\s*code\.mermaid\)\s*>\s*\.expand-button\s*\{[\s\S]*display:\s*none\s*!important;/,
    )
    assert.match(
      styles,
      /:root\[saved-theme="dark"\][\s\S]*\.mermaid \.edgeLabel \.labelBkg[\s\S]*background:/,
    )
    assert.match(styles, /:root\[saved-theme="dark"\][\s\S]*\.mermaid \.edgeLabel[\s\S]*color:/)
  })
})
