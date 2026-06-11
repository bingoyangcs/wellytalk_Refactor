const test = require("node:test");
const assert = require("node:assert/strict");
const {
  MENU_CONFIG,
  flattenMenuLabels,
  resolveMenuPath,
  getViewType,
  toggleRule,
  selectLoadRule,
  toggleAccordionGroup,
} = require("../app.js");

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

test("toggleRule leaves state unchanged for an unknown rule", () => {
  const state = { lastAgent: true };

  assert.deepEqual(toggleRule(state, "missing"), state);
});

test("toggleAccordionGroup keeps only one sibling menu expanded", () => {
  const expanded = new Set(["settings-inbox", "reports-group"]);

  assert.deepEqual(
    [...toggleAccordionGroup(expanded, "automation", ["team", "channels", "automation", "settings-inbox", "personal"])],
    ["reports-group", "automation"],
  );
});

test("toggleAccordionGroup collapses the selected menu when clicked again", () => {
  const expanded = new Set(["automation"]);

  assert.deepEqual(
    [...toggleAccordionGroup(expanded, "automation", ["team", "automation", "settings-inbox"])],
    [],
  );
});

test("menu configuration exposes the five Wellytalk modules", () => {
  assert.deepEqual(Object.keys(MENU_CONFIG), [
    "inbox",
    "knowledge",
    "reports",
    "customers",
    "settings",
  ]);
});

test("menu labels use corrected English", () => {
  const labels = Object.values(MENU_CONFIG).flatMap(flattenMenuLabels);

  assert.equal(labels.includes("Business categories"), true);
  assert.equal(labels.includes("Chat availability"), true);
  assert.equal(labels.includes("Top customer questions"), true);
  assert.equal(labels.includes("Business catgory"), false);
  assert.equal(labels.includes("Chat availabilty"), false);
  assert.equal(labels.includes("Top customer quesation"), false);
});

test("resolveMenuPath finds Routing rules and its breadcrumb", () => {
  const result = resolveMenuPath(MENU_CONFIG.settings, [
    "settings-inbox",
    "routing-rules",
  ]);

  assert.equal(result.leaf.id, "routing-rules");
  assert.deepEqual(result.breadcrumb, ["Settings", "Inbox", "Routing rules"]);
  assert.equal(getViewType(result.leaf), "routing-rules");
});

test("resolveMenuPath exposes the Agents management view", () => {
  const result = resolveMenuPath(MENU_CONFIG.settings, ["team", "agents"]);

  assert.equal(result.leaf.id, "agents");
  assert.deepEqual(result.breadcrumb, ["Settings", "Team", "Agents"]);
  assert.equal(getViewType(result.leaf), "agents");
});
