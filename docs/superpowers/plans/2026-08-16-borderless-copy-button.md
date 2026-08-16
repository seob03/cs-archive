# Borderless Code Copy Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the visible border and resting background from the code-block copy button while preserving its permanent visibility, alignment, and interaction feedback.

**Architecture:** Keep Quartz's existing copy behavior and markup unchanged. Enforce the visual contract through the archive stylesheet and its existing source-level regression test.

**Tech Stack:** Quartz v5, SCSS, TypeScript `node:test`

## Global Constraints

- Keep the copy icon permanently visible at its current size and position.
- Remove the button border in every state.
- Use a transparent background in the resting state.
- Preserve the current copied-state behavior.

---

### Task 1: Borderless Copy Control

**Files:**
- Modify: `quartz/archive-config.test.ts`
- Modify: `quartz/styles/custom.scss`

**Interfaces:**
- Consumes: Quartz's existing `.clipboard-button` and `.clipboard-button > svg` markup.
- Produces: A permanently visible, borderless copy control with a transparent resting state and subtle hover/focus feedback.

- [ ] **Step 1: Write the failing regression test**

Update the existing copy-control test with these assertions:

```ts
assert.match(styles, /\.clipboard-button\s*\{[\s\S]*border:\s*0\s*!important;/)
assert.match(styles, /\.clipboard-button\s*\{[\s\S]*background:\s*transparent;/)
assert.doesNotMatch(styles, /\.clipboard-button:hover,[\s\S]*border-color:/)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx tsx --test quartz/archive-config.test.ts
```

Expected: FAIL because `.clipboard-button` still declares a visible border and opaque resting background.

- [ ] **Step 3: Implement the minimal style change**

In `quartz/styles/custom.scss`, set the resting button to:

```scss
border: 0 !important;
background: transparent;
```

Remove `border-color` from the transition and hover/focus declarations. Keep the existing hover background, icon color, transform, dimensions, position, and opacity.

- [ ] **Step 4: Verify focused and full checks**

Run:

```bash
npx tsx --test quartz/archive-config.test.ts
npm test
npx tsc --noEmit
npx prettier --check quartz/styles/custom.scss quartz/archive-config.test.ts
npm run quartz -- build
```

Expected: all tests and checks pass; Quartz emits the site successfully.

- [ ] **Step 5: Commit the implementation**

```bash
git add quartz/archive-config.test.ts quartz/styles/custom.scss
git commit -m "style: simplify code copy control"
```
