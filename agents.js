(function agentsModule(globalScope) {
  "use strict";

  const DEFAULT_AGENTS = [
    {
      id: "agent-1",
      account: "Icey",
      fullName: "Shatoshi",
      email: "icey@gmail.com",
      roles: ["Admin"],
      groupIds: ["group-1", "group-2", "group-3"],
      status: "Online",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "US",
      phoneCountry: "+1",
      phone: "1234 5678",
      chatLimit: 20,
    },
    {
      id: "agent-2",
      account: "Icey",
      fullName: "Shatoshi",
      email: "icey.cs@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-2", "group-3"],
      status: "Offline",
      accountStatus: "Inactive",
      nativeLanguage: "English",
      nationality: "US",
      phoneCountry: "+1",
      phone: "2345 6789",
      chatLimit: 20,
    },
    {
      id: "agent-3",
      account: "Icey",
      fullName: "Shatoshi",
      email: "icey.manager@gmail.com",
      roles: ["CS Manager"],
      groupIds: ["group-2", "group-3"],
      status: "Abnormal",
      accountStatus: "Inactive",
      nativeLanguage: "English",
      nationality: "US",
      phoneCountry: "+1",
      phone: "3456 7890",
      chatLimit: 30,
    },
    {
      id: "agent-4",
      account: "Rose",
      fullName: "RoseTran8866",
      email: "rosetran8866@gmail.com",
      roles: ["Admin", "CS Manager", "CS Agent"],
      groupIds: ["group-1", "group-2"],
      status: "Online",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "US",
      phoneCountry: "+1",
      phone: "4567 8901",
      chatLimit: 25,
    },
    {
      id: "agent-5",
      account: "Bingo",
      fullName: "Bingo Yang",
      email: "bingo@gmail.com",
      roles: ["CS Manager"],
      groupIds: ["group-1", "group-2", "group-3"],
      status: "Online",
      accountStatus: "Active",
      nativeLanguage: "Chinese",
      nationality: "CN",
      phoneCountry: "+86",
      phone: "138 0000 0000",
      chatLimit: 30,
    },
    {
      id: "agent-6",
      account: "Eriq",
      fullName: "Eriq Tran",
      email: "eriq@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-2", "group-3"],
      status: "Offline",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "VN",
      phoneCountry: "+84",
      phone: "912 345 678",
      chatLimit: 20,
    },
    {
      id: "agent-7",
      account: "Kimmy",
      fullName: "Kimmy Le",
      email: "kimmy@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-2", "group-3"],
      status: "Online",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "VN",
      phoneCountry: "+84",
      phone: "923 456 789",
      chatLimit: 20,
    },
    {
      id: "agent-8",
      account: "Yvon",
      fullName: "Yvon Nguyen",
      email: "yvon@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-2", "group-3"],
      status: "Offline",
      accountStatus: "Inactive",
      nativeLanguage: "English",
      nationality: "VN",
      phoneCountry: "+84",
      phone: "934 567 890",
      chatLimit: 20,
    },
    {
      id: "agent-9",
      account: "Donny",
      fullName: "Donny Pham",
      email: "donny@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-2", "group-3"],
      status: "Online",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "VN",
      phoneCountry: "+84",
      phone: "945 678 901",
      chatLimit: 20,
    },
    {
      id: "agent-10",
      account: "April",
      fullName: "April Vo",
      email: "april@gmail.com",
      roles: ["CS Agent"],
      groupIds: ["group-3"],
      status: "Offline",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "VN",
      phoneCountry: "+84",
      phone: "956 789 012",
      chatLimit: 20,
    },
  ];

  const DEFAULT_GROUPS = [
    { id: "group-1", name: "Test1", memberIds: ["agent-4", "agent-5", "agent-1"] },
    {
      id: "group-2",
      name: "Test2",
      memberIds: ["agent-4", "agent-5", "agent-1", "agent-9", "agent-6", "agent-7", "agent-8", "agent-2", "agent-3"],
    },
    {
      id: "group-3",
      name: "Test3",
      memberIds: ["agent-4", "agent-5", "agent-1", "agent-9", "agent-6", "agent-7", "agent-8", "agent-10", "agent-2", "agent-3"],
    },
  ];

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cloneRecords(records) {
    return records.map((record) => ({
      ...record,
      roles: record.roles ? [...record.roles] : undefined,
      groupIds: record.groupIds ? [...record.groupIds] : undefined,
      memberIds: record.memberIds ? [...record.memberIds] : undefined,
    }));
  }

  function filterAgents(agents, query) {
    const needle = normalize(query);
    if (!needle) return agents;
    return agents.filter((agent) =>
      [agent.account, agent.fullName, agent.email].some((value) => normalize(value).includes(needle)),
    );
  }

  function filterGroups(groups, query) {
    const needle = normalize(query);
    if (!needle) return groups;
    return groups.filter((group) => normalize(group.name).includes(needle));
  }

  function validateAgentDraft(draft) {
    const errors = {};
    if (!normalize(draft.fullName)) errors.fullName = "Full name is required.";
    if (!normalize(draft.email)) errors.email = "Email is required.";
    return errors;
  }

  function validateGroupDraft(draft) {
    const errors = {};
    if (!normalize(draft.name)) errors.name = "Group name is required.";
    return errors;
  }

  function nextId(records, prefix) {
    const largest = records.reduce((max, record) => {
      const match = String(record.id).match(new RegExp(`^${prefix}-(\\d+)$`));
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return `${prefix}-${largest + 1}`;
  }

  function upsertAgent(agents, draft) {
    const record = {
      account: normalize(draft.account) ? draft.account.trim() : draft.fullName.trim().split(/\s+/)[0],
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      roles: draft.roles && draft.roles.length ? [...draft.roles] : ["CS Agent"],
      groupIds: [...(draft.groupIds || [])],
      status: draft.status || "Offline",
      accountStatus: draft.accountStatus || "Active",
      nativeLanguage: draft.nativeLanguage || "English",
      nationality: draft.nationality || "US",
      phoneCountry: draft.phoneCountry || "+1",
      phone: draft.phone || "",
      chatLimit: Number(draft.chatLimit) || 20,
    };

    if (!draft.id) return [...agents, { id: nextId(agents, "agent"), ...record }];
    return agents.map((agent) => (agent.id === draft.id ? { ...agent, ...record } : agent));
  }

  function upsertGroup(groups, draft) {
    const record = {
      name: draft.name.trim(),
      memberIds: [...(draft.memberIds || [])],
    };
    if (!draft.id) return [...groups, { id: nextId(groups, "group"), ...record }];
    return groups.map((group) => (group.id === draft.id ? { ...group, ...record } : group));
  }

  function removeAgentFromState(state, agentId) {
    return {
      ...state,
      agents: state.agents.filter((agent) => agent.id !== agentId),
      groups: state.groups.map((group) => ({
        ...group,
        memberIds: group.memberIds.filter((id) => id !== agentId),
      })),
    };
  }

  function removeGroupFromState(state, groupId) {
    return {
      ...state,
      groups: state.groups.filter((group) => group.id !== groupId),
      agents: state.agents.map((agent) => ({
        ...agent,
        groupIds: (agent.groupIds || []).filter((id) => id !== groupId),
      })),
    };
  }

  function clampPage(page, itemCount, pageSize) {
    const lastPage = Math.max(1, Math.ceil(itemCount / pageSize));
    return Math.min(Math.max(1, Number(page) || 1), lastPage);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function createInitialState() {
    return {
      agents: cloneRecords(DEFAULT_AGENTS),
      groups: cloneRecords(DEFAULT_GROUPS),
      activeTab: "agents",
      lists: {
        agents: { query: "", page: 1, pageSize: 20 },
        groups: { query: "", page: 1, pageSize: 20 },
      },
      modal: null,
      confirm: null,
      expandedGroups: new Set(),
    };
  }

  function icon(name) {
    const paths = {
      edit: '<path d="m4 14 1-4 7-7 3 3-7 7-4 1Z"/><path d="m10.5 4.5 3 3"/>',
      delete: '<path d="M4 6h12M8 3h4l1 3H7l1-3Zm-2 3 1 11h6l1-11"/>',
      search: '<circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/>',
      close: '<path d="m5 5 10 10M15 5 5 15"/>',
      chevron: '<path d="m7 5 5 5-5 5"/>',
      users: '<circle cx="7" cy="7" r="3"/><circle cx="14.5" cy="8" r="2.5"/><path d="M1.5 17a5.5 5.5 0 0 1 11 0m-.5-.5a4 4 0 0 1 6 0"/>',
    };
    return `<svg viewBox="0 0 20 20" aria-hidden="true">${paths[name]}</svg>`;
  }

  function initials(name) {
    return String(name || "?")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function renderStatus(label, type) {
    const variant = normalize(label).replaceAll(" ", "-");
    return `<span class="agents-status agents-status--${variant}"><i></i>${escapeHtml(label || type)}</span>`;
  }

  function pageItems(records, listState) {
    const page = clampPage(listState.page, records.length, listState.pageSize);
    const start = (page - 1) * listState.pageSize;
    return { page, rows: records.slice(start, start + listState.pageSize) };
  }

  function renderPagination(tab, total, listState) {
    const current = clampPage(listState.page, total, listState.pageSize);
    const totalPages = Math.max(1, Math.ceil(total / listState.pageSize));
    const pageButtons = [];
    const candidates = totalPages <= 5
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, 2, 3, "ellipsis", totalPages];

    candidates.forEach((page) => {
      if (page === "ellipsis") {
        pageButtons.push('<span class="agents-pagination-ellipsis">...</span>');
      } else {
        pageButtons.push(
          `<button type="button" class="agents-page-number${page === current ? " is-current" : ""}" data-action="page" data-tab="${tab}" data-page="${page}" aria-label="Page ${page}">${page}</button>`,
        );
      }
    });

    return `
      <div class="agents-pagination">
        <button type="button" data-action="page" data-tab="${tab}" data-page="${current - 1}" ${current === 1 ? "disabled" : ""}>
          <span aria-hidden="true">‹</span> Previous
        </button>
        ${pageButtons.join("")}
        <button type="button" data-action="page" data-tab="${tab}" data-page="${current + 1}" ${current === totalPages ? "disabled" : ""}>
          Next <span aria-hidden="true">›</span>
        </button>
        <select class="agents-page-size" data-action="page-size" data-tab="${tab}" aria-label="Rows per page">
          ${[10, 20, 50].map((size) => `<option value="${size}"${size === listState.pageSize ? " selected" : ""}>${size} / page</option>`).join("")}
        </select>
      </div>
    `;
  }

  function renderAgentRows(state, agents) {
    if (!agents.length) {
      return '<tr><td colspan="7"><div class="agents-empty">No agents match your search.</div></td></tr>';
    }

    return agents.map((agent) => {
      const groupNames = state.groups
        .filter((group) => (agent.groupIds || []).includes(group.id))
        .map((group) => group.name)
        .join(", ");
      return `
        <tr>
          <td>${escapeHtml(agent.account)}</td>
          <td>
            <span class="agent-person">
              <span class="agent-avatar">${escapeHtml(initials(agent.fullName))}</span>
              <span>${escapeHtml(agent.fullName)}</span>
            </span>
          </td>
          <td>${escapeHtml((agent.roles || []).join(", "))}</td>
          <td>${escapeHtml(groupNames || "—")}</td>
          <td>${renderStatus(agent.status, "status")}</td>
          <td>${renderStatus(agent.accountStatus, "account")}</td>
          <td>
            <div class="agents-row-actions">
              <button type="button" data-action="edit-agent" data-id="${agent.id}" aria-label="Edit ${escapeHtml(agent.fullName)}">${icon("edit")}</button>
              <button type="button" data-action="delete-agent" data-id="${agent.id}" aria-label="Delete ${escapeHtml(agent.fullName)}">${icon("delete")}</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderMemberChip(agent) {
    return `
      <span class="member-chip" tabindex="0">
        <span>${escapeHtml(initials(agent.account))}</span>${escapeHtml(agent.account)}
        <span class="member-profile-card" role="tooltip">
          <span class="member-profile-avatar">${escapeHtml(initials(agent.fullName))}</span>
          <span class="member-profile-copy">
            <strong>${escapeHtml(agent.fullName)}</strong>
            <small>${escapeHtml(agent.email)}</small>
            <span>${(agent.roles || []).map((role) => `<i>${escapeHtml(role)}</i>`).join("")}</span>
          </span>
        </span>
      </span>
    `;
  }

  function renderGroupRows(state, groups) {
    if (!groups.length) {
      return '<tr><td colspan="4"><div class="agents-empty">No groups match your search.</div></td></tr>';
    }

    return groups.map((group) => {
      const members = group.memberIds.map((id) => state.agents.find((agent) => agent.id === id)).filter(Boolean);
      const expanded = state.expandedGroups.has(group.id);
      const visibleMembers = expanded ? members : members.slice(0, 6);
      return `
        <tr>
          <td>${escapeHtml(group.name)}</td>
          <td>${members.length}</td>
          <td>
            <div class="group-member-list">
              ${visibleMembers.map(renderMemberChip).join("")}
              ${members.length > 6 ? `
                <button type="button" class="group-expand" data-action="toggle-group" data-id="${group.id}" aria-expanded="${expanded}">
                  ${expanded ? "Show less" : `+${members.length - 6}`} ${icon("chevron")}
                </button>
              ` : ""}
            </div>
          </td>
          <td>
            <div class="agents-row-actions">
              <button type="button" data-action="edit-group" data-id="${group.id}" aria-label="Edit ${escapeHtml(group.name)}">${icon("edit")}</button>
              <button type="button" data-action="delete-group" data-id="${group.id}" aria-label="Delete ${escapeHtml(group.name)}">${icon("delete")}</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderList(state) {
    const tab = state.activeTab;
    const listState = state.lists[tab];
    const filtered = tab === "agents"
      ? filterAgents(state.agents, listState.query)
      : filterGroups(state.groups, listState.query);
    const result = pageItems(filtered, listState);
    listState.page = result.page;
    const isAgents = tab === "agents";

    return `
      <div class="agents-toolbar">
        <form class="agents-search" data-action="search-form" data-tab="${tab}">
          <label>
            ${icon("search")}
            <input type="search" name="query" value="${escapeHtml(listState.query)}" placeholder="${isAgents ? "Search by agent's account and name" : "Search by group name"}" aria-label="${isAgents ? "Search agents" : "Search groups"}" />
          </label>
          <button type="submit">Search</button>
        </form>
        <button type="button" class="agents-primary-button" data-action="${isAgents ? "add-agent" : "add-group"}">
          <span aria-hidden="true">+</span> ${isAgents ? "Add agent" : "Create group"}
        </button>
      </div>
      <div class="agents-table-wrap">
        ${isAgents ? `
          <table class="agents-table agents-table--people">
            <thead><tr><th>Account</th><th>Name</th><th>Role</th><th>Group</th><th>Status</th><th>Account status</th><th>Action</th></tr></thead>
            <tbody>${renderAgentRows(state, result.rows)}</tbody>
          </table>
        ` : `
          <table class="agents-table agents-table--groups">
            <thead><tr><th>Group</th><th>Number of members</th><th>List of members</th><th>Action</th></tr></thead>
            <tbody>${renderGroupRows(state, result.rows)}</tbody>
          </table>
        `}
      </div>
      ${renderPagination(tab, filtered.length, listState)}
    `;
  }

  function fieldError(errors, name) {
    return errors && errors[name] ? `<span class="agents-field-error">${escapeHtml(errors[name])}</span>` : "";
  }

  function renderAgentModal(state) {
    const modal = state.modal;
    const draft = modal.draft;
    const isAccount = modal.tab === "account";
    const isRoles = modal.tab === "roles";
    const checkedRole = (role) => (draft.roles || []).includes(role) ? " checked" : "";
    const selectedGroups = state.groups.filter((group) => (draft.groupIds || []).includes(group.id));

    let body = "";
    if (isAccount) {
      body = `
        <div class="agent-identity">
          <span class="agent-identity-avatar">${escapeHtml(initials(draft.fullName || "New Agent"))}</span>
          <div><strong>${escapeHtml(draft.fullName || "New agent")}</strong><span>${(draft.roles || ["CS Agent"]).map((role) => `<i>${escapeHtml(role)}</i>`).join("")}</span></div>
        </div>
        <p class="agents-file-note">File formats supported: JPEG and PNG. File size must be under 1MB.</p>
        <div class="agents-form-grid">
          <label>Full name <b>*</b><input name="fullName" value="${escapeHtml(draft.fullName)}" />${fieldError(modal.errors, "fullName")}</label>
          <label>Email <b>*</b><input type="email" name="email" value="${escapeHtml(draft.email)}" />${fieldError(modal.errors, "email")}</label>
          <label>Native language
            <select name="nativeLanguage">${["English", "Chinese", "Vietnamese", "Spanish"].map((value) => `<option${draft.nativeLanguage === value ? " selected" : ""}>${value}</option>`).join("")}</select>
          </label>
          <label>Nationality
            <select name="nationality">${["US", "CN", "VN", "SG", "GB"].map((value) => `<option${draft.nationality === value ? " selected" : ""}>${value}</option>`).join("")}</select>
          </label>
          <label class="agents-phone-field">Phone number
            <span><select name="phoneCountry">${["+1", "+84", "+86", "+65"].map((value) => `<option${draft.phoneCountry === value ? " selected" : ""}>${value}</option>`).join("")}</select><input name="phone" value="${escapeHtml(draft.phone)}" /></span>
          </label>
        </div>
      `;
    } else if (isRoles) {
      body = `
        <div class="agent-role-list">
          <label><input type="checkbox" name="role" value="CS Agent"${checkedRole("CS Agent")} /><span><strong>CS Agent</strong><small>Access to Chats, Chat record, User list, Knowledge base and Reports in Wellytalk</small></span></label>
          <label><input type="checkbox" name="role" value="CS Manager"${checkedRole("CS Manager")} /><span><strong>CS Manager</strong><small>Access to Chats, Chat record, User list, Knowledge base, Reports, Team management, and Settings in Wellytalk</small></span></label>
        </div>
      `;
    } else {
      body = `
        <div class="agent-work-settings">
          <label>Chat limit<input type="number" min="1" max="100" name="chatLimit" value="${escapeHtml(draft.chatLimit)}" /></label>
          <fieldset>
            <legend>Assigned to groups</legend>
            <div class="assigned-group-chips" aria-label="Assigned groups">
              ${selectedGroups.map((group) => `<span>${escapeHtml(group.name)}</span>`).join("") || "<small>No groups assigned</small>"}
            </div>
          </fieldset>
        </div>
      `;
    }

    return renderModalShell({
      title: modal.mode === "create" ? "Add agent" : "Edit agent",
      size: "large",
      body: `
        <div class="agents-modal-tabs" role="tablist">
          ${[["account", "Account info"], ["roles", "Role settings"], ["work", "Work settings"]].map(([id, label]) => `<button type="button" role="tab" data-action="agent-modal-tab" data-tab="${id}" class="${modal.tab === id ? "is-active" : ""}" aria-selected="${modal.tab === id}">${label}</button>`).join("")}
        </div>
        <div class="agents-modal-body">${body}</div>
      `,
      primary: "Save",
    });
  }

  function renderGroupModal(state) {
    const modal = state.modal;
    const draft = modal.draft;
    const query = normalize(modal.memberQuery);
    const visibleAgents = state.agents.filter((agent) =>
      !query || normalize(`${agent.account} ${agent.fullName} ${agent.email}`).includes(query),
    );
    const selected = state.agents.filter((agent) => (draft.memberIds || []).includes(agent.id));
    const allVisibleSelected = visibleAgents.length > 0 && visibleAgents.every((agent) => draft.memberIds.includes(agent.id));

    return renderModalShell({
      title: modal.mode === "create" ? "Create group" : "Edit group",
      size: "group",
      body: `
        <div class="group-name-field">
          <label>Group name <b>*</b><input name="name" maxlength="40" value="${escapeHtml(draft.name)}" placeholder="Input group name" /></label>
          <span>${draft.name.length}/40</span>
          ${fieldError(modal.errors, "name")}
        </div>
        <fieldset class="group-member-editor">
          <legend>Add members</legend>
          <div class="group-member-picker">
            <div class="group-member-source">
              <label class="group-member-search">${icon("search")}<input name="memberQuery" value="${escapeHtml(modal.memberQuery)}" placeholder="Search by member's name" /></label>
              <label class="group-member-check group-member-check--all"><input type="checkbox" data-action="select-all-members"${allVisibleSelected ? " checked" : ""} /> Select all</label>
              ${visibleAgents.map((agent) => `<label class="group-member-check"><input type="checkbox" name="memberId" value="${agent.id}"${draft.memberIds.includes(agent.id) ? " checked" : ""} /> ${escapeHtml(agent.account)}</label>`).join("") || '<p class="group-member-empty">No matching members</p>'}
            </div>
            <div class="group-member-selected">
              <strong>Selected</strong>
              <div>${selected.map((agent) => `<span>${escapeHtml(agent.account)} <button type="button" data-action="remove-member" data-id="${agent.id}" aria-label="Remove ${escapeHtml(agent.account)}">×</button></span>`).join("") || "<small>No members selected</small>"}</div>
            </div>
          </div>
        </fieldset>
      `,
      primary: modal.mode === "create" ? "Create group" : "Save",
    });
  }

  function renderModalShell({ title, size, body, primary }) {
    return `
      <div class="agents-overlay" data-action="modal-overlay">
        <section class="agents-modal agents-modal--${size}" role="dialog" aria-modal="true" aria-labelledby="agents-modal-title">
          <header><h3 id="agents-modal-title">${escapeHtml(title)}</h3><button type="button" data-action="close-modal" aria-label="Close">${icon("close")}</button></header>
          ${body}
          <footer>
            <button type="button" class="agents-secondary-button" data-action="close-modal">Cancel</button>
            <button type="button" class="agents-primary-button" data-action="save-modal">${escapeHtml(primary)}</button>
          </footer>
        </section>
      </div>
    `;
  }

  function renderConfirm(state) {
    if (!state.confirm) return "";
    return `
      <div class="agents-overlay agents-overlay--confirm">
        <section class="agents-confirm" role="alertdialog" aria-modal="true" aria-labelledby="agents-confirm-title">
          <span class="agents-confirm-icon">${icon("delete")}</span>
          <h3 id="agents-confirm-title">Delete ${state.confirm.type === "agent" ? "agent" : "group"}?</h3>
          <p><strong>${escapeHtml(state.confirm.name)}</strong> will be removed from this prototype. This action cannot be undone until the page is refreshed.</p>
          <footer>
            <button type="button" class="agents-secondary-button" data-action="cancel-delete">Cancel</button>
            <button type="button" class="agents-danger-button" data-action="confirm-delete">Delete</button>
          </footer>
        </section>
      </div>
    `;
  }

  function renderAgentsPage(root, state) {
    root.innerHTML = `
      <div class="agents-page">
        <header class="agents-page-header">
          <div class="page-title-row">
            <span class="page-title-icon">${icon("users")}</span>
            <h2>Agents</h2>
          </div>
          <div class="agents-tabs" role="tablist" aria-label="Agent management views">
            <button type="button" role="tab" data-action="switch-tab" data-tab="agents" class="${state.activeTab === "agents" ? "is-active" : ""}" aria-selected="${state.activeTab === "agents"}">Agent</button>
            <button type="button" role="tab" data-action="switch-tab" data-tab="groups" class="${state.activeTab === "groups" ? "is-active" : ""}" aria-selected="${state.activeTab === "groups"}">Group</button>
          </div>
        </header>
        <section class="agents-list" aria-live="polite">${renderList(state)}</section>
        ${state.modal ? (state.modal.type === "agent" ? renderAgentModal(state) : renderGroupModal(state)) : ""}
        ${renderConfirm(state)}
      </div>
    `;
  }

  function emptyAgentDraft() {
    return {
      account: "",
      fullName: "",
      email: "",
      roles: ["CS Agent"],
      groupIds: [],
      status: "Offline",
      accountStatus: "Active",
      nativeLanguage: "English",
      nationality: "US",
      phoneCountry: "+1",
      phone: "",
      chatLimit: 20,
    };
  }

  function openModal(state, type, mode, record) {
    const draft = type === "agent"
      ? (record ? cloneRecords([record])[0] : emptyAgentDraft())
      : (record ? cloneRecords([record])[0] : { name: "", memberIds: [] });
    state.modal = {
      type,
      mode,
      tab: "account",
      memberQuery: "",
      draft,
      original: JSON.stringify(draft),
      errors: {},
    };
  }

  function syncGroupsFromAgent(state, savedAgent) {
    state.groups = state.groups.map((group) => {
      const shouldInclude = savedAgent.groupIds.includes(group.id);
      const members = new Set(group.memberIds);
      if (shouldInclude) members.add(savedAgent.id);
      else members.delete(savedAgent.id);
      return { ...group, memberIds: [...members] };
    });
  }

  function syncAgentsFromGroup(state, savedGroup) {
    state.agents = state.agents.map((agent) => {
      const groups = new Set(agent.groupIds || []);
      if (savedGroup.memberIds.includes(agent.id)) groups.add(savedGroup.id);
      else groups.delete(savedGroup.id);
      return { ...agent, groupIds: [...groups] };
    });
  }

  function bindAgentsEvents(root, state) {
    function rerender() {
      renderAgentsPage(root, state);
    }

    function closeModal() {
      state.modal = null;
      rerender();
    }

    function updateDraftField(target) {
      if (!state.modal || !target.name) return;
      if (target.name === "role") {
        const roles = new Set(state.modal.draft.roles || []);
        target.checked ? roles.add(target.value) : roles.delete(target.value);
        state.modal.draft.roles = [...roles];
      } else if (target.name === "memberId") {
        const ids = new Set(state.modal.draft.memberIds || []);
        target.checked ? ids.add(target.value) : ids.delete(target.value);
        state.modal.draft.memberIds = [...ids];
      } else if (target.name === "chatLimit") {
        state.modal.draft.chatLimit = Number(target.value);
      } else if (target.name !== "memberQuery") {
        state.modal.draft[target.name] = target.value;
      }
    }

    root.addEventListener("submit", (event) => {
      const form = event.target.closest('[data-action="search-form"]');
      if (!form) return;
      event.preventDefault();
      const tab = form.dataset.tab;
      state.lists[tab].query = new FormData(form).get("query") || "";
      state.lists[tab].page = 1;
      rerender();
    });

    root.addEventListener("input", (event) => {
      if (!state.modal) return;
      if (event.target.name === "memberQuery") {
        state.modal.memberQuery = event.target.value;
        rerender();
        const input = root.querySelector('input[name="memberQuery"]');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
        return;
      }
      updateDraftField(event.target);
      if (event.target.name === "name") {
        const count = event.target.closest(".group-name-field").querySelector(":scope > span");
        if (count) count.textContent = `${event.target.value.length}/40`;
      }
    });

    root.addEventListener("change", (event) => {
      const action = event.target.dataset.action;
      if (action === "page-size") {
        const tab = event.target.dataset.tab;
        state.lists[tab].pageSize = Number(event.target.value);
        state.lists[tab].page = 1;
        rerender();
        return;
      }
      updateDraftField(event.target);
      if (["role", "memberId"].includes(event.target.name)) rerender();
    });

    root.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.dataset.action;
      const id = target.dataset.id;

      if (action === "switch-tab") {
        state.activeTab = target.dataset.tab;
        rerender();
      } else if (action === "page") {
        const tab = target.dataset.tab;
        state.lists[tab].page = Number(target.dataset.page);
        rerender();
      } else if (action === "add-agent") {
        openModal(state, "agent", "create");
        rerender();
      } else if (action === "edit-agent") {
        openModal(state, "agent", "edit", state.agents.find((agent) => agent.id === id));
        rerender();
      } else if (action === "add-group") {
        openModal(state, "group", "create");
        rerender();
      } else if (action === "edit-group") {
        openModal(state, "group", "edit", state.groups.find((group) => group.id === id));
        rerender();
      } else if (action === "agent-modal-tab") {
        state.modal.tab = target.dataset.tab;
        rerender();
      } else if (action === "toggle-group") {
        state.expandedGroups.has(id) ? state.expandedGroups.delete(id) : state.expandedGroups.add(id);
        rerender();
      } else if (action === "remove-member") {
        state.modal.draft.memberIds = state.modal.draft.memberIds.filter((memberId) => memberId !== id);
        rerender();
      } else if (action === "select-all-members") {
        const query = normalize(state.modal.memberQuery);
        const visibleIds = state.agents
          .filter((agent) => !query || normalize(`${agent.account} ${agent.fullName} ${agent.email}`).includes(query))
          .map((agent) => agent.id);
        const ids = new Set(state.modal.draft.memberIds);
        const allSelected = visibleIds.every((agentId) => ids.has(agentId));
        visibleIds.forEach((agentId) => allSelected ? ids.delete(agentId) : ids.add(agentId));
        state.modal.draft.memberIds = [...ids];
        rerender();
      } else if (action === "close-modal") {
        closeModal();
      } else if (action === "modal-overlay" && event.target === target) {
        if (JSON.stringify(state.modal.draft) === state.modal.original) closeModal();
      } else if (action === "save-modal") {
        if (state.modal.type === "agent") {
          const errors = validateAgentDraft(state.modal.draft);
          if (Object.keys(errors).length) {
            state.modal.errors = errors;
            state.modal.tab = "account";
            rerender();
            return;
          }
          state.agents = upsertAgent(state.agents, state.modal.draft);
          const saved = state.modal.draft.id
            ? state.agents.find((agent) => agent.id === state.modal.draft.id)
            : state.agents[state.agents.length - 1];
          syncGroupsFromAgent(state, saved);
        } else {
          const errors = validateGroupDraft(state.modal.draft);
          if (Object.keys(errors).length) {
            state.modal.errors = errors;
            rerender();
            return;
          }
          state.groups = upsertGroup(state.groups, state.modal.draft);
          const saved = state.modal.draft.id
            ? state.groups.find((group) => group.id === state.modal.draft.id)
            : state.groups[state.groups.length - 1];
          syncAgentsFromGroup(state, saved);
        }
        closeModal();
      } else if (action === "delete-agent") {
        const agent = state.agents.find((item) => item.id === id);
        state.confirm = { type: "agent", id, name: agent.fullName };
        rerender();
      } else if (action === "delete-group") {
        const group = state.groups.find((item) => item.id === id);
        state.confirm = { type: "group", id, name: group.name };
        rerender();
      } else if (action === "cancel-delete") {
        state.confirm = null;
        rerender();
      } else if (action === "confirm-delete") {
        const next = state.confirm.type === "agent"
          ? removeAgentFromState(state, state.confirm.id)
          : removeGroupFromState(state, state.confirm.id);
        state.agents = next.agents;
        state.groups = next.groups;
        state.confirm = null;
        state.lists.agents.page = clampPage(state.lists.agents.page, filterAgents(state.agents, state.lists.agents.query).length, state.lists.agents.pageSize);
        state.lists.groups.page = clampPage(state.lists.groups.page, filterGroups(state.groups, state.lists.groups.query).length, state.lists.groups.pageSize);
        rerender();
      }
    });

    function handleKeydown(event) {
      if (event.key !== "Escape") return;
      if (state.confirm) {
        state.confirm = null;
        rerender();
      } else if (state.modal) {
        state.modal = null;
        rerender();
      }
    }

    document.addEventListener("keydown", handleKeydown);
    rerender();
    return () => document.removeEventListener("keydown", handleKeydown);
  }

  function mountAgentsPage(root) {
    const state = createInitialState();
    const unbind = bindAgentsEvents(root, state);
    return () => {
      unbind();
      root.replaceChildren();
    };
  }

  const api = {
    DEFAULT_AGENTS,
    DEFAULT_GROUPS,
    cloneRecords,
    filterAgents,
    filterGroups,
    validateAgentDraft,
    validateGroupDraft,
    upsertAgent,
    upsertGroup,
    removeAgentFromState,
    removeGroupFromState,
    clampPage,
    createInitialState,
    mountAgentsPage,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (globalScope) globalScope.WellytalkAgents = api;
})(typeof window !== "undefined" ? window : globalThis);
