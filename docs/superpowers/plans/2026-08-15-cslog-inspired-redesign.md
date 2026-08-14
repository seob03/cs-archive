# CSLog-Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Quartz home and note-reading experience into a simple, polished knowledge archive inspired by cslog, with automatic folder-driven categories and note cards.

**Architecture:** Keep Quartz as the static-site engine and replace the current presentation layer with one small data adapter (`study-notes.ts`), one home component (`StudyNotes.tsx`), a simplified Quartz layout configuration, and a clean custom stylesheet. The home catalog is generated at build time from Markdown under `content/`; the first path segment becomes the category, deeper segments become the card path, and no manually maintained category list is required.

**Tech Stack:** Quartz v5, TypeScript, Preact, SCSS, Node test runner (`tsx --test`), Quartz build pipeline.

## Global Constraints

- Preserve all imported study-note Markdown and links.
- Do not add analytics, fake view counts, activity heatmaps, bookmarks, comments, or sync-age UI.
- Remove unused visual plugins instead of merely hiding them.
- Home has no right sidebar. Note pages may show only a compact table of contents when headings exist.
- Categories and cards must update automatically from the `content/` folder structure on every build/push.
- Implement behavior with tests first: observe each focused test fail, add the smallest production change, then rerun it green.
- Keep the homepage accessible without client JavaScript; JavaScript only enhances category filtering.
- Use Korean-friendly line breaking and responsive layouts at desktop, tablet, and mobile widths.

---

## Task 1: Build a Folder-Driven Note Catalog

**Files:**

- Modify: `quartz/components/study-notes.ts`
- Modify: `quartz/components/study-notes.test.ts`

- [ ] **Step 1: Replace the existing test cases with catalog behavior tests**

Add fixtures for `backend/spring/jpa`, `database/mysql/index`, `database/mysql/transaction`, a root `index`, and a root note. Assert that:

- `index` and every `*/index` page are excluded.
- The newest modified note is first; equal or missing dates use Korean title order as a stable fallback.
- The first folder creates the category (`BACKEND`, `DATABASE`).
- Deeper folders create the display path (`BACKEND / SPRING`).
- Root notes fall into `GENERAL` so they remain publishable.
- Category counts match the resulting cards.
- HTML is stripped and whitespace is normalized for excerpts.
- Dates format as `YYYY-MM-DD` and missing dates render an empty string.

Target public API:

```ts
export type StudyNoteCard = {
  slug: FullSlug
  title: string
  excerpt: string
  categoryKey: string
  categoryLabel: string
  path: string[]
  modified?: Date
  tags: string[]
}

export type StudyNoteCategory = {
  key: string
  label: string
  count: number
}

export type StudyNotesIndex = {
  notes: StudyNoteCard[]
  categories: StudyNoteCategory[]
}

export function buildStudyNotesIndex(files: QuartzPluginData[]): StudyNotesIndex
export function formatNoteDate(date?: Date): string
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx tsx --test quartz/components/study-notes.test.ts`

Expected: failure because `buildStudyNotesIndex` and the new metadata shape do not exist.

- [ ] **Step 3: Implement the smallest catalog adapter**

Implementation rules:

- Normalize slug path segments once.
- Read title from frontmatter, then fall back to the final slug segment.
- Read description first; otherwise derive a short excerpt from rendered HTML.
- Normalize frontmatter tags into a string array.
- Sort notes by modified date descending, then `title.localeCompare(other.title, "ko")`.
- Derive categories from the resulting notes, sorted alphabetically, with `GENERAL` last.

- [ ] **Step 4: Rerun the focused test and confirm GREEN**

Run: `npx tsx --test quartz/components/study-notes.test.ts`

Expected: all catalog tests pass.

- [ ] **Step 5: Commit the catalog behavior**

```bash
git add quartz/components/study-notes.ts quartz/components/study-notes.test.ts
git commit -m "feat: derive study catalog from content folders"
```

---

## Task 2: Rebuild the Homepage Around Cards

**Files:**

- Modify: `quartz/components/StudyNotes.tsx`
- Modify: `quartz/components/StudyNotes.test.tsx`

- [ ] **Step 1: Write component tests for the approved home structure**

Use multiple note fixtures and assert:

- Non-index pages render `null`.
- The hero displays the real published-note and category counts.
- An `ALL` filter and dynamic category filters render with counts.
- Each card includes category badge, formatted date, title, two-line excerpt hook, and folder path.
- The first card receives `is-featured`; later cards do not.
- No old sequence number or arrow UI remains.
- Filtering hooks use `data-study-filter` and `data-study-category` values generated from the catalog.

