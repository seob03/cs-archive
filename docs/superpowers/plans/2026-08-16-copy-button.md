# Persistent Code Copy Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the code copy icon permanently visible in a correctly aligned `2rem` square button with a clear hover and focus reaction.

**Architecture:** Override Quartz syntax-highlighting clipboard defaults only in the existing custom stylesheet. Extend the existing archive style regression test to lock visibility, geometry, icon sizing, and interaction feedback.

**Tech Stack:** SCSS, Node.js test runner, TypeScript, Quartz v5

## Global Constraints

- Keep `.clipboard-button` visible with `opacity: 1 !important`.
- Remove Quartz's inherited external spacing with `margin: 0 !important`.
- Use a `2rem × 2rem` button and a `1rem × 1rem` SVG icon.
- Preserve the existing clipboard click behavior and temporary success check icon.
- Preserve the user's uncommitted `content/AI/LANG-CHAIN/Tool Calling.md` changes.

---

### Task 1: Make the copy control persistent and correctly aligned

**Files:**
- Modify: `quartz/styles/custom.scss:744-774`
- Test: `quartz/archive-config.test.ts:85-94`

**Interfaces:**
- Consumes: Quartz's generated `.clipboard-button > svg` markup and click script.
- Produces: A permanently visible, centered copy control with stable hover and focus feedback.

- [ ] **Step 1: Update the regression test first**

Replace the existing copy-control assertions in `quartz/archive-config.test.ts` with:

```ts
it("keeps the code copy control visible and correctly aligned", () => {
  assert.match(styles, /\.clipboard-button\s*\{[\s\S]*width:\s*2rem\s*!important;/)
  assert.match(styles, /\.clipboard-button\s*\{[\s\S]*height:\s*2rem\s*!important;/)
  assert.match(styles, /\.clipboard-button\s*\{[\s\S]*margin:\s*0\s*!important;/)
  assert.match(styles, /\.clipboard-button\s*\{[\s\S]*opacity:\s*1\s*!important;/)
  assert.match(
    styles,
    /\.clipboard-button\s*>\s*svg\s*\{[\s\S]*width:\s*1rem;[\s\S]*height:\s*1rem;/,
  )
  assert.match(
    styles,
    /\.clipboard-button:hover,[\s\S]*background:\s*#23232a;/,
  )
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx tsx --test quartz/archive-config.test.ts
```

Expected: FAIL because the current button is `1.65rem`, the icon is `0.8rem`, and permanent opacity/margin overrides are absent.

- [ ] **Step 3: Implement the minimal stylesheet override**

Update the existing rules in `quartz/styles/custom.scss`:

```scss
.clipboard-button {
  display: grid !important;
  width: 2rem !important;
  min-width: 2rem;
  height: 2rem !important;
  place-items: center;
  box-sizing: border-box;
  z-index: 2;
  top: 0.075rem;
  right: 0.35rem;
  margin: 0 !important;
  border: 1px solid #3a3a40;
  border-radius: 6px;
  background: #19191d;
  color: #c4b5fd;
  opacity: 1 !important;
  line-height: 1;
  padding: 0 !important;
  transition:
    border-color 150ms ease,
    background 150ms ease,
    color 150ms ease,
    transform 150ms ease;
}

.clipboard-button > svg {
  display: block;
  width: 1rem;
  height: 1rem;
  margin: 0;
  fill: currentColor;
  filter: none;
}

.clipboard-button:hover,
.clipboard-button:focus-visible {
  border-color: #818cf8;
  background: #23232a;
  color: #fff;
  outline: none;
  transform: translateY(-1px);
}
```

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npx tsx --test quartz/archive-config.test.ts
npm test
npx tsc --noEmit
npx prettier --check quartz/styles/custom.scss quartz/archive-config.test.ts
npx quartz build
```

Expected: all checks pass and Quartz emits the site successfully. The optional Excalidraw category warning may remain non-fatal.

- [ ] **Step 5: Commit implementation files only**

```bash
git add quartz/styles/custom.scss quartz/archive-config.test.ts
git commit -m "fix: keep code copy control visible"
```

Confirm that `content/AI/LANG-CHAIN/Tool Calling.md` remains unstaged.
