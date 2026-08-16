# Code Block Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce fenced code block vertical margins from `2rem` to `0.8rem` without changing inline code or code block internals.

**Architecture:** Keep the existing Quartz pretty-code figure structure and change only its custom stylesheet margin. Lock the reading rhythm in the existing stylesheet regression test.

**Tech Stack:** SCSS, Node.js test runner, TypeScript, Quartz v5

## Global Constraints

- Apply `margin: 0.8rem 0` only to `figure[data-rehype-pretty-code-figure]`.
- Do not change inline code, code block padding, title bars, copy buttons, or color modes.
- Preserve the user's uncommitted `content/AI/LANG-CHAIN/Tool Calling.md` change.

---

### Task 1: Compact fenced code block spacing

**Files:**
- Modify: `quartz/styles/custom.scss:653-660`
- Test: `quartz/styles/custom.test.ts`

**Interfaces:**
- Consumes: Quartz-generated `figure[data-rehype-pretty-code-figure]` markup.
- Produces: A stable `margin: 0.8rem 0` rule for fenced code blocks.

- [ ] **Step 1: Write the failing style regression test**

Add this assertion to the `article reading rhythm` suite in `quartz/styles/custom.test.ts`:

```ts
it("keeps fenced code blocks close to surrounding text", () => {
  assert.match(
    styles,
    /figure\[data-rehype-pretty-code-figure\]\s*\{[\s\S]*?margin:\s*0\.8rem 0;/,
  )
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx tsx --test quartz/styles/custom.test.ts
```

Expected: FAIL because the current stylesheet contains `margin: 2rem 0`.

- [ ] **Step 3: Implement the minimal SCSS change**

Change the existing rule in `quartz/styles/custom.scss`:

```scss
figure[data-rehype-pretty-code-figure] {
  position: relative;
  overflow: hidden;
  margin: 0.8rem 0;
}
```

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
npx tsx --test quartz/styles/custom.test.ts
npm test
npx tsc --noEmit
npx prettier --check quartz/styles/custom.scss quartz/styles/custom.test.ts
npx quartz build
```

Expected: all tests and checks pass, and Quartz emits the site successfully. The existing optional Excalidraw category warning may remain non-fatal.

- [ ] **Step 5: Commit only the spacing implementation**

```bash
git add quartz/styles/custom.scss quartz/styles/custom.test.ts
git commit -m "style: tighten code block spacing"
```

Confirm that `content/AI/LANG-CHAIN/Tool Calling.md` remains unstaged.
