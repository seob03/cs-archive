# Study Notes Clean Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the decorative Quartz home page with an automatically generated, card-based Spring notes archive and make note pages wider, calmer, and easier to read.

**Architecture:** A local `StudyNotes` Preact component will receive Quartz's `allFiles` metadata, filter the existing `BACKEND/SPRING` notes, and render category filters plus note cards only on the root page. Pure selection and excerpt logic will live in a small helper module with node tests. `quartz.ts` will augment the YAML-generated page dispatcher so the custom component participates in normal resource collection without modifying community packages. Layout configuration and `custom.scss` will remove the folder explorer, move utility controls into the header, enable a compact local graph above the TOC, widen the reading column, and unify home/search card styling.

**Tech Stack:** Quartz v5, TypeScript, Preact JSX, SCSS, YAML configuration, Node's built-in test runner via `tsx --test`, esbuild.

## Global Constraints

- The home route must immediately show the study notes instead of a separate hero or knowledge-map page.
- All existing Spring notes must appear as cards with a title and one or two lines of body preview.
- The left folder-style explorer must not occupy the primary desktop view; search must remain accessible.
- Categories must be centered near the content and limited to the requested top-level navigation.
- Note titles must be smaller, truncate with an ellipsis, and reveal the full title on hover/focus.
- The main reading column must use available width without creating an uncomfortable text measure.
- Note pages must show a related local graph above a compact TOC in the right rail.
- Light-mode code blocks must keep comments and muted syntax tokens readable.
- Home cards and search results must use one visual system.
- Do not rewrite note content or add a global knowledge graph in this pass.

---

### Task 1: Define and test note-card data selection

**Files:**
- Create: `quartz/components/study-notes.ts`
- Test: `quartz/components/study-notes.test.ts`

**Interfaces:**
- Produces `StudyNoteCard` with `slug`, `title`, `excerpt`, and `categories` fields for the renderer.
- Produces `selectStudyNotes(files: QuartzPluginData[]): StudyNoteCard[]`.
- Produces `summarizeNote(description?: string, fallback?: string): string`.

- [ ] **Step 1: Write failing tests for filtering, sorting, and excerpts**

```ts
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { selectStudyNotes, summarizeNote } from "./study-notes"

describe("study note data", () => {
  it("selects Spring notes, excludes folder indexes, and sorts by title", () => {
    const cards = selectStudyNotes([
      { slug: "backend/spring/z-note", frontmatter: { title: "Z note" }, description: "z" },
      { slug: "backend/spring/index", frontmatter: { title: "Spring" }, description: "folder" },
      { slug: "backend/spring/a-note", frontmatter: { title: "A note" }, description: "a" },
      { slug: "backend/other-note", frontmatter: { title: "Other" }, description: "other" },
    ])

    assert.deepEqual(cards.map((card) => card.title), ["A note", "Z note"])
    assert.deepEqual(cards[0]?.categories, ["BACKEND", "SPRING"])
  })

  it("normalizes HTML entities and truncates a preview", () => {
    const excerpt = summarizeNote("A &quot;useful&quot; note\nwith extra spacing", "fallback")

    assert.equal(excerpt, 'A "useful" note with extra spacing')
  })
})
```

- [ ] **Step 2: Run the focused test and verify the expected missing-module failure**

Run: `npm test -- quartz/components/study-notes.test.ts`

Expected: FAIL because `quartz/components/study-notes.ts` does not exist yet.

- [ ] **Step 3: Implement the smallest pure helper module**

```ts
export type StudyNoteCard = {
  slug: FullSlug
  title: string
  excerpt: string
  categories: string[]
}

export function summarizeNote(description?: string, fallback = "노트 내용을 열어보세요."): string {
  const normalized = unescapeHTML(description ?? "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  return (normalized || fallback).slice(0, 150)
}

export function selectStudyNotes(files: QuartzPluginData[]): StudyNoteCard[] {
  return files
    .filter((file) => file.slug?.startsWith("backend/spring/") && !file.slug.endsWith("/index"))
    .map((file) => ({
      slug: file.slug as FullSlug,
      title: file.frontmatter?.title ?? file.slug!.split("/").at(-1)!,
      excerpt: summarizeNote(file.description),
      categories: ["BACKEND", "SPRING"],
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "ko"))
}
```

The implementation must use the existing `unescapeHTML` and `resolveRelative` path utilities rather than duplicating HTML or URL handling.

- [ ] **Step 4: Run the focused test and the full existing test suite**

