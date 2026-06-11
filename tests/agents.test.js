const test = require("node:test");
const assert = require("node:assert/strict");
const {
  filterAgents,
  filterGroups,
  validateAgentDraft,
  validateGroupDraft,
  upsertAgent,
  upsertGroup,
  removeAgentFromState,
  removeGroupFromState,
  clampPage,
} = require("../agents.js");

const agents = [
  { id: "agent-1", account: "Icey", fullName: "Shatoshi", email: "icey@example.com", groupIds: ["group-1"] },
  { id: "agent-2", account: "Rose", fullName: "RoseTran8866", email: "rose@gmail.com", groupIds: ["group-1"] },
];

const groups = [
  { id: "group-1", name: "Player Support", memberIds: ["agent-1", "agent-2"] },
  { id: "group-2", name: "VIP", memberIds: [] },
];

test("filterAgents matches account, name, and email without case sensitivity", () => {
  assert.deepEqual(filterAgents(agents, "ROSE").map((agent) => agent.id), ["agent-2"]);
  assert.deepEqual(filterAgents(agents, "shato").map((agent) => agent.id), ["agent-1"]);
  assert.deepEqual(filterAgents(agents, "@example").map((agent) => agent.id), ["agent-1"]);
});

test("filterGroups matches group names without case sensitivity", () => {
  assert.deepEqual(filterGroups(groups, "support").map((group) => group.id), ["group-1"]);
});

test("draft validators report required fields", () => {
  assert.deepEqual(validateAgentDraft({ fullName: "", email: "" }), {
    fullName: "Full name is required.",
    email: "Email is required.",
  });
  assert.deepEqual(validateGroupDraft({ name: "" }), {
    name: "Group name is required.",
  });
});

test("upsertAgent creates and updates records immutably", () => {
  const created = upsertAgent(agents, {
    account: "Bingo",
    fullName: "Bingo Yang",
    email: "bingo@example.com",
  });
  assert.equal(created.length, 3);
  assert.equal(created[2].id, "agent-3");
  assert.equal(agents.length, 2);

  const updated = upsertAgent(created, { ...created[0], fullName: "Icey Updated" });
  assert.equal(updated[0].fullName, "Icey Updated");
  assert.equal(created[0].fullName, "Shatoshi");
});

test("upsertGroup creates and updates records immutably", () => {
  const created = upsertGroup(groups, { name: "Billing", memberIds: ["agent-1"] });
  assert.equal(created[2].id, "group-3");
  assert.equal(groups.length, 2);

  const updated = upsertGroup(created, { ...created[0], name: "Game Support" });
  assert.equal(updated[0].name, "Game Support");
  assert.equal(created[0].name, "Player Support");
});

test("removing an agent clears that member from groups", () => {
  const next = removeAgentFromState({ agents, groups }, "agent-1");
  assert.deepEqual(next.agents.map((agent) => agent.id), ["agent-2"]);
  assert.deepEqual(next.groups[0].memberIds, ["agent-2"]);
});

test("removing a group clears assignments from agents", () => {
  const next = removeGroupFromState({ agents, groups }, "group-1");
  assert.deepEqual(next.groups.map((group) => group.id), ["group-2"]);
  assert.deepEqual(next.agents.map((agent) => agent.groupIds), [[], []]);
});

test("clampPage keeps pagination within the filtered result range", () => {
  assert.equal(clampPage(4, 3, 2), 2);
  assert.equal(clampPage(2, 0, 20), 1);
  assert.equal(clampPage(0, 50, 20), 1);
});
