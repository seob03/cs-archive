import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { normalizeMermaidEscapedLineBreaks } from "./mermaid"

describe("Mermaid markdown normalization", () => {
  it("converts escaped line breaks only inside Mermaid fences", () => {
    const markdown = [
      'Outside: "first\\nsecond"',
      "```mermaid",
      "flowchart TD",
      '  A["first\\nsecond"] --> B["third\\nfourth"]',
      "```",
      "```python",
      'print("first\\nsecond")',
      "```",
    ].join("\n")

    assert.equal(
      normalizeMermaidEscapedLineBreaks(markdown),
      [
        'Outside: "first\\nsecond"',
        "```mermaid",
        "flowchart TD",
        '  A["first<br/>second"] --> B["third<br/>fourth"]',
        "```",
        "```python",
        'print("first\\nsecond")',
        "```",
      ].join("\n"),
    )
  })
})
