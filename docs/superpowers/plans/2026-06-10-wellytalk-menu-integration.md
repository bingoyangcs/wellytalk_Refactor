# Wellytalk Menu Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the prototype's fixed Settings navigation with the complete data-driven Wellytalk menu and realistic placeholder-page navigation.

**Architecture:** Keep the dependency-free HTML/CSS/JavaScript project. Move menu hierarchy and path resolution into testable JavaScript data/functions, render the global and context navigation from that configuration, and preserve Routing rules as the only full content page.

**Tech Stack:** HTML5, CSS custom properties, inline SVG, vanilla JavaScript, Node.js built-in test runner, Codex in-app Browser.

---

### Task 1: Define Menu Configuration and Path Resolution

**Files:**
- Modify: `tests/app.test.js`
- Modify: `app.js`

- [ ] **Step 1: Add failing tests for global modules and corrected labels**

Test that `MENU_CONFIG` exposes `inbox`, `knowledge`, `reports`, `customers`, and `settings`, and that flattened labels include `Business categories`, `Chat availability`, and `Top customer questions` while excluding their misspelled source forms.

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/app.test.js`

Expected: FAIL because `MENU_CONFIG` and `flattenMenuLabels` are not exported.

- [ ] **Step 3: Add immutable menu configuration and label flattener**

Define the full hierarchy from the approved design with stable ids, labels, default paths, and nested `children`. Export `MENU_CONFIG` and `flattenMenuLabels`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/app.test.js`

Expected: all configuration tests pass.

- [ ] **Step 5: Add failing path-resolution tests**

Test:

```js
resolveMenuPath(MENU_CONFIG.settings, ["settings-inbox", "routing-rules"])
```

returns the Routing rules leaf and breadcrumb labels, while resolving `["team", "agents"]` returns a placeholder leaf.

- [ ] **Step 6: Run tests and verify RED**

Run: `node --test tests/app.test.js`

Expected: FAIL because `resolveMenuPath` does not exist.

- [ ] **Step 7: Implement path resolution and view selection**

Add `resolveMenuPath(module, path)` and `getViewType(leaf)` where only `routing-rules` returns `routing-rules`; all other leaves return `placeholder`.

- [ ] **Step 8: Run tests and verify GREEN**

Run: `node --test tests/app.test.js`

Expected: all tests pass.

### Task 2: Convert the Static Shell to Render Targets

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace fixed global navigation buttons**

Keep the brand button and bottom controls. Add a `#global-navigation` container populated by JavaScript and make the profile trigger expose `aria-haspopup="menu"` and `aria-expanded="false"`.

- [ ] **Step 2: Replace fixed Settings sidebar**

Use:

```html
<aside class="settings-sidebar context-sidebar" aria-label="Context navigation">
  <h1 class="settings-title" id="context-title"></h1>
  <nav class="settings-nav" id="context-navigation"></nav>
</aside>
```

- [ ] **Step 3: Preserve Routing rules in a template**

Move the existing full page markup into:

```html
<template id="routing-rules-template">...</template>
```

Add an empty `<main class="page-content" id="page-content"></main>` render target.

- [ ] **Step 4: Add profile menu markup**

Add a hidden menu with Away mode, Theme, Language, Switch CID, and Log out buttons.

### Task 3: Render and Operate the Navigation

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Add menu state and icon mapping**

Initialize:

```js
{
  activeModule: "settings",
  activePath: ["settings-inbox", "routing-rules"],
  expandedGroups: new Set(["settings-inbox"]),
  profileMenuOpen: false
}
```

Provide inline SVG icon strings for the five global modules and context item categories.

- [ ] **Step 2: Render global navigation**

Create buttons from `MENU_CONFIG`, set accessible labels, selected styles, and click handlers that switch to each module's default path.

- [ ] **Step 3: Render recursive context navigation**

Render groups and leaves by depth. Group clicks toggle expansion without changing the active page. Leaf clicks update `activePath`, `aria-current`, and main content.

- [ ] **Step 4: Render page content**

Clone `#routing-rules-template` for Routing rules. For other leaves render a placeholder with title, breadcrumb, status badge, and explanatory copy.

- [ ] **Step 5: Reinitialize Routing rules controls**

After cloning the template, bind rule switches and load-strategy radios using the existing state helpers.

- [ ] **Step 6: Add profile menu behavior**

Toggle on avatar click, close on outside click or Escape, update `aria-expanded`, and show a small prototype feedback message for selected profile actions.

### Task 4: Extend the Visual System

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Widen and scroll the context sidebar**

Increase the middle column enough for long labels, keep the desktop minimum width, and allow vertical context-menu scrolling without moving the global sidebar.

- [ ] **Step 2: Style recursive menu levels**

Add depth-based indentation, parent chevrons, connector lines, selected leaf treatment, hover/focus styles, and compact report-level typography.

- [ ] **Step 3: Style placeholders and profile menu**

Add breadcrumb, `Prototype page` badge, empty-state card, profile popover, action feedback, and overlay positioning consistent with the existing visual language.

- [ ] **Step 4: Preserve Routing rules fidelity**

Ensure existing page header, note, card, switch, and radio styles remain unchanged after dynamic rendering.

### Task 5: Browser Verification

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Run automated tests**

Run: `node --test tests/app.test.js`

Expected: all tests pass.

- [ ] **Step 2: Serve the prototype**

Run: `python3 -m http.server 4173`

Expected: `http://127.0.0.1:4173` returns the prototype.

- [ ] **Step 3: Verify global modules**

In the in-app browser select Inbox, Knowledge base, Management & Reports, Customers, and Settings. Confirm each context menu and default placeholder renders.

- [ ] **Step 4: Verify deep navigation**

Expand Reports > Chat, Reports > Agent, Reports > Insights, Settings > Team, Settings > Channels, Settings > Automation, Settings > Inbox, and Settings > Personal. Confirm selected leaves update breadcrumbs and placeholders.

- [ ] **Step 5: Verify preserved Routing rules**

Navigate to Settings > Inbox > Routing rules and verify all four switches, mutually exclusive load radios, and reference-image layout.

- [ ] **Step 6: Verify profile menu**

Open the avatar menu, activate one prototype action, close with Escape, and confirm outside-click dismissal.

- [ ] **Step 7: Run final verification**

Run:

```bash
node --test tests/app.test.js
curl -I http://127.0.0.1:4173/index.html
```

Expected: zero test failures and HTTP 200.

