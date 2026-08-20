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
})
