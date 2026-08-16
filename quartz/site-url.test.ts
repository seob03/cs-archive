import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const config = readFileSync("quartz.config.yaml", "utf8")

describe("site URL configuration", () => {
  it("uses the renamed cs-archive GitHub Pages path", () => {
    assert.match(config, /baseUrl:\s*seob03\.github\.io\/cs-archive/)
    assert.match(config, /Website:\s*https:\/\/seob03\.github\.io\/cs-archive/)
    assert.match(config, /GitHub:\s*https:\/\/github\.com\/seob03\/cs-archive/)
  })
})
