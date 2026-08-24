import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { normalizeNotionLinks } from "./notion-links"

describe("Notion link normalization", () => {
  it("removes an importer suffix only when the canonical note is unique", () => {
    const result = normalizeNotionLinks(
      "[[MessagesState 1|MessagesState 1]] [[State Reducer 1|State Reducer 1]] [[State Reducer 1]]",
      ["AI/LANG-GRAPH/MessagesState.md", "AI/LANG-GRAPH/State Reducer.md", "AI/LANG-GRAPH/State Reducer 1.md"],
    )

    assert.equal(result.content, "[[MessagesState|MessagesState]] [[State Reducer 1|State Reducer 1]] [[State Reducer 1]]")
    assert.equal(result.replacements, 1)
  })

  it("keeps suffixed links when the canonical title is ambiguous", () => {
    const result = normalizeNotionLinks(
      "[[State Reducer 1]]",
      ["AI/LANG-GRAPH/State Reducer.md", "BACKEND/SPRING/State Reducer.md"],
    )

    assert.equal(result.content, "[[State Reducer 1]]")
    assert.equal(result.replacements, 0)
  })
})
