# Category Colors and Upload-Order Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each archive category a consistent accent, remove reading-time estimates, and order cards by the first Git commit that added each Markdown note.

**Architecture:** Keep Git access in a focused resolver and inject that resolver into the pure study-note catalog builder. Reuse the graph's existing `categoryColor()` function as the single category palette and expose it to CSS through a custom property.

**Tech Stack:** TypeScript, Preact, Quartz v5, SCSS, Node test runner, Git CLI

## Global Constraints

- Upload time is the committer timestamp of the earliest Git commit that added the current Markdown file.
- Later edits must not change card order.
- Unknown categories receive a deterministic fallback color.
- Card surfaces remain neutral in light and dark modes.
- Git history failures must not fail the Quartz build.

---

### Task 1: Resolve a note's first Git addition date

**Files:**

- Create: `quartz/components/git-upload-date.ts`
- Create: `quartz/components/git-upload-date.test.ts`

**Interfaces:**

- Produces: `createGitUploadDateResolver(startDirectory?: string): (filePath?: string) => Date | undefined`
- The returned resolver caches results by file path and returns `undefined` when Git or the path is unavailable.

- [ ] **Step 1: Write the failing integration tests**

Create a temporary Git repository, commit a Markdown file with a fixed committer date, edit it in a later commit, and assert that the resolver returns the first date. Add a second assertion that a missing repository returns `undefined`.

```ts
const resolveUploadDate = createGitUploadDateResolver(repository)
assert.equal(resolveUploadDate(notePath)?.toISOString(), "2026-08-01T09:00:00.000Z")
assert.equal(createGitUploadDateResolver(nonRepository)(notePath), undefined)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx tsx --test quartz/components/git-upload-date.test.ts`

Expected: FAIL because `git-upload-date.ts` and `createGitUploadDateResolver` do not exist.

- [ ] **Step 3: Implement the minimal resolver**

Use `execFileSync` without a shell. Discover the repository root with `git rev-parse --show-toplevel`, then query the file with:

```ts
;["log", "--diff-filter=A", "--follow", "--format=%cI", "--", relativePath]
```

Parse valid lines and return the final line, which is the earliest addition when Git emits newest-first history. Catch discovery and log failures and return `undefined`. Cache every result, including missing results.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npx tsx --test quartz/components/git-upload-date.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the resolver**

```bash
git add quartz/components/git-upload-date.ts quartz/components/git-upload-date.test.ts
git commit -m "feat: derive note upload dates from git history"
```

### Task 2: Sort and display cards by upload date

**Files:**

- Modify: `quartz/components/study-notes.ts`
- Modify: `quartz/components/study-notes.test.ts`
- Modify: `quartz/components/StudyNotes.tsx`
- Modify: `quartz/components/StudyNotes.test.tsx`
- Modify: `quartz/components/ArchiveSearch.tsx`

**Interfaces:**

- Consumes: `createGitUploadDateResolver()` from Task 1.
- Produces: `StudyNoteCard.uploaded?: Date` and `buildStudyNotesIndex(files, resolveUploadDate?)`.

- [ ] **Step 1: Write failing catalog tests**

Add an injected resolver keyed by `filePath`. Give one older-created file a newer modified date and assert that upload date controls the order. Also assert that equal or missing upload dates fall back to Korean title order.

```ts
const index = buildStudyNotesIndex(files, (filePath) => uploadedByPath.get(filePath ?? ""))
assert.deepEqual(
  index.notes.map((note) => note.title),
  ["새로 업로드", "먼저 업로드"],
)
assert.equal(index.notes[0]?.uploaded?.toISOString(), "2026-08-15T00:00:00.000Z")
```

- [ ] **Step 2: Run the catalog test and verify RED**

Run: `npx tsx --test quartz/components/study-notes.test.ts`

Expected: FAIL because the builder still sorts by `modified` and has no resolver parameter or `uploaded` field.

- [ ] **Step 3: Implement upload-date indexing**

Replace `modified` on `StudyNoteCard` with `uploaded`. Resolve it from Git first, then `file.dates.created`. Sort descending by `uploaded`, with Korean title order as the final tie-breaker.

- [ ] **Step 4: Write and run the failing component test**

Update the fixture to include `filePath` and `dates.created`. Assert that the rendered date is the upload date and that no `min read` text appears.

Run: `npx tsx --test quartz/components/StudyNotes.test.tsx`

Expected: FAIL until the component uses `uploaded`.

- [ ] **Step 5: Wire the resolver and upload date into UI components**

Create one resolver in `StudyNotes`, pass it to `buildStudyNotesIndex`, render `formatNoteDate(note.uploaded)`, and make `ArchiveSearch` display `uploaded` instead of `modified`.

