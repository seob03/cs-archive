import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const styles = readFileSync(join(process.cwd(), "quartz/styles/custom.scss"), "utf8")

describe("article reading rhythm", () => {
  it("removes the extra top gap before the first body block", () => {
    assert.match(styles, /article > :first-child\s*\{\s*margin-top:\s*0;/)
  })

  it("keeps paragraph spacing compact", () => {
    assert.match(styles, /article p\s*\{\s*margin:\s*0\.75rem 0;/)
  })
})
