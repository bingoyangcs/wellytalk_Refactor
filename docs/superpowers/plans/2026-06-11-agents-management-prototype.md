# Agents Management Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete in-memory `Settings > Team > Agents` prototype shown in the supplied Agent, Group, and modal references.

**Architecture:** Keep the existing static application shell and menu renderer. Add an isolated `agents.js` feature module with pure data helpers plus one DOM controller, then let `app.js` mount that controller for the Agents menu leaf. Page-specific styles live in the existing stylesheet so the prototype remains dependency-free and works from `file://`.

**Tech Stack:** HTML5, CSS custom properties, vanilla JavaScript, Node.js built-in test runner, Browser plugin.

---

## File Map

- Create `agents.js`: demonstration records, pure search/mutation/validation helpers, Agents page state, rendering, and delegated interactions.
- Create `tests/agents.test.js`: focused unit tests for the pure Agents helpers.
- Modify `app.js`: mark the Agents leaf as a dedicated view and mount/unmount the Agents controller.
- Modify `index.html`: load `agents.js` before `app.js`.
- Modify `styles.css`: Agents tables, badges, forms, modals, member chips, confirmation dialog, and responsive desktop behavior.
- Modify `tests/app.test.js`: assert that the Agents menu leaf resolves to the Agents view.

### Task 1: Register The Agents View

**Files:**
- Modify: `app.js`
- Test: `tests/app.test.js`

- [ ] **Step 1: Write the failing view-resolution test**

Change the existing Agents assertion to:

```js
test("resolveMenuPath exposes the Agents management view", () => {
  const result = resolveMenuPath(MENU_CONFIG.settings, ["team", "agents"]);

  assert.equal(result.leaf.id, "agents");
  assert.deepEqual(result.breadcrumb, ["Settings", "Team", "Agents"]);
  assert.equal(getViewType(result.leaf), "agents");
});
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run: `node --test tests/app.test.js`

Expected: FAIL because `getViewType(result.leaf)` still returns `placeholder`.

- [ ] **Step 3: Add the dedicated view metadata**

Update the menu leaf and view helper:

```js
{ id: "agents", label: "Agents", view: "agents" }

function getViewType(leaf) {
  if (!leaf) return "placeholder";
  if (leaf.view === "routing-rules") return "routing-rules";
  if (leaf.view === "agents") return "agents";
  return "placeholder";
}
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `node --test tests/app.test.js`

Expected: all app tests PASS.

### Task 2: Build And Test The Agents Data Model

**Files:**
- Create: `agents.js`
- Create: `tests/agents.test.js`

- [ ] **Step 1: Write failing tests for filtering and validation**

Cover these public helpers:

```js
filterAgents(agents, "rose")
filterGroups(groups, "support")
validateAgentDraft({ fullName: "", email: "" })
validateGroupDraft({ name: "" })
```

Assert case-insensitive matching across account/name/email and required-field error objects.

- [ ] **Step 2: Run the new tests and verify module-not-found failure**

Run: `node --test tests/agents.test.js`

Expected: FAIL because `agents.js` does not exist.

- [ ] **Step 3: Implement demonstration records and pure filtering/validation helpers**

Create a UMD-style module exposing browser global `window.WellytalkAgents` and CommonJS exports. Include:

```js
const DEFAULT_AGENTS = [/* Icey, RoseTran8866, Bingo, Eriq, Kimmy, Yvon, Donny, April */];
const DEFAULT_GROUPS = [/* Test1, Test2, Test3 with member ids */];

function filterAgents(agents, query) { /* normalized includes matching */ }
function filterGroups(groups, query) { /* normalized group-name matching */ }
function validateAgentDraft(draft) { /* fullName and email errors */ }
function validateGroupDraft(draft) { /* name error */ }
```

- [ ] **Step 4: Run tests and verify filtering/validation pass**

Run: `node --test tests/agents.test.js`

Expected: all filtering and validation tests PASS.

- [ ] **Step 5: Write failing mutation and pagination tests**

Test:

```js
upsertAgent(records, draft)
upsertGroup(records, draft)
removeAgentFromState(state, agentId)
removeGroupFromState(state, groupId)
clampPage(page, itemCount, pageSize)
```

Assert immutable create/update behavior, Agent deletion removes group membership, Group deletion removes Agent assignments, and page numbers cannot exceed the last page.

- [ ] **Step 6: Implement mutation and pagination helpers**

Add immutable helper implementations with generated `agent-N` / `group-N` identifiers and cascade cleanup.

- [ ] **Step 7: Run both test files**

