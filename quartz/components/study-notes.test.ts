import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { buildStudyNotesIndex, formatNoteDate } from "./study-notes"
import { FilePath, FullSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"

const modified = (value: string) => new Date(`${value}T00:00:00.000Z`)

describe("study note catalog", () => {
  it("sorts by first upload date instead of later modifications", () => {
    const olderPath = "/repo/content/backend/older.md"
    const newerPath = "/repo/content/backend/newer.md"
    const uploadedByPath = new Map([
      [olderPath, modified("2026-08-01")],
      [newerPath, modified("2026-08-15")],
    ])
    const index = buildStudyNotesIndex(
      [
        {
          slug: "backend/older" as FullSlug,
          filePath: olderPath as FilePath,
          frontmatter: { title: "먼저 업로드" },
          dates: {
            created: modified("2026-08-01"),
            modified: modified("2026-08-20"),
            published: modified("2026-08-01"),
          },
        },
        {
          slug: "backend/newer" as FullSlug,
          filePath: newerPath as FilePath,
          frontmatter: { title: "새로 업로드" },
          dates: {
            created: modified("2026-08-15"),
            modified: modified("2026-08-15"),
            published: modified("2026-08-15"),
          },
        },
      ],
      (filePath) => uploadedByPath.get(filePath ?? ""),
    )

    assert.deepEqual(
      index.notes.map((note) => note.title),
      ["새로 업로드", "먼저 업로드"],
    )
    assert.equal(index.notes[0]?.uploaded?.toISOString(), "2026-08-15T00:00:00.000Z")
  })

  it("prefers an explicit frontmatter created timestamp over the Git upload timestamp", () => {
    const notePath = "/repo/content/backend/created-note.md"
    const index = buildStudyNotesIndex(
      [
        {
          slug: "backend/created-note" as FullSlug,
          filePath: notePath as FilePath,
          frontmatter: {
            title: "직접 기록한 날짜",
            created: "2026-08-14T15:42:00+09:00",
          },
          dates: {
            created: modified("2026-08-14"),
            modified: modified("2026-08-20"),
            published: modified("2026-08-14"),
          },
        },
      ],
      () => modified("2026-08-18"),
    )

    assert.equal(index.notes[0]?.uploaded?.toISOString(), "2026-08-14T06:42:00.000Z")
  })

  it("builds a folder-driven catalog and excludes index pages and virtual 404", () => {
    const index = buildStudyNotesIndex([
      {
        slug: "backend/spring/jpa" as FullSlug,
        frontmatter: {
          title: "JPA 기초",
          description: "<p>JPA <strong>핵심</strong> 정리</p>",
          tags: ["backend", "jpa"],
        },
        dates: {
          created: modified("2026-08-15"),
          modified: modified("2026-08-15"),
          published: modified("2026-08-15"),
        },
      },
      {
        slug: "database/mysql/index" as FullSlug,
        frontmatter: { title: "MySQL" },
      },
      {
        slug: "database/mysql/transaction" as FullSlug,
        frontmatter: { title: "트랜잭션" },
        description: "<p>트랜잭션\n\n 경계를 설명합니다.</p>",
        dates: {
          created: modified("2026-08-14"),
          modified: modified("2026-08-14"),
          published: modified("2026-08-14"),
        },
        htmlAst: {
          type: "root",
          children: [{ type: "text", value: "사용되지 않는 HTML" }],
        },
      },
      {
        slug: "index" as FullSlug,
        frontmatter: { title: "홈" },
      },
      {
        slug: "404" as FullSlug,
        frontmatter: { title: "Not Found" },
      },
      {
        slug: "readme" as FullSlug,
        frontmatter: { title: "루트 노트" },
      },
    ])

    assert.deepEqual(
      index.notes.map((note) => note.slug),
      ["backend/spring/jpa", "database/mysql/transaction", "readme"],
    )
    assert.deepEqual(index.notes[0], {
      slug: "backend/spring/jpa",
      title: "JPA 기초",
      excerpt: "JPA 핵심 정리",
      categoryKey: "BACKEND",
      categoryLabel: "BACKEND",
      path: ["BACKEND", "SPRING"],
      uploaded: modified("2026-08-15"),
      tags: ["backend", "jpa"],
    })
    assert.equal(index.notes[1]?.excerpt, "트랜잭션 경계를 설명합니다.")
    assert.deepEqual(index.notes[1]?.path, ["DATABASE", "MYSQL"])
    assert.equal(index.notes[2]?.categoryKey, "GENERAL")
    assert.deepEqual(index.notes[2]?.path, [])
    assert.deepEqual(index.categories, [
      { key: "BACKEND", label: "BACKEND", count: 1 },
      { key: "DATABASE", label: "DATABASE", count: 1 },
      { key: "GENERAL", label: "GENERAL", count: 1 },
    ])
  })

  it("uses Korean title order when upload dates are equal or missing", () => {
    const index = buildStudyNotesIndex([
      {
        slug: "same/z" as FullSlug,
        frontmatter: { title: "하늘" },
        dates: {
          created: modified("2026-08-01"),
          modified: modified("2026-08-01"),
          published: modified("2026-08-01"),
        },
      },
      {
        slug: "same/a" as FullSlug,
        frontmatter: { title: "가을" },
        dates: {
          created: modified("2026-08-01"),
          modified: modified("2026-08-01"),
          published: modified("2026-08-01"),
        },
      },
      { slug: "missing/b" as FullSlug, frontmatter: { title: "나무" } } as QuartzPluginData,
      { slug: "missing/a" as FullSlug, frontmatter: { title: "가방" } } as QuartzPluginData,
    ])

    assert.deepEqual(
      index.notes.map((note) => note.title),
      ["가을", "하늘", "가방", "나무"],
    )
  })

  it("falls back to the final slug segment for a missing title and normalizes tags", () => {
    const index = buildStudyNotesIndex([
      {
        slug: "backend/spring/missing-title" as FullSlug,
        frontmatter: { tags: "spring" } as unknown as QuartzPluginData["frontmatter"],
      } as QuartzPluginData,
      {
        slug: "database/mysql/no-tags" as FullSlug,
        frontmatter: { tags: ["mysql", 42, null] } as unknown as QuartzPluginData["frontmatter"],
      } as QuartzPluginData,
    ])

    assert.equal(index.notes[0]?.title, "missing-title")
    assert.deepEqual(index.notes[0]?.tags, ["spring"])
    assert.deepEqual(index.notes[1]?.tags, ["mysql"])
  })

  it("derives and normalizes an excerpt from rendered HTML when descriptions are missing", () => {
    const index = buildStudyNotesIndex([
      {
        slug: "backend/spring/rendered" as FullSlug,
        htmlAst: {
          type: "root",
          children: [
            {
              type: "element",
              tagName: "p",
              properties: {},
              children: [{ type: "text", value: "Rendered" }],
            },
            {
              type: "element",
              tagName: "strong",
              properties: {},
              children: [{ type: "text", value: " HTML\n\n fallback" }],
            },
          ],
        },
      },
    ])

    assert.equal(index.notes[0]?.excerpt, "Rendered HTML fallback")
  })

  it("excludes fenced code blocks while keeping inline code in excerpts", () => {
    const index = buildStudyNotesIndex([
      {
        slug: "backend/spring/code-example" as FullSlug,
        htmlAst: {
          type: "root",
          children: [
            {
              type: "element",
              tagName: "p",
              properties: {},
              children: [
                { type: "text", value: "설명 " },
                {
                  type: "element",
                  tagName: "code",
                  properties: {},
                  children: [{ type: "text", value: "inlineCode" }],
                },
                { type: "text", value: " 다음 설명" },
              ],
            },
            {
              type: "element",
              tagName: "pre",
              properties: {},
              children: [
                {
                  type: "element",
                  tagName: "code",
                  properties: {},
                  children: [{ type: "text", value: "const hidden = true" }],
                },
              ],
            },
          ],
        },
      },
    ])

    assert.equal(index.notes[0]?.excerpt, "설명 inlineCode 다음 설명")
  })
})

describe("study note dates", () => {
  it("formats dates as YYYY-MM-DD in Korean time and missing dates as empty strings", () => {
    assert.equal(formatNoteDate(new Date("2026-08-15T13:45:00+09:00")), "2026-08-15")
    assert.equal(formatNoteDate(), "")
  })
})
