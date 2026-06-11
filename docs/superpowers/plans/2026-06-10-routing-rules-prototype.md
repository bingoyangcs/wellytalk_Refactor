# Routing Rules Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity, dependency-free desktop prototype of the supplied Routing rules screen that can be extended with additional static pages.

**Architecture:** Use semantic HTML for the three-column application shell, reusable CSS classes and design tokens for presentation, and a small JavaScript initializer for visual state changes. The prototype runs directly from local files and keeps all defaults in the markup so a refresh resets the page.

**Tech Stack:** HTML5, CSS custom properties, inline SVG, vanilla JavaScript, Node.js built-in test runner, Codex in-app Browser.

---

## File Structure

- `index.html`: application shell, reusable navigation markup, and Routing rules page content.
- `styles.css`: design tokens, layout, navigation, rule-card, toggle, and radio styles.
- `app.js`: small exported state helpers plus DOM initialization.
- `tests/app.test.js`: focused tests for toggle and radio state transitions.
- `assets/.gitkeep`: reserves the shared asset directory for future pages.

### Task 1: Add Testable Interaction State

**Files:**
- Create: `tests/app.test.js`
- Create: `app.js`

- [ ] **Step 1: Write failing state-transition tests**

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { toggleRule, selectLoadRule } = require("../app.js");

test("toggleRule flips only the requested rule", () => {
  const state = { lastAgent: true, language: true };
  assert.deepEqual(toggleRule(state, "lastAgent"), {
    lastAgent: false,
    language: true,
  });
});

test("selectLoadRule replaces the selected load strategy", () => {
  const state = { loadStrategy: "current" };
  assert.deepEqual(selectLoadRule(state, "last24Hours"), {
    loadStrategy: "last24Hours",
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/app.test.js`

Expected: FAIL because `app.js` or the exported functions do not exist.

- [ ] **Step 3: Implement minimal immutable state helpers**

```js
function toggleRule(state, ruleName) {
  return { ...state, [ruleName]: !state[ruleName] };
}

function selectLoadRule(state, loadStrategy) {
  return { ...state, loadStrategy };
}

if (typeof module !== "undefined") {
  module.exports = { toggleRule, selectLoadRule };
}
```

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `node --test tests/app.test.js`

Expected: 2 tests pass.

### Task 2: Build the Semantic Page Structure

**Files:**
- Create: `index.html`
- Create: `assets/.gitkeep`

- [ ] **Step 1: Add the application shell**

Create a document with:

```html
<div class="app-shell">
  <aside class="global-sidebar" aria-label="Product navigation"></aside>
  <aside class="settings-sidebar" aria-label="Settings navigation"></aside>
  <main class="page-content"></main>
</div>
```

Include a local stylesheet link to `styles.css`, a deferred script link to `app.js`, a desktop viewport meta tag, and accessible labels for icon-only controls.

- [ ] **Step 2: Add reusable navigation markup**

Populate the global sidebar with the screenshot's icon sequence and Settings selected near the bottom. Populate the Settings sidebar with General, Subscription, Team, Channels, Automation, its four nested children, Inbox, Apps & Integrations, and Personal. Mark Routing rules as the selected nested item.

- [ ] **Step 3: Add Routing rules content**

Add the heading, active tab, note, and four `.rule-card` articles. Use semantic checkbox inputs for switches and radio inputs for the two Load based options. Match the screenshot's English copy exactly.

- [ ] **Step 4: Check document landmarks**

Run:

```bash
rg -n '<aside|<main|type="checkbox"|type="radio"|Routing rules|Intra-group routing rules' index.html
```

Expected: two aside landmarks, one main landmark, four checkbox inputs, two radio inputs, and the page title/tab copy.

### Task 3: Reproduce the Visual Design

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Define shared design tokens**

Define `:root` custom properties for:

```css
--brand: #635bdf;
--brand-soft: #e9e7ff;
--text: #171717;
--text-muted: #5f6067;
--border: #d9d9dd;
--surface: #ffffff;
--surface-subtle: #f7f7f8;
--app-background: #f1f1f2;
--radius-sm: 6px;
--radius-md: 9px;
--shadow-panel: 0 2px 8px rgb(0 0 0 / 12%);
```

- [ ] **Step 2: Implement the desktop shell**

Set a minimum page width of `1100px`. Use a narrow fixed global sidebar, a `190px` Settings sidebar, and a flexible content panel. Match the screenshot's full-height panels, separators, subtle shadows, and compact desktop spacing.

- [ ] **Step 3: Style reusable navigation components**

Create shared styles for icon buttons, Settings rows, nested navigation, selected states, badges, separators, avatar/status treatment, hover states, and visible keyboard focus.

- [ ] **Step 4: Style page components**

Create shared styles for `.page-header`, `.tabs`, `.note`, `.rule-list`, `.rule-card`, `.drag-handle`, `.switch`, and `.radio-option`. Match card heights, borders, typography, and purple active controls from the reference image.

- [ ] **Step 5: Verify stylesheet structure**

Run:

```bash
rg -n -- '--brand|\\.app-shell|\\.global-sidebar|\\.settings-sidebar|\\.rule-card|\\.switch|\\.radio-option' styles.css
```

Expected: all reusable tokens and component selectors are present.

### Task 4: Connect DOM Interactions

**Files:**
- Modify: `app.js`
- Modify: `tests/app.test.js`

- [ ] **Step 1: Add a failing invalid-rule test**

```js
test("toggleRule leaves state unchanged for an unknown rule", () => {
  const state = { lastAgent: true };
  assert.deepEqual(toggleRule(state, "missing"), state);
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/app.test.js`

Expected: the unknown key is incorrectly added, so the new test fails.

- [ ] **Step 3: Guard the helper and initialize controls**

Update `toggleRule` to return the original state when the key is absent. On `DOMContentLoaded`:

- Listen for checkbox changes and update `aria-checked`.
- Listen for Load based radio changes and call `selectLoadRule`.
- Let nested navigation buttons update their `.is-selected` state within the Settings sidebar.
- Preserve native keyboard behavior by relying on checkbox, radio, and button elements.

- [ ] **Step 4: Run all interaction tests**

Run: `node --test tests/app.test.js`

Expected: 3 tests pass.

### Task 5: Browser Verification and Polish

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Serve the static project**

Run:

```bash
python3 -m http.server 4173
```

Expected: the project is available at `http://127.0.0.1:4173`.

- [ ] **Step 2: Inspect at the reference viewport**

Open the page in the Codex in-app Browser at approximately `1143 x 695`. Compare:

- Three-column proportions
- Selected Routing rules navigation
- Header and tab spacing
- Note dimensions
- Four rule-card heights and gaps
- Purple toggles and selected radio

- [ ] **Step 3: Test interactions**

Use the browser to:

- Toggle each rule off and on.
- Select both Load based options in turn and confirm mutual exclusivity.
- Select another nested navigation item and return to Routing rules.
- Confirm focus indicators appear during keyboard navigation.
- Confirm there are no browser console errors.

- [ ] **Step 4: Apply visual corrections**

Adjust only spacing, sizing, colors, line-height, and component alignment needed to match the supplied screenshot. Reload and repeat the screenshot comparison after each change.

- [ ] **Step 5: Run final verification**

Run:

```bash
node --test tests/app.test.js
```

Expected: all tests pass with no failures.

Open `index.html` directly with a `file://` URL and confirm the page renders and interactions still work without the local server.

