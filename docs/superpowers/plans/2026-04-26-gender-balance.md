# Gender Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional girls/boys totals per class with an at-a-glance balance badge.

**Architecture:** Store `girls` and `boys` directly on each class object. Keep validation, sharing, and balance status in `src/core.mjs`; keep DOM rendering and export presentation in `index.html`.

**Tech Stack:** Vanilla JavaScript modules, Vitest, static HTML/CSS.

---

## File Structure

- Modify `src/core.mjs`: validate `girls`/`boys`, expose `genderBalanceStatus()`, include F/M in scenario summaries and URL sharing.
- Modify `tests/core.test.mjs`: add red/green coverage for validation, status calculation, sharing, and scenario summary.
- Modify `index.html`: add compact F/M row UI, update handlers, include F/M in TXT/PDF exports.

---

### Task 1: Core Model And Status

**Files:**

- Modify: `tests/core.test.mjs`
- Modify: `src/core.mjs`

- [ ] **Step 1: Write failing validation and status tests**

Add tests proving `validateState()` preserves and clamps `girls`/`boys`, and `genderBalanceStatus()` returns `empty`, `incomplete`, `invalid`, `balanced`, `watch`, and `unbalanced`.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test -- tests/core.test.mjs`

Expected: FAIL because `genderBalanceStatus` is not exported and class gender fields are not preserved.

- [ ] **Step 3: Implement minimal core behavior**

Add `normaliseCount()` and `genderBalanceStatus(cl)` to `src/core.mjs`; include `girls` and `boys` in validated class objects.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm test -- tests/core.test.mjs`

Expected: PASS.

### Task 2: Sharing And Scenario Summary

**Files:**

- Modify: `tests/core.test.mjs`
- Modify: `src/core.mjs`

- [ ] **Step 1: Write failing sharing and summary tests**

Add tests proving `encodeState()` / `decodeState()` preserve `girls` and `boys`, and `summariseState()` counts classes with F/M warnings or invalid totals.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test -- tests/core.test.mjs`

Expected: FAIL because encoded classes do not include `g` / `b` and summary has no `genderWarnings`.

- [ ] **Step 3: Implement sharing and summary support**

Add `g` / `b` to encoded class payloads, restore them in decode, and add `genderWarnings` to scenario summaries.

- [ ] **Step 4: Run tests to verify GREEN**

Run: `npm test -- tests/core.test.mjs`

Expected: PASS.

### Task 3: Class Card UI

**Files:**

- Modify: `index.html`

- [ ] **Step 1: Add compact UI and handlers**

Add CSS classes for `.gender-row`, `.gender-toggle`, `.gender-box`, `.gender-badge`; render the compact row for non-empty classes; add `updateGender()` and `toggleGenderBox()` handlers.

- [ ] **Step 2: Preserve focus-friendly updates**

Ensure `updateGender()` updates the target class, saves state, and updates only the row summary/badge and relevant inputs without rebuilding the entire class list.

- [ ] **Step 3: Wire generated/manual classes**

Ensure `addClasse()` and automatic distribution classes have `girls: 0` and `boys: 0` through validation/default rendering behavior.

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: PASS.

### Task 4: Exports

**Files:**

- Modify: `index.html`

- [ ] **Step 1: Add TXT output**

In `exportTxt()`, add a `F/M` line for classes with any F/M value.

- [ ] **Step 2: Add PDF output**

In `exportPdf()`, add a compact F/M line under class metadata when any F/M value exists.

- [ ] **Step 3: Keep mural unchanged**

Confirm `exportMural()` does not render F/M.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test
npm run lint
npm run format:check
```

Expected: all pass.
