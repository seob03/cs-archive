export type StudyActivityDay = {
  date: string
  count: number
  level: number
  isFuture: boolean
}

export type StudyActivityGrid = StudyActivityDay[][]

export const studyActivityWeekCount = 24

type StudyActivityNote = {
  uploaded?: Date
}

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

function dateKey(date: Date): string {
  const values = Object.fromEntries(
    dateFormatter.formatToParts(date).map(({ type, value }) => [type, value]),
  )
  return `${values.year}-${values.month}-${values.day}`
}

function dateFromKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

export function buildStudyActivityGrid(
  notes: readonly StudyActivityNote[],
  weekCount = studyActivityWeekCount,
  referenceDate = new Date(),
): StudyActivityGrid {
  const safeWeekCount = Math.max(1, Math.floor(weekCount))
  const counts = new Map<string, number>()

  for (const note of notes) {
    if (!(note.uploaded instanceof Date) || Number.isNaN(note.uploaded.getTime())) continue

    const key = dateKey(note.uploaded)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const safeReferenceDate =
    referenceDate instanceof Date && !Number.isNaN(referenceDate.getTime())
      ? referenceDate
      : new Date()
  const referenceKey = dateKey(safeReferenceDate)
  const endDate = dateFromKey(referenceKey)
  endDate.setUTCDate(endDate.getUTCDate() + (6 - endDate.getUTCDay()))
  const startDate = addDays(endDate, -(safeWeekCount * 7 - 1))
  const weeks: StudyActivityGrid = []

  for (let weekIndex = 0; weekIndex < safeWeekCount; weekIndex += 1) {
    const week: StudyActivityDay[] = []
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const currentDate = addDays(startDate, weekIndex * 7 + dayIndex)
      const key = dateKey(currentDate)
      const isFuture = key > referenceKey
      week.push({
        date: key,
        count: isFuture ? 0 : (counts.get(key) ?? 0),
        level: 0,
        isFuture,
      })
    }
    weeks.push(week)
  }

  const maxCount = Math.max(0, ...weeks.flat().map((day) => day.count))
  return weeks.map((week) =>
    week.map((day) => ({
      ...day,
      level: day.count === 0 || maxCount === 0 ? 0 : Math.ceil((day.count / maxCount) * 4),
    })),
  )
}
