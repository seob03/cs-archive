# Task 1 Report: Folder-Driven Note Catalog

## Changed files

- `quartz/components/study-notes.ts`
- `quartz/components/study-notes.test.ts`

## RED

Command:

```text
npx tsx --test quartz/components/study-notes.test.ts
```

Result: failed as expected before implementation. The module import failed because `./study-notes` did not export `buildStudyNotesIndex` (and the new metadata API did not yet exist).

## GREEN

Focused command:

```text
npx tsx --test quartz/components/study-notes.test.ts
```

Result: 4 tests passed, 0 failed.

Additional verification:

- `npm test`: 168 tests passed, 0 failed.
- `npx tsc --noEmit`: passed.
- Prettier check on both changed files: passed.
- `git diff --check`: passed.

## Implementation notes

- Added the `StudyNoteCard`, `StudyNoteCategory`, `StudyNotesIndex`, `buildStudyNotesIndex`, and `formatNoteDate` API.
- Excludes root and nested `index` slugs, normalizes slug segments, derives folder categories and paths, and assigns root notes to `GENERAL`.
- Sorts modified notes newest-first, with Korean title ordering for equal or missing dates.
- Uses frontmatter title/description/tags when available, falls back to the final slug segment and rendered HTML text, and normalizes excerpts.
- Kept `selectStudyNotes` as a compatibility adapter for the existing component without changing files outside the brief’s implementation/test scope.

## Self-review

- The focused tests cover the required fixture slugs, index exclusion, date/title ordering, category/path derivation, root notes, counts, excerpt normalization, title/tag fallbacks, and date formatting.
- The implementation is limited to the two Task 1 source/test files.
- Full repository tests and TypeScript verification pass.

## Commit hash

`bf416e6ee91d3c08b2e1ff9ca4aeef6265183b6d`

## Concerns

- The existing `StudyNotes.tsx` still consumes the legacy `selectStudyNotes` adapter; later homepage work should migrate it to `buildStudyNotesIndex` when that component is redesigned.

## Fix Round 1

### Finding 1

No Task 2 files were changed. The new `buildStudyNotesIndex` API already exposes the generated `categories` list in its `StudyNotesIndex` result for Task 2. The live homepage integration remains tracked for Task 2, where the static `StudyNotes.tsx` filters will be replaced with the catalog categories.

### Finding 2

Added a rendered-HTML fallback coverage fixture to `quartz/components/study-notes.test.ts`. The fixture has no frontmatter or file description and asserts that nested rendered HTML text is stripped and whitespace-normalized into the excerpt. No production change was necessary.

Covering command:

```text
npx tsx --test quartz/components/study-notes.test.ts
```

Output summary: 5 tests passed, 0 failed; 2 suites passed.

Additional checks: `npx prettier quartz/components/study-notes.test.ts --check`, `npx tsc --noEmit`, and `git diff --check` all passed.

Changed files:

- `quartz/components/study-notes.test.ts`
- This report file

Fix commit: `22b3eb7cc26a935ff155f0da6bc67550c27c8284`

Concern status: `DONE_WITH_CONCERNS` — Task 2 still owns migrating the live homepage from static filters/legacy adapter consumption to the catalog API.
