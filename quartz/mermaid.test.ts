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
        '%%{init: {"flowchart": {"wrappingWidth": 300}}}%%',
        "flowchart TD",
        '  A["first<br/>second"] --> B["third<br/>fourth"]',
        "```",
        "```python",
        'print("first\\nsecond")',
        "```",
      ].join("\n"),
    )
  })

  it("leaves non-flowchart Mermaid diagrams unchanged", () => {
    const markdown = ["```mermaid", "sequenceDiagram", "  A->>B: hello", "```"].join("\n")

    assert.equal(normalizeMermaidEscapedLineBreaks(markdown), markdown)
  })

  it("preserves a flowchart's explicit Mermaid initialization", () => {
    const markdown = [
      "```mermaid",
      '%%{init: {"flowchart": {"wrappingWidth": 420}}}%%',
      "flowchart TD",
      '  A["A deliberately wide label"] --> B["Done"]',
      "```",
    ].join("\n")

    assert.equal(normalizeMermaidEscapedLineBreaks(markdown), markdown)
  })
})
