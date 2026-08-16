import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const styles = readFileSync(join(process.cwd(), "quartz/styles/custom.scss"), "utf8")

describe("article reading rhythm", () => {
  it("removes the first paragraph margin inside Quartz's markdown wrapper", () => {
    assert.match(styles, /article > \.markdown-preview-view > :first-child\s*\{\s*margin-top:\s*0;/)
  })

  it("keeps paragraph spacing compact", () => {
    assert.match(styles, /article p\s*\{\s*margin:\s*0\.75rem 0;/)
  })

  it("keeps fenced code blocks close to surrounding text", () => {
    assert.match(
      styles,
      /figure\[data-rehype-pretty-code-figure\]\s*\{[\s\S]*?margin:\s*0\.8rem 0;/,
    )
  })

  it("keeps the article header connected to the body", () => {
    assert.match(
      styles,
      /body:not\(\[data-slug="index"\]\) \.page-header > \.popover-hint\s*\{[\s\S]*padding:\s*3\.5rem 0 1rem;/,
    )
    assert.match(styles, /\.content-meta\s*\{[\s\S]*margin:\s*0;/)
  })
})
