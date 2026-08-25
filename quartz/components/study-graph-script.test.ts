import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { studyGraphScript } from "./study-graph-script"

describe("study graph interactions", () => {
  it("removes Quartz overflow markers from the note sidebar", () => {
    assert.match(studyGraphScript, /document\.querySelectorAll\("\.toc \.overflow-end"\)/)
    assert.match(studyGraphScript, /overflowEnd\.remove\(\)/)
  })

  it("reheats the force simulation while dragging a node", () => {
    assert.match(studyGraphScript, /simulation\.on\("tick", updatePositions\)/)
    assert.match(studyGraphScript, /simulation\.alphaTarget\(0\.25\)\.restart\(\)/)
    assert.match(studyGraphScript, /if \(!event\.active\) simulation\.alphaTarget\(0\)/)
  })

  it("uses a restrained fit and animates the full graph into its final zoom", () => {
    assert.match(studyGraphScript, /compact \? 0\.94 : 0\.96/)
    assert.match(
      studyGraphScript,
      /const initialScale = compact \? settledScale : settledScale \* 1\.08/,
    )
    assert.match(studyGraphScript, /svg\s*\.transition\(\)[\s\S]*?duration\(760\)/)
  })

  it("configures spacing and collision forces for dense graphs", () => {
    assert.match(
      studyGraphScript,
      /\.distance\(compact \? \d+(?:\.\d+)? : \d+(?:\.\d+)?\)\.strength\(0\.58\)/,
    )
    assert.match(
      studyGraphScript,
      /\.force\("charge", d3\.forceManyBody\(\)\.strength\(compact \? -\d+(?:\.\d+)? : -\d+(?:\.\d+)?\)\)/,
    )
    assert.match(
      studyGraphScript,
      /"collide",[\s\S]*?\.radius\(\(node\) => [\d.]+ \+ [\d.]+ \* Math\.sqrt\(degrees\.get\(node\.id\) \|\| 0\)/,
    )
  })

  it("keeps layout driven by graph forces rather than category anchors", () => {
    assert.doesNotMatch(studyGraphScript, /visibleCategories|categoryTargets|categoryForceStrength/)
    assert.doesNotMatch(studyGraphScript, /"category-x"|"category-y"/)
  })

  it("activates one table-of-contents entry at the reading line", () => {
    assert.match(
      studyGraphScript,
      /const readingLine = window\.scrollY \+ window\.innerHeight \/ 2/,
    )
    assert.match(
      studyGraphScript,
      /document\.querySelectorAll\("\.toc \.toc-content a\[data-for\]"\)/,
    )
    assert.match(studyGraphScript, /link\.classList\.toggle\("is-current"/)
    assert.match(studyGraphScript, /window\.addEventListener\("scroll", onScroll/)
  })

  it("keeps the active table-of-contents entry visible while the page scrolls", () => {
    assert.match(studyGraphScript, /const currentLink = tocLinks\.find\(/)
    assert.match(studyGraphScript, /tocContent\.scrollTo\(\{[\s\S]*behavior:\s*"smooth"/)
  })

  it("keeps the related graph and link lists visible without tab state", () => {
    assert.match(studyGraphScript, /data-study-graph-preview/)
    assert.doesNotMatch(studyGraphScript, /data-study-related-tab/)
    assert.doesNotMatch(studyGraphScript, /relatedMode|relatedGraphView|relatedNotesView/)
    assert.doesNotMatch(studyGraphScript, /onRelatedTabClick|studyRelatedMode/)
  })

  it("allows the home graph to use the full canvas without a preview canvas", () => {
    assert.match(
      studyGraphScript,
      /if \(!\(preview instanceof HTMLElement\) && !\(fullCanvas instanceof HTMLElement\)\) continue/,
    )
    assert.match(studyGraphScript, /if \(preview instanceof HTMLElement\) renderPreview\(\)/)
  })

  it("opens the home graph from the global header button", () => {
    assert.match(studyGraphScript, /data-study-graph-header-open/)
    assert.match(studyGraphScript, /headerOpenButton\.addEventListener\("click", openGraph\)/)
    assert.match(studyGraphScript, /headerOpenButton\.removeEventListener\("click", openGraph\)/)
  })
})
