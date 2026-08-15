import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const config = readFileSync("quartz.config.yaml", "utf8")
const styles = readFileSync("quartz/styles/custom.scss", "utf8")
const home = readFileSync("content/index.md", "utf8")

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
    assert.match(styles, /\.toc\s+\.toc-header\s*\{[\s\S]*min-height:\s*2\.1rem;/)
    assert.match(styles, /\.toc\s+\.toc-header\s+svg\s*\{[\s\S]*display:\s*none;/)
    assert.match(styles, /\.toc\s+\.toc-content\.collapsed[\s\S]*display:\s*block\s*!important;/)
    assert.match(styles, /\.related-graph-canvas\s*\{[\s\S]*height:\s*10\.5rem;/)
    assert.match(
      styles,
      /\.toc\s+\.overflow-end,\s*\.backlinks\s+\.overflow-end\s*\{[\s\S]*display:\s*none\s*!important;/,
    )
  })

  it("sizes the code copy control independently from Quartz defaults", () => {
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*width:\s*1\.65rem;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*height:\s*1\.65rem;/)
    assert.match(styles, /\.clipboard-button\s*\{[\s\S]*padding:\s*0\s*!important;/)
    assert.match(
      styles,
      /\.clipboard-button\s*>\s*svg\s*\{[\s\S]*width:\s*0\.8rem;[\s\S]*height:\s*0\.8rem;/,
    )
  })

  it("enables compact graph and backlinks context on note pages", () => {
    assert.match(config, /source:\s*["']@quartz-community\/backlinks["']/)
    assert.doesNotMatch(config, /source:\s*["']@quartz-community\/graph["']/)
    assert.match(styles, /\.backlinks(?:\s*,|\s*\{)/)
    assert.match(styles, /\.related-graph(?:\s*,|\s*\{)/)
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
})