- [ ] **Step 2: Run the focused component test and confirm RED**

Run: `npx tsx --test quartz/components/StudyNotes.test.tsx`

Expected: failures for the new hero, dynamic filters, card metadata, and featured-card structure.

- [ ] **Step 3: Implement the new homepage markup**

Use this semantic structure:

```tsx
<section class="study-home">
  <header class="study-hero">
    <div class="study-frame">...</div>
  </header>
  <nav class="study-category-bar" aria-label="노트 카테고리">
    <div class="study-frame">...</div>
  </nav>
  <div class="study-catalog">
    <div class="study-frame">
      <div class="study-card-grid">...</div>
    </div>
  </div>
</section>
```

Use the headline `배운 CS를 오래 남기는 공간` with a restrained indigo accent and the publication line `${notes.length} NOTES PUBLISHED`. Keep all counts real. Render every card server-side. Add a small inline script that toggles `hidden` and active filter state; if the script does not run, all cards remain visible.

- [ ] **Step 4: Rerun the focused component test and confirm GREEN**

Run: `npx tsx --test quartz/components/StudyNotes.test.tsx`

Expected: all homepage component tests pass.

- [ ] **Step 5: Commit the homepage rebuild**

```bash
git add quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx
git commit -m "feat: rebuild homepage as a dynamic note catalog"
```

---

## Task 3: Simplify Quartz Layout and Plugins

**Files:**

- Modify: `quartz.config.yaml`
- Modify if needed: `quartz.ts`
- Modify if needed: `quartz/components/study-notes-layout.ts`
- Modify if needed: `quartz/components/study-notes-layout.test.ts`
- Modify: `content/index.md`

- [ ] **Step 1: Add or update layout tests before changing layout injection**

Only if the current injector cannot produce the required structure, add assertions that the home catalog is inserted once and ordinary content pages retain their article body. Run:

`npx tsx --test quartz/components/study-notes-layout.test.ts`

Expected: RED only for the newly specified layout behavior.

- [ ] **Step 2: Remove unused visual plugins from configuration**

- Set the wordmark/page title to `seob.log()`.
- Keep search and dark-mode controls in the header.
- Keep breadcrumbs, article title, content metadata, and table of contents on note pages.
- Disable Graph, Explorer, Reader Mode, Note Properties, backlinks, tag list, and comments.
- Keep the right sidebar empty on the home page and limited to TOC on notes.
- Keep `content/index.md` as lightweight frontmatter only so the generated catalog is the entry page.

- [ ] **Step 3: Make the smallest layout-code adjustment if tests require it**

Do not fork Quartz rendering. Preserve the current `augmentStudyNotesLayout` mechanism unless a failing test proves it insufficient.

- [ ] **Step 4: Run layout tests and build acceptance check**

Run:

```bash
npx tsx --test quartz/components/study-notes-layout.test.ts
npx quartz build
```

Expected: layout tests pass and Quartz emits the site without plugin/config errors.

- [ ] **Step 5: Inspect generated home and note HTML**

Confirm with `rg` in `public/` that:

- The home contains `study-home`, generated category controls, and cards.
- The home does not contain graph, reader-mode, or note-properties controls.
- A representative note with headings contains a TOC.

- [ ] **Step 6: Commit the simplified layout**

```bash
git add quartz.config.yaml quartz.ts quartz/components/study-notes-layout.ts quartz/components/study-notes-layout.test.ts content/index.md
git commit -m "refactor: simplify Quartz navigation and note layout"
```

---

## Task 4: Replace Legacy Styling with a Cohesive Design System

**Files:**

- Replace: `quartz/styles/custom.scss`

- [ ] **Step 1: Remove the legacy stylesheet and define a compact token layer**

Use these base tokens and equivalent dark-mode values:

```scss
:root {
  --site-bg: #fff;
  --site-paper: #fff;
  --site-paper-2: #fafafa;
  --site-ink: #0a0a0a;
  --site-muted: #4b5563;
  --site-faint: #9ca3af;
  --site-border: #ececee;
  --site-brand: #4f46e5;
  --site-brand-soft: #eef2ff;
  --site-success: #059669;
  --site-code: #0a0a0a;
  --site-frame: 1280px;
  --site-prose: 760px;
  --site-toc: 240px;
  --site-header: 64px;
}
```

