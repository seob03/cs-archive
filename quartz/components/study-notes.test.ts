import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { buildStudyNotesIndex, formatNoteDate } from "./study-notes"
import { FullSlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"

const modified = (value: string) => new Date(`${value}T00:00:00.000Z`)

describe("study note catalog", () => {
  it("builds a folder-driven catalog and excludes index pages", () => {
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
      modified: modified("2026-08-15"),
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

  it("uses Korean title order when dates are equal or missing", () => {
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
})

describe("study note dates", () => {
  it("formats dates as YYYY-MM-DD and missing dates as empty strings", () => {
    assert.equal(formatNoteDate(new Date("2026-08-15T13:45:00.000Z")), "2026-08-15")
    assert.equal(formatNoteDate(), "")
  })
})
