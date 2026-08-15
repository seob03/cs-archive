import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const config = readFileSync("quartz.config.yaml", "utf8")
const styles = readFileSync("quartz/styles/custom.scss", "utf8")

describe("archive branding and relationship layout", () => {
  it("uses the archive name instead of the default index label", () => {
    assert.match(config, /pageTitle:\s*["']Seob CS Archive["']/)
  })

  it("uses the inline archive search instead of Quartz's modal search", () => {
    assert.match(config, /source:\s*["']@quartz-community\/search["'][\s\S]*?enabled:\s*false/)
    assert.match(styles, /\.archive-search\s*\{/)
  })

  it("enables compact graph and backlinks context on note pages", () => {
    assert.match(config, /source:\s*["']@quartz-community\/backlinks["']/)
    assert.match(config, /source:\s*["']@quartz-community\/graph["']/)
    assert.match(styles, /\.backlinks(?:\s*,|\s*\{)/)
    assert.match(styles, /\.graph(?:\s*,|\s*\{)/)
    assert.match(styles, /\.toc\s*\{[\s\S]*border-radius:\s*14px;/)
  })

  it("keeps the theme toggle readable in both color modes", () => {
    assert.match(styles, /\.darkmode\s*\{[\s\S]*appearance:\s*none;/)
    assert.match(styles, /:root\[saved-theme="dark"\]\s+\.darkmode\s*\{/)
  })
})
