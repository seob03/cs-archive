import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import StudyGraph from "./StudyGraph"

describe("StudyGraph activity grid", () => {
  it("keeps future dates as non-interactive placeholders", () => {
    const html = render(
      StudyGraph({
        noteCount: 0,
        graphData: { nodes: [], links: [] },
        notes: [],
        referenceDate: new Date("2026-08-25T00:00:00.000Z"),
      }),
    )

    assert.equal((html.match(/class="study-activity-cell/g) ?? []).length, 24 * 7)
    assert.equal((html.match(/data-study-activity-future/g) ?? []).length, 4)
    assert.equal((html.match(/data-study-activity-cell/g) ?? []).length, 24 * 7 - 4)
    assert.match(html, /data-study-activity-date="2026-08-25"/)
    assert.doesNotMatch(html, /data-study-activity-date="2026-08-26"/)
  })
})