Run: `npm test -- quartz/components/study-notes.test.ts`

Expected: PASS with both focused tests passing.

Run: `npm test`

Expected: PASS with zero failures.

- [ ] **Step 5: Commit the data helper and tests**

```bash
git add quartz/components/study-notes.ts quartz/components/study-notes.test.ts
git commit -m "test: define study note card data"
```

### Task 2: Render the automatic home card component

**Files:**
- Create: `quartz/components/StudyNotes.tsx`
- Create: `quartz/components/StudyNotes.test.tsx`

**Interfaces:**
- Consumes `selectStudyNotes` and `summarizeNote` from Task 1.
- Produces a `StudyNotes` `QuartzComponent` that returns `null` unless `fileData.slug === "index"`.
- Renders `.study-notes`, `.study-notes-filters`, `.study-notes-grid`, and `.study-note-card` markup.

- [ ] **Step 1: Write failing render tests for home-only behavior and card markup**

```tsx
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import StudyNotes from "./StudyNotes"

const props = (slug: string) => ({
  fileData: { slug },
  allFiles: [
    { slug: "backend/spring/@bean", frontmatter: { title: "@Bean" }, description: "Register a bean." },
  ],
}) as any

describe("StudyNotes component", () => {
  it("does not render on a note page", () => {
    assert.equal(render(StudyNotes(props("backend/spring/@bean"))), "")
  })

  it("renders filters and the card title/excerpt on the home page", () => {
    const html = render(StudyNotes(props("index")))

    assert.match(html, /study-notes-filters/)
    assert.match(html, /@Bean/)
    assert.match(html, /Register a bean\./)
  })
})
```

- [ ] **Step 2: Run the focused render test and verify it fails because the component is missing**

Run: `npm test -- quartz/components/study-notes.test.tsx`

Expected: FAIL because `quartz/components/StudyNotes.tsx` does not exist yet.

- [ ] **Step 3: Implement the component and its filter script**

The component will:

- return `null` away from the root page;
- render a restrained `SPRING NOTES` eyebrow and note count;
- render `ALL NOTES`, `BACKEND`, and `SPRING` buttons with `data-filter` values;
- add each card's category names as `data-categories` and link with `resolveRelative(fileData.slug!, card.slug)`;
- use `title` attributes for full card titles while CSS handles visual truncation;
- expose an `afterDOMLoaded` script that listens to `nav` and `render`, toggles `hidden` on cards, updates the visible count, and registers cleanup with `window.addCleanup`.

The script must gracefully do nothing when `.study-notes` is absent so the component can safely be part of shared layout resources.

- [ ] **Step 4: Run focused tests and full tests**

Run: `npm test -- quartz/components/study-notes.test.tsx`

Expected: PASS with both render tests passing.

Run: `npm test`

Expected: PASS with zero failures.

- [ ] **Step 5: Commit the component**

```bash
git add quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx
git commit -m "feat: render study note cards on home"
```

### Task 3: Connect the component and simplify layout configuration

**Files:**
- Modify: `quartz.ts`
- Modify: `quartz.config.yaml`
- Modify: `content/index.md`

**Interfaces:**
- Consumes the `StudyNotes` component from Task 2.
- Replaces the YAML-created `PageTypeDispatcher` emitter with a new dispatcher whose default `beforeBody` list includes `StudyNotes`.
- Keeps the exported `layout` in sync with the dispatcher so both runtime paths use the same component layout.

- [ ] **Step 1: Add the dispatcher augmentation before changing visual styles**

In `quartz.ts`, load the config and layout, create:

```ts
const augmentedLayout = {
  ...baseLayout,
  defaults: {
    ...baseLayout.defaults,
    beforeBody: [...(baseLayout.defaults.beforeBody ?? []), StudyNotes],
  },
}
```

Then replace only the emitter named `PageTypeDispatcher` with `PageTypeDispatcher({ defaults: augmentedLayout.defaults, byPageType: augmentedLayout.byPageType })` before exporting `config`. This is required because `loadQuartzConfig()` constructs its own dispatcher before `quartz.ts` exports `layout`.

- [ ] **Step 2: Update YAML layout positions and plugin options**

Apply these exact behavior changes:

- set `explorer.enabled` to `false`;
- move `page-title`, `search`, `darkmode`, and `reader-mode` to `header` so the left column is no longer needed for utilities;
- set search `enablePreview: false` and preserve title/content field priority;
- set `article-title`, `content-meta`, and `note-properties` to `condition: not-index`;
- enable graph at `right` priority `10` with local depth `1`, no tags, a compact font size, and a short link distance;
- disable the mobile-only spacer because the left sidebar is removed;
- keep the TOC at right priority `30`, after graph.

