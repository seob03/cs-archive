import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { VFile } from "vfile"
import { NoteProperties } from "@quartz-community/note-properties"

const parseNote = async (value: string, filename: string) => {
  const file = new VFile({ path: `/notes/${filename}`, value })
  const transformer = NoteProperties({
    includeAll: false,
    includedProperties: ["description", "tags", "aliases"],
    excludedProperties: ["notion-id"],
    hidePropertiesView: true,
  })
  const processor = unified()
    .use(remarkParse)
    .use(transformer.markdownPlugins?.({ allSlugs: [] } as any) as any)
  const ast = processor.parse(file)
  await processor.run(ast, file)
  const html = await unified().use(remarkRehype).run(ast, file)

  return { file, html }
}

describe("imported frontmatter", () => {
  it("removes notion metadata from rendered markdown and preserves filename casing", async () => {
    const { file, html } = await parseNote(
      "---\nnotion-id: abc123\n---\n\n# 내용\n",
      "@Controller.md",
    )

    assert.equal(file.data.frontmatter?.title, "@Controller")
    assert.doesNotMatch(JSON.stringify(html), /notion-id/)
    assert.equal(Object.keys(file.data.noteProperties?.properties ?? {}).includes("notion-id"), false)
  })

  it("keeps explicit metadata while never exposing notion-id", async () => {
    const { file } = await parseNote(
      '---\ntitle: "JPA\u0020기초"\ndescription: "관계를 다룹니다."\nnotion-id: xyz789\n---\n본문',
      "JPA.md",
    )

    assert.equal(file.data.frontmatter?.title, "JPA 기초")
    assert.equal(file.data.frontmatter?.description, "관계를 다룹니다.")
    assert.equal(file.data.frontmatter?.["notion-id"], "xyz789")
    assert.equal(Object.keys(file.data.noteProperties?.properties ?? {}).includes("notion-id"), false)
  })
})