Use Inter for UI/body and JetBrains Mono for metadata, badges, and code, with system fallbacks.

- [ ] **Step 2: Implement the global shell and header**

- Sticky 64px header with a centered 1280px inner frame.
- `seob.log()` wordmark on the left; search and theme controls on the right.
- Thin border, white/near-black surfaces, no heavy shadows.
- Hide empty Quartz columns structurally; never reserve 250px for an empty sidebar.

- [ ] **Step 3: Implement the home visual hierarchy**

- Spacious but compact hero with green publication indicator, large headline, and two real statistics.
- Horizontal category pills with active indigo state and keyboard-visible focus.
- Cards in three columns desktop, two tablet, one mobile.
- Newest card spans two columns only on desktop.
- Card title clamps to two lines; excerpt clamps to two lines; full title remains available via the link's `title` attribute.
- Use borders and subtle surface changes instead of decorative arrows or large shadows.

- [ ] **Step 4: Implement the note reading layout**

Desktop note layout:

```scss
body:not([data-slug="index"]) #quartz-body:has(.right.sidebar:not(:empty)) {
  grid-template-columns: minmax(0, 1fr) var(--site-toc);
}

.right.sidebar:empty {
  display: none;
}
```

- Center the reading column at approximately 760px.
- Use a 36px desktop title with natural wrapping; reduce it on small screens.
- Keep metadata, breadcrumb, and tags quiet.
- Make the TOC a compact sticky bordered panel; hide it below 960px.

- [ ] **Step 5: Polish Markdown, highlight, table, and code rendering**

- Body text: 16px, approximately 1.75 line-height.
- Light tables with fine borders and comfortable cell padding.
- Inline code: pale neutral background with indigo foreground.
- Obsidian `==highlight==`: marker-like translucent accent, no gray rounded box.
- Fenced code blocks: near-black surface in both themes, clear language/copy header, readable comments and punctuation.
- Override Shiki token colors only as needed to guarantee light/dark contrast on the always-dark code surface.

- [ ] **Step 6: Format and build**

Run:

```bash
npx prettier quartz/styles/custom.scss quartz/components/StudyNotes.tsx quartz/components/study-notes.ts --write
npx quartz build
```

Expected: formatting succeeds and the site builds.

- [ ] **Step 7: Inspect generated output at desktop, tablet, and mobile breakpoints**

Verify the generated HTML/CSS for:

- 1280px maximum frame and no fixed empty right gap.
- 3/2/1 card grid.
- Featured card spanning only at desktop width.
- Note TOC hidden at tablet/mobile width.
- Long titles wrapping/clamping without overlaying adjacent content.
- Code and highlight contrast in light and dark themes.

- [ ] **Step 8: Commit the visual system**

```bash
git add quartz/styles/custom.scss
git commit -m "feat: apply a clean cslog-inspired visual system"
```

---

## Task 5: Full Verification and Cleanup

**Files:**

- Review all files changed by Tasks 1–4
- Remove only obsolete code directly replaced by the redesign

- [ ] **Step 1: Run focused tests**

```bash
npx tsx --test quartz/components/study-notes.test.ts
npx tsx --test quartz/components/StudyNotes.test.tsx
npx tsx --test quartz/components/study-notes-layout.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 2: Run the full automated suite**

```bash
npm test
npx tsc --noEmit
```

Expected: tests and type checking pass. If repository-wide Prettier reports imported Markdown formatting, do not rewrite user notes; format and check only changed source files.

- [ ] **Step 3: Build the production site**

Run: `npx quartz build`

Expected: Quartz completes successfully and emits all pages to `public/`.

- [ ] **Step 4: Perform static acceptance checks**

Use `rg` against generated files to verify:

- Note and category counts are real and present.
- Category values correspond to current top-level content folders.
- Root/folder index pages are absent from cards.
- Home has no graph or blank right rail.
- Notes with headings have TOC markup.
- No old sequence-number or arrow-card class remains.

- [ ] **Step 5: Review the final diff for accidental content changes**

Run:

```bash
git status --short
git diff --stat
git diff --check
```

Confirm no imported Markdown notes were unintentionally reformatted or deleted.

- [ ] **Step 6: Commit any final cleanup**

```bash
git add <only-final-cleanup-files>
git commit -m "chore: finish redesign cleanup"
```

- [ ] **Step 7: Hand off with evidence**

Report the exact tests/build commands run, their results, the changed visual behavior, and whether the branch is ready to push. Do not claim completion until all required checks have passed.