- [ ] **Step 3: Replace the decorative home Markdown with frontmatter only**

`content/index.md` should retain the home title and description, but remove the hero, metrics, knowledge-map card, and instructions. The generated `StudyNotes` component is the home body.

- [ ] **Step 4: Build to verify layout wiring before styling**

Run: `npx quartz build`

Expected: exit 0; generated `public/index.html` contains `.study-notes` and a note card, and at least one note page contains `.graph` and `.toc`.

- [ ] **Step 5: Commit layout wiring**

```bash
git add quartz.ts quartz.config.yaml content/index.md
git commit -m "feat: simplify notes layout and navigation"
```

### Task 4: Implement the reading-first visual system

**Files:**
- Modify: `quartz/styles/custom.scss`

**Interfaces:**
- Styles the markup from Task 2 and existing Quartz search/graph/TOC markup without changing community package code.

- [ ] **Step 1: Remove obsolete home hero/card selectors and add the compact archive styles**

Add styles for:

- a border-light header with centered, wrapping category filters;
- two-column desktop `.study-notes-grid` cards and one-column mobile cards;
- title/excerpt line clamps, thin borders, quiet hover state, focus-visible outline, and subtle arrow treatment;
- hidden cards using `[hidden] { display: none; }` within the component;
- search `.result-card` styling that mirrors `.study-note-card`.

- [ ] **Step 2: Rework the desktop grid and article measure**

At desktop widths, hide the empty left sidebar and set the grid areas to header/center/right with a compact right column. Remove the `860px` center max-width, use the available center width, and set article text measure independently so prose remains readable. At tablet/mobile widths, stack the right rail below the article and keep header controls usable.

- [ ] **Step 3: Reduce title scale and add hover/focus disclosure**

Set `.article-title` to a compact `clamp()` range, with `white-space: nowrap`, `overflow: hidden`, and `text-overflow: ellipsis`. On hover/focus-visible, allow wrapping and paint a paper background above neighboring content.

- [ ] **Step 4: Fix light-mode code contrast and right-rail density**

Keep the code surface dark and override Shiki token spans inside `pre[data-language]` to use readable dark-theme token variables on the dark surface. Explicitly brighten comment tokens. Reduce graph/TOC padding and hide the global-graph affordance so the right rail focuses on local relationships.

- [ ] **Step 5: Format and run the stylesheet/type checks**

Run: `npx prettier quartz/styles/custom.scss --write`

Run: `npm run check`

Expected: exit 0 with no TypeScript or Prettier errors.

- [ ] **Step 6: Commit the visual system**

```bash
git add quartz/styles/custom.scss
git commit -m "style: refine study notes reading experience"
```

### Task 5: Verify production output and local interaction

**Files:**
- Modify only if verification finds a concrete regression in the files above.

- [ ] **Step 1: Run the complete automated checks**

Run: `npm test`

Expected: PASS with zero failures.

Run: `npm run check`

Expected: exit 0.

Run: `npx quartz build`

Expected: exit 0 and a complete `public/` output.

- [ ] **Step 2: Inspect generated home and note HTML**

Check the generated output with:

```bash
rg -n "study-notes|study-note-card|study-notes-filter" public/index.html
rg -n "graph|toc|article-title|data-language" public/backend/spring/@bean/index.html
```

Expected: home cards and centered filters exist; note output includes graph, TOC, smaller title markup, and code-language markup where the note contains code.

- [ ] **Step 3: Start the local preview and smoke-test routes**

Run: `npx quartz build --serve`

Then request `http://localhost:8080/` and `http://localhost:8080/backend/spring/@bean` and confirm both return HTTP 200. Confirm the homepage HTML contains all selected note cards and note pages do not render the explorer.

- [ ] **Step 4: Review the requirements checklist and record any gaps**

Re-read `docs/superpowers/specs/2026-08-14-study-notes-clean-layout-design.md` and verify each acceptance criterion against fresh build output. If a criterion fails, fix it and repeat Task 5 before reporting completion.

- [ ] **Step 5: Commit only verified fixes**

```bash
git add quartz/components/study-notes.ts quartz/components/study-notes.test.ts quartz/components/StudyNotes.tsx quartz/components/StudyNotes.test.tsx quartz.ts quartz.config.yaml content/index.md quartz/styles/custom.scss
git commit -m "fix: polish study notes verification findings"
```

