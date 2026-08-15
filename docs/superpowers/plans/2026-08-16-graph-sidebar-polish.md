# Graph and Sidebar Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the archive graphs, refine the note sidebar and code-copy control, and replace the Quartz README with a concise personal archive introduction.

**Architecture:** Use the existing study graph data model and one D3 renderer for the home preview, full-screen graph, and note-local graph. Replace the Quartz graph plugin in the detail sidebar with a focused local component so category color, hover labels, link routing, and fit-to-view behavior remain consistent. Keep visual-only spacing and copy-button work in the existing custom stylesheet.

**Tech Stack:** Quartz v5, Preact, TypeScript, D3 loaded by the existing client script, SCSS, Node test runner.

## Global Constraints

- Preserve unrelated staged and unstaged user changes.
- Graph nodes represent note markdown files only; folder and tag index pages stay excluded.
- The detail graph shows the current note and directly connected notes only.
- Do not create commits unless the user explicitly asks.
- The public site URL is `https://seob03.github.io/cs-note/`.

---

### Task 1: Shared Graph Data and Components

**Files:**

- Modify: `quartz/components/study-graph.ts`
- Modify: `quartz/components/study-graph.test.ts`
- Modify: `quartz/components/StudyGraph.tsx`
- Create: `quartz/components/RelatedGraph.tsx`
- Modify: `quartz/components/StudyNotes.test.tsx`
- Create: `quartz/components/RelatedGraph.test.tsx`

**Interfaces:**

- Produces: `buildRelatedStudyGraphData(data, currentSlug, depth)` returning the current note plus direct neighbors.
- Produces: `RelatedGraph` rendering a sidebar graph with shared graph JSON and no expansion control.
- Consumes: `StudyGraphData`, `buildStudyGraphData`, and the existing Quartz component props.

- [ ] **Step 1: Write failing graph-data and component tests**

Add tests proving that a local graph includes the current note and direct neighbors, preserves category colors, omits unrelated notes, renders no expand button, and that the home Graph button contains only the `Graph` label plus category filter controls.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npx tsx --test quartz/components/study-graph.test.ts quartz/components/StudyNotes.test.tsx quartz/components/RelatedGraph.test.tsx`

Expected: FAIL because the local graph helper/component and category controls do not exist and the arrow label remains.

- [ ] **Step 3: Implement the shared graph data and components**

Add the local-neighborhood helper, render category counts in the full graph header, remove the arrow mark, and implement the compact sidebar graph component.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same focused test command and expect all tests to pass.

### Task 2: Graph Interaction and Layout Integration

**Files:**

- Modify: `quartz/components/study-graph-script.ts`
- Modify: `quartz/components/study-notes-layout.ts`
- Modify: `quartz/components/study-notes-layout.test.ts`
- Modify: `quartz.ts`
- Modify: `quartz.config.yaml`
- Modify: `quartz/archive-config.test.ts`

**Interfaces:**

- Consumes: graph roots with optional preview, overlay, filter, tooltip, and current-slug attributes.
- Produces: hover/focus note labels, category filtering, fit-to-view transforms, and current-note styling for every graph mode.

- [ ] **Step 1: Write failing layout and configuration tests**

Assert that the related graph is appended to the content right sidebar, the legacy Quartz graph plugin is disabled, and the custom graph script exposes category filtering, tooltip, and fit-to-view hooks.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npx tsx --test quartz/components/study-notes-layout.test.ts quartz/archive-config.test.ts quartz/components/study-graph.test.ts`

Expected: FAIL because the custom sidebar graph is not wired and the legacy plugin remains enabled.

- [ ] **Step 3: Implement renderer and layout changes**

Refactor the client renderer to support home and detail roots, show an immediate title tooltip on pointer/focus, filter the full graph by category, and synchronously fit graph bounds with conservative scale caps for preview and full modes. Insert `RelatedGraph` before the table of contents and disable the legacy graph plugin.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the same focused test command and expect all tests to pass.

### Task 3: Sidebar and Code Block Polish

**Files:**

- Modify: `quartz/styles/custom.scss`
- Modify: `quartz/archive-config.test.ts`

**Interfaces:**

- Consumes: `.related-graph`, `.toc`, `.backlinks`, `.clipboard-button`, and graph filter/tooltip markup.
- Produces: a compact always-open sidebar, correctly sized copy control, readable graph tooltip, filters, and responsive graph views.

- [ ] **Step 1: Update style contract tests and verify RED**

Change style expectations to require an always-open TOC without its fold icon, reduced sidebar gaps and card padding, a fixed square copy button with zero padding and constrained SVG, and no legacy graph expand-icon overrides.

Run: `npx tsx --test quartz/archive-config.test.ts`

Expected: FAIL against the current bulky cards and inherited copy-button dimensions.

- [ ] **Step 2: Implement compact responsive styles**

Style the related graph as a light, thin card; reduce TOC/backlink header and list spacing; force the TOC open and hide the fold affordance; set the copy button and icon dimensions explicitly; add filter and tooltip states for both themes.

- [ ] **Step 3: Run style tests and verify GREEN**

Run: `npx tsx --test quartz/archive-config.test.ts`

Expected: PASS.

### Task 4: README and Final Verification

**Files:**

- Modify: `README.md`

**Interfaces:**

- Produces: a concise repository landing page for Seob's CS study archive with the public site link.

- [ ] **Step 1: Replace template README**

Use a short title, one-line purpose statement, compact technology/content notes, and a visible link to `https://seob03.github.io/cs-note/`. Remove Quartz marketing and sponsor content.

- [ ] **Step 2: Run full automated verification**

Run: `npm test`

Run: `npx tsc --noEmit`

Run: `npx prettier --check quartz/components quartz/styles/custom.scss quartz.ts README.md`

Run: `npx quartz build`

Expected: tests, type checking, formatting, and production build pass. A pre-existing optional Excalidraw plugin warning may remain non-fatal.

- [ ] **Step 3: Browser polish**

Serve with `npx quartz build --serve`, then inspect the home page, full graph, one detail page, and light/dark modes at desktop and mobile widths. Verify tooltip visibility, category filtering, fit-to-view scale, sidebar compactness, and copy-button alignment.

- [ ] **Step 4: Review the final diff**

Confirm only plan-scoped files changed and unrelated staged content deletions remain untouched.
