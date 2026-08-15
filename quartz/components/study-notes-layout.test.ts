import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { QuartzComponent } from "./types"
import { augmentStudyNotesLayout } from "./study-notes-layout"

const component = (() => null) as QuartzComponent
const searchComponent = (() => null) as QuartzComponent
const existingDefault = (() => null) as QuartzComponent
const existingContent = (() => null) as QuartzComponent

describe("study notes layout", () => {
  it("adds the home component to the content page-type layout", () => {
    const layout = augmentStudyNotesLayout(
      {
        defaults: { beforeBody: [existingDefault] },
        byPageType: { content: { beforeBody: [existingContent] } },
      },
      component,
    )

    assert.deepEqual(layout.defaults.beforeBody, [existingDefault, component])
    assert.deepEqual(layout.byPageType.content?.beforeBody, [existingContent, component])
  })

  it("adds the archive search component to shared and content headers", () => {
    const layout = augmentStudyNotesLayout(
      {
        defaults: { header: [existingDefault] },
        byPageType: { content: { header: [existingContent] } },
      },
      component,
      searchComponent,
    )

    assert.deepEqual(layout.defaults.header, [existingDefault, searchComponent])
    assert.deepEqual(layout.byPageType.content?.header, [existingContent, searchComponent])
  })
})