Run: `node --test tests/app.test.js tests/agents.test.js`

Expected: all tests PASS.

### Task 3: Mount The Agent And Group Lists

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `agents.js`
- Modify: `styles.css`

- [ ] **Step 1: Load the feature module**

Add before `app.js`:

```html
<script src="agents.js" defer></script>
```

- [ ] **Step 2: Add a controller entry point**

Expose:

```js
function mountAgentsPage(root) {
  const state = createInitialState();
  renderAgentsPage(root, state);
  bindAgentsEvents(root, state);
  return () => root.replaceChildren();
}
```

Render the title, Agent/Group tabs, search controls, action button, table, empty state, and pagination from state.

- [ ] **Step 3: Connect page routing**

In `renderPageContent`, dispose the previous Agents controller before replacing the page. For the Agents view call:

```js
agentsCleanup = window.WellytalkAgents.mountAgentsPage(pageContent);
```

- [ ] **Step 4: Add list-view styling**

Add `agents-*` classes for the reference layout: compact 12px table type, thin gray rules, purple tabs/chips, black pill buttons, green/red/gray statuses, row actions, and bottom-right pagination.

- [ ] **Step 5: Verify automated tests remain green**

Run: `node --test tests/app.test.js tests/agents.test.js`

Expected: all tests PASS.

### Task 4: Implement Agent Create And Edit Flows

**Files:**
- Modify: `agents.js`
- Modify: `styles.css`

- [ ] **Step 1: Render the shared Agent modal**

Render create/edit modes with:

```text
Account info | Role settings | Work settings
```

Include account inputs, role checkboxes and descriptions, chat limit, assigned group chips, inline errors, Cancel, and Save.

- [ ] **Step 2: Add delegated Agent interactions**

Handle:

- Open empty create draft.
- Open cloned edit draft.
- Switch modal tabs without losing draft values.
- Update text/select/checkbox fields.
- Toggle group assignments.
- Validate and save through `upsertAgent`.
- Cancel/close without mutating records.

- [ ] **Step 3: Add modal and form styling**

Match the supplied white dialog, dim overlay, purple active tab, two-column account form, rounded controls, bottom action bar, and compact role/work layouts.

- [ ] **Step 4: Run unit tests**

Run: `node --test tests/app.test.js tests/agents.test.js`

Expected: all tests PASS.

### Task 5: Implement Group Create, Edit, Member, And Delete Flows

**Files:**
- Modify: `agents.js`
- Modify: `styles.css`

- [ ] **Step 1: Render the shared Group modal**

Include required group name, character count, member search, Select all, member checkbox list, and removable selected-member chips.

- [ ] **Step 2: Add Group interactions**

Handle create/edit drafts, member filtering, Select all, individual selection, chip removal, validation, and save through `upsertGroup`.

- [ ] **Step 3: Add Group-row interactions**

Implement member-chip expansion/collapse and keyboard-accessible profile cards for member chips.

- [ ] **Step 4: Add reusable deletion confirmation**

Open a named confirmation dialog from Agent or Group delete actions. Confirm through `removeAgentFromState` or `removeGroupFromState`, clamp pagination, rerender, and return focus to the list action area.

- [ ] **Step 5: Add Escape and overlay behavior**

Escape closes the confirmation first, then the active form. Overlay clicks only close a pristine form; changed drafts require Cancel or the close button.

- [ ] **Step 6: Run the complete automated suite**

Run: `node --test tests/*.test.js`

Expected: all tests PASS with no warnings.

### Task 6: Browser Verification And Visual Polish

**Files:**
- Modify if needed: `agents.js`
- Modify if needed: `styles.css`

- [ ] **Step 1: Open the existing local file in the Browser plugin**

Navigate to:

```text
file:///Users/bingoyang/codex/wellytalk%20refactor/index.html
```

- [ ] **Step 2: Verify the primary Agent flow**

Navigate to Settings > Team > Agents, search, change page, add an Agent across all three modal tabs, edit it, and delete it through confirmation.

- [ ] **Step 3: Verify the primary Group flow**

Switch to Group, search, create a Group with selected members, edit membership, expand member chips, inspect a member card, and delete the Group.

- [ ] **Step 4: Inspect desktop visual fidelity**

Compare spacing, table density, typography, tabs, badges, buttons, modal dimensions, and overlay against the supplied screenshots at the current browser viewport. Correct concrete discrepancies in CSS.

- [ ] **Step 5: Check runtime errors**

Confirm the browser console has no errors during both flows.

- [ ] **Step 6: Run final verification**

Run: `node --test tests/*.test.js`

Expected: all tests PASS.

