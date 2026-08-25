import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { buildStudyActivityGrid } from "./study-activity"

const date = (value: string) => new Date(`${value}T00:00:00.000Z`)

describe("study activity grid", () => {
  it("defaults to a compact 24-week view", () => {
    const grid = buildStudyActivityGrid([], undefined, date("2026-08-25"))

    assert.equal(grid.length, 24)
    assert.equal(
      grid.every((week) => week.length === 7),
      true,
    )
  })

  it("aligns the grid to complete Sunday-to-Saturday weeks and counts uploaded notes", () => {
    const grid = buildStudyActivityGrid(
      [
        { uploaded: date("2026-08-25") },
        { uploaded: date("2026-08-25") },
        { uploaded: date("2026-08-20") },
      ],
      2,
      date("2026-08-25"),
    )

    assert.equal(grid.length, 2)
    assert.equal(
      grid.every((week) => week.length === 7),
      true,
    )
    assert.equal(grid[0]?.[0]?.date, "2026-08-16")
    assert.equal(grid[1]?.[6]?.date, "2026-08-29")
    assert.deepEqual(
      grid[1]?.find((day) => day.date === "2026-08-25"),
      {
        date: "2026-08-25",
        count: 2,
        level: 4,
        isFuture: false,
      },
    )
    assert.deepEqual(
      grid[0]?.find((day) => day.date === "2026-08-20"),
      {
        date: "2026-08-20",
        count: 1,
        level: 2,
        isFuture: false,
      },
    )
  })

  it("marks the remaining days in the current week as future dates", () => {
    const grid = buildStudyActivityGrid([], 1, date("2026-08-25"))

    assert.deepEqual(
      grid[0]?.map((day) => ({ date: day.date, isFuture: (day as any).isFuture })),
      [
        { date: "2026-08-23", isFuture: false },
        { date: "2026-08-24", isFuture: false },
        { date: "2026-08-25", isFuture: false },
        { date: "2026-08-26", isFuture: true },
        { date: "2026-08-27", isFuture: true },
        { date: "2026-08-28", isFuture: true },
        { date: "2026-08-29", isFuture: true },
      ],
    )
  })

  it("uses the supplied reference date when no note has an upload date", () => {
    const grid = buildStudyActivityGrid([{ uploaded: undefined }], 1, date("2026-08-25"))

    assert.equal(grid[0]?.[0]?.date, "2026-08-23")
    assert.equal(grid[0]?.[6]?.date, "2026-08-29")
    assert.equal(
      grid[0]?.every((day) => day.count === 0 && day.level === 0),
      true,
    )
  })
})