- [ ] **Step 6: Run both focused test files**

Run: `npx tsx --test quartz/components/study-notes.test.ts quartz/components/StudyNotes.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit stable card ordering**

```bash
git add quartz/components/study-notes.ts quartz/components/study-notes.test.ts quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx quartz/components/ArchiveSearch.tsx
git commit -m "feat: order archive cards by first upload"
```

### Task 3: Apply category colors to cards and filters

**Files:**

- Modify: `quartz/components/StudyNotes.tsx`
- Modify: `quartz/components/StudyNotes.test.tsx`
- Modify: `quartz/styles/custom.scss`
- Modify: `quartz/archive-config.test.ts`

**Interfaces:**

- Consumes: `categoryColor(category: string): string` from `quartz/components/study-graph.ts`.
- Produces: `--study-category-color` on category buttons and cards.

- [ ] **Step 1: Write failing render and style tests**

Assert that BACKEND and DATABASE filters/cards receive their graph palette colors and that SCSS uses the custom property for badge, active filter, focus, and hover states.

```ts
assert.match(html, /data-study-filter="BACKEND"[^>]*style="--study-category-color:\s*#37c99b"/)
assert.match(html, /data-study-category="DATABASE"[^>]*style="--study-category-color:\s*#54a8ff"/)
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npx tsx --test quartz/components/StudyNotes.test.tsx quartz/archive-config.test.ts`

Expected: FAIL because the custom property is not rendered or consumed.

- [ ] **Step 3: Render the shared graph color**

Import `categoryColor` in `StudyNotes.tsx` and add this style to each dynamic category filter and card:

```tsx
style={`--study-category-color: ${categoryColor(category.key)}`}
```

Keep ALL on the normal site-brand color.

- [ ] **Step 4: Style restrained category accents**

Set a brand fallback on `.study-category-filter` and `a.study-card`. Use `color-mix()` for a subtle badge/filter background, a readable category-colored foreground, and a category-colored card hover border. Do not color the full card surface.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npx tsx --test quartz/components/StudyNotes.test.tsx quartz/archive-config.test.ts quartz/components/study-graph.test.ts`

Expected: PASS and graph color consistency remains green.

- [ ] **Step 6: Commit category accents**

```bash
git add quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx quartz/styles/custom.scss quartz/archive-config.test.ts
git commit -m "feat: distinguish archive categories with color"
```

### Task 4: Remove reading-time estimates

**Files:**

- Modify: `quartz.config.yaml`
- Modify: `quartz/archive-config.test.ts`

**Interfaces:**

- Configures `@quartz-community/content-meta` with `showReadingTime: false` and `showComma: false`.

- [ ] **Step 1: Write the failing configuration test**

```ts
assert.match(
  config,
  /source:\s*["']@quartz-community\/content-meta["'][\s\S]*?showReadingTime:\s*false/,
)
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npx tsx --test quartz/archive-config.test.ts`

Expected: FAIL because Content Meta has no options yet.

- [ ] **Step 3: Disable reading time**

Add:

```yaml
options:
  showReadingTime: false
  showComma: false
```

- [ ] **Step 4: Run the test and verify GREEN**

Run: `npx tsx --test quartz/archive-config.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the metadata cleanup**

```bash
git add quartz.config.yaml quartz/archive-config.test.ts
git commit -m "fix: remove reading-time estimates from notes"
```

### Task 5: Full verification

**Files:**

- Verify all changed files.

**Interfaces:**

- Consumes all deliverables from Tasks 1-4.
- Produces a deployable Quartz build.

- [ ] **Step 1: Run focused behavior tests**

Run: `npx tsx --test quartz/components/git-upload-date.test.ts quartz/components/study-notes.test.ts quartz/components/StudyNotes.test.tsx quartz/components/study-graph.test.ts quartz/archive-config.test.ts`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run the complete test suite**

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Run type checking and formatting**

Run: `npx tsc --noEmit`

Run: `npx prettier --check quartz.config.yaml quartz/components/git-upload-date.ts quartz/components/git-upload-date.test.ts quartz/components/study-notes.ts quartz/components/study-notes.test.ts quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx quartz/components/ArchiveSearch.tsx quartz/styles/custom.scss quartz/archive-config.test.ts`

Expected: both commands exit successfully.

- [ ] **Step 4: Build the production site**

Run: `npx quartz build`

Expected: `public/index.html` is emitted and the build exits successfully.

- [ ] **Step 5: Inspect the final diff and status**

Run: `git diff HEAD~4 --stat`

Run: `git status --short`

Expected: only planned files changed and the working tree is clean after task commits.
