const MENU_CONFIG = {
  inbox: {
    id: "inbox",
    label: "Inbox",
    icon: "inbox",
    defaultPath: ["chat", "my"],
    items: [
      {
        id: "chat",
        label: "Chat",
        icon: "chat",
        children: [
          { id: "my", label: "My" },
          { id: "unassigned", label: "Unassigned" },
          { id: "all-chats", label: "All chats" },
          { id: "archived", label: "Archived" },
        ],
      },
      { id: "tickets", label: "Tickets", icon: "ticket" },
    ],
  },
  knowledge: {
    id: "knowledge",
    label: "Knowledge base",
    icon: "knowledge",
    defaultPath: ["public-knowledge", "articles"],
    items: [
      {
        id: "public-knowledge",
        label: "Public knowledge",
        icon: "knowledge",
        children: [
          { id: "articles", label: "Articles" },
          { id: "faqs", label: "FAQs" },
        ],
      },
      { id: "business-categories", label: "Business categories", icon: "category" },
    ],
  },
  reports: {
    id: "reports",
    label: "Management & Reports",
    icon: "reports",
    defaultPath: ["overview"],
    items: [
      { id: "monitor", label: "Monitor", icon: "monitor" },
      { id: "overview", label: "Overview", icon: "overview" },
      { id: "dataset-export", label: "Dataset export", icon: "export" },
      {
        id: "reports-group",
        label: "Reports",
        icon: "reports",
        children: [
          {
            id: "chat-reports",
            label: "Chat",
            children: [
              { id: "total-chats", label: "Total chats" },
              { id: "missed-chats", label: "Missed chats" },
              { id: "tag-usage", label: "Tag usage" },
              { id: "chat-satisfaction", label: "Chat satisfaction" },
              { id: "chat-availability", label: "Chat availability" },
            ],
          },
          {
            id: "agent-reports",
            label: "Agent",
            children: [
              { id: "agent-performance", label: "Agent performance" },
              { id: "chat-response-times", label: "Chat response times" },
              { id: "staffing-prediction", label: "Staffing prediction" },
              { id: "agent-activity", label: "Agent activity" },
            ],
          },
          {
            id: "insights",
            label: "Insights",
            children: [{ id: "top-customer-questions", label: "Top customer questions" }],
          },
        ],
      },
    ],
  },
  customers: {
    id: "customers",
    label: "Customers",
    icon: "customers",
    defaultPath: ["customers-overview"],
    items: [{ id: "customers-overview", label: "Overview", icon: "overview" }],
  },
  settings: {
    id: "settings",
    label: "Settings",
    icon: "settings",
    defaultPath: ["settings-inbox", "routing-rules"],
    items: [
      { id: "general", label: "General", icon: "general" },
      { id: "subscription", label: "Subscription", icon: "subscription" },
      {
        id: "team",
        label: "Team",
        icon: "team",
        children: [
          { id: "agents", label: "Agents", view: "agents" },
          { id: "roles-permissions", label: "Roles & permissions" },
        ],
      },
      {
        id: "channels",
        label: "Channels",
        icon: "channels",
        children: [
          { id: "widget", label: "Widget" },
          { id: "email", label: "Email" },
          { id: "whatsapp", label: "WhatsApp" },
          { id: "telegram", label: "Telegram" },
          { id: "facebook-messenger", label: "Facebook Messenger" },
        ],
      },
      {
        id: "automation",
        label: "Automation",
        icon: "automation",
        children: [
          { id: "chatbot", label: "Chatbot" },
          { id: "workflows", label: "Workflows" },
          { id: "auto-replies", label: "Auto replies" },
        ],
      },
      {
        id: "settings-inbox",
        label: "Inbox",
        icon: "inbox",
        children: [
          { id: "labels", label: "Labels" },
          { id: "chat-settings", label: "Chat settings" },
          { id: "routing-rules", label: "Routing rules", view: "routing-rules" },
          { id: "quick-answers", label: "Quick answers" },
        ],
      },
      { id: "apps-integrations", label: "Apps & integrations", icon: "apps" },
      {
        id: "personal",
        label: "Personal",
        icon: "personal",
        children: [
          { id: "details", label: "Details" },
          { id: "notifications", label: "Notifications" },
          { id: "account-security", label: "Account security" },
        ],
      },
    ],
  },
};

function flattenMenuLabels(moduleOrItem) {
  const rootLabel = moduleOrItem.label ? [moduleOrItem.label] : [];
  const children = moduleOrItem.items || moduleOrItem.children || [];

  return children.reduce(
    (labels, item) => labels.concat(flattenMenuLabels(item)),
    rootLabel,
  );
}

function resolveMenuPath(moduleConfig, path) {
  let items = moduleConfig.items || [];
  const breadcrumb = [moduleConfig.label];
  let leaf = null;

  for (const id of path) {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
      return { leaf: null, breadcrumb };
    }

    leaf = item;
    breadcrumb.push(item.label);
    items = item.children || [];
  }

  return { leaf, breadcrumb };
}

function getViewType(leaf) {
  if (!leaf) return "placeholder";
  if (leaf.view === "routing-rules") return "routing-rules";
  if (leaf.view === "agents") return "agents";
  return "placeholder";
}

function toggleRule(state, ruleName) {
  if (!Object.prototype.hasOwnProperty.call(state, ruleName)) {
    return state;
  }

  return { ...state, [ruleName]: !state[ruleName] };
}

function selectLoadRule(state, loadStrategy) {
  return { ...state, loadStrategy };
}

const ICONS = {
  inbox: '<path d="M4 5h12v9H4z"/><path d="M4 10h3l2 2h2l2-2h3"/>',
  knowledge: '<path d="M3 4.5A3.5 3.5 0 0 1 6.5 1H10v15H6.5A3.5 3.5 0 0 0 3 19V4.5Z"/><path d="M17 4.5A3.5 3.5 0 0 0 13.5 1H10v15h3.5A3.5 3.5 0 0 1 17 19V4.5Z"/>',
  reports: '<path d="M3 17V9h3v8H3Zm5 0V3h3v14H8Zm5 0V6h3v11h-3Z"/>',
  customers: '<circle cx="7" cy="7" r="3"/><circle cx="14.5" cy="8" r="2.5"/><path d="M1.5 17a5.5 5.5 0 0 1 11 0m-.5-.5a4 4 0 0 1 6 0"/>',
  settings: '<circle cx="10" cy="10" r="3"/><path d="m16 11.5 1.3.8-1.5 2.7-1.5-.6a6 6 0 0 1-1.7 1l-.2 1.6H9l-.2-1.6a6 6 0 0 1-1.7-1l-1.5.6-1.5-2.7 1.3-.8a6 6 0 0 1 0-2.1l-1.3-.8 1.5-2.7 1.5.6a6 6 0 0 1 1.7-1L9 4h3.4l.2 1.5a6 6 0 0 1 1.7 1l1.5-.6 1.5 2.7-1.3.8a6 6 0 0 1 0 2.1Z"/>',
  general: '<rect x="2" y="2" width="6" height="6" rx="2"/><rect x="12" y="2" width="6" height="6" rx="2"/><rect x="2" y="12" width="6" height="6" rx="2"/><rect x="12" y="12" width="6" height="6" rx="2"/>',
  subscription: '<path d="M3 4h11v13H5a2 2 0 0 1-2-2V4Z"/><path d="M14 7h3v7h-3M7 7v6m-3-3h6"/>',
  team: '<circle cx="7" cy="7" r="3"/><circle cx="14.5" cy="8" r="2.5"/><path d="M1.5 17a5.5 5.5 0 0 1 11 0m-.5-.5a4 4 0 0 1 6 0"/>',
  channels: '<path d="M4 3h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>',
  automation: '<rect x="2" y="4" width="16" height="12" rx="3"/><path d="M6 10h2m4 0h2M7 7h6"/>',
  apps: '<rect x="2" y="2" width="6" height="6" rx="2"/><rect x="12" y="2" width="6" height="6" rx="2"/><rect x="2" y="12" width="6" height="6" rx="2"/><rect x="12" y="12" width="6" height="6" rx="2"/>',
  personal: '<circle cx="10" cy="6" r="3"/><path d="M4 17a6 6 0 0 1 12 0H4Z"/>',
  chat: '<path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  ticket: '<path d="M3 5h14v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V5Z"/>',
  category: '<path d="M3 4h6l2 2h6v10H3V4Z"/>',
  monitor: '<rect x="2" y="3" width="16" height="11" rx="2"/><path d="M7 18h6m-3-4v4"/>',
  overview: '<path d="M3 10a7 7 0 1 1 7 7"/><path d="M10 3v7h7"/>',
  export: '<path d="M10 2v10m-4-4 4 4 4-4"/><path d="M3 14v3h14v-3"/>',
};

function iconMarkup(iconName, className = "settings-icon") {
  const paths = ICONS[iconName] || ICONS.general;
  return `<span class="${className}"><svg viewBox="0 0 20 20" aria-hidden="true">${paths}</svg></span>`;
}

function pathKey(path) {
  return path.join("/");
}

function isPathSelected(activePath, candidatePath) {
  return pathKey(activePath) === pathKey(candidatePath);
}

function bindRoutingRuleControls(root) {
  let ruleState = {
    lastAgent: true,
    language: true,
    skill: true,
    load: true,
    loadStrategy: "current",
  };

  root.querySelectorAll(".switch input[data-rule]").forEach((input) => {
    input.setAttribute("role", "switch");
    input.setAttribute("aria-checked", String(input.checked));

    input.addEventListener("change", () => {
      ruleState = toggleRule(ruleState, input.dataset.rule);
      input.setAttribute("aria-checked", String(input.checked));
    });
  });

  root.querySelectorAll('input[name="load-strategy"]').forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        ruleState = selectLoadRule(ruleState, input.value);
      }
    });
  });
}

function initializePrototype() {
  const globalNavigation = document.querySelector("#global-navigation");
  const contextTitle = document.querySelector("#context-title");
  const contextNavigation = document.querySelector("#context-navigation");
  const pageContent = document.querySelector("#page-content");
  const routingTemplate = document.querySelector("#routing-rules-template");
  const profileTrigger = document.querySelector("#profile-trigger");
  const profileMenu = document.querySelector("#profile-menu");
  const profileFeedback = document.querySelector("#profile-feedback");
  let agentsCleanup = null;

  const state = {
    activeModule: "settings",
    activePath: ["settings-inbox", "routing-rules"],
    expandedGroups: new Set(["settings-inbox"]),
    profileMenuOpen: false,
  };

  function expandPath(path) {
    path.slice(0, -1).forEach((id) => state.expandedGroups.add(id));
  }

  function renderGlobalNavigation() {
    globalNavigation.replaceChildren();

    Object.values(MENU_CONFIG).forEach((moduleConfig) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "global-nav-button";
      button.dataset.module = moduleConfig.id;
      button.setAttribute("aria-label", moduleConfig.label);
      button.innerHTML = iconMarkup(moduleConfig.icon, "global-icon");

      if (moduleConfig.id === "inbox") {
        button.classList.add("has-badge");
        button.insertAdjacentHTML("afterbegin", '<span class="nav-badge">12</span>');
      }

      if (moduleConfig.id === state.activeModule) {
        button.classList.add("is-selected");
        button.setAttribute("aria-current", "page");
      }

      button.addEventListener("click", () => {
        state.activeModule = moduleConfig.id;
        state.activePath = [...moduleConfig.defaultPath];
        state.expandedGroups.clear();
        expandPath(state.activePath);
        renderApplication();
      });

      globalNavigation.append(button);
    });
  }

  function renderMenuItems(items, parentPath = [], depth = 0) {
    const fragment = document.createDocumentFragment();

    items.forEach((item) => {
      const itemPath = [...parentPath, item.id];
      const hasChildren = Boolean(item.children && item.children.length);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `settings-nav-item context-nav-item depth-${depth}`;
      button.dataset.menuId = item.id;
      button.style.setProperty("--menu-depth", depth);

      if (depth > 0) {
        button.classList.add("settings-subnav-item");
      }

      if (hasChildren) {
        const isExpanded = state.expandedGroups.has(item.id);
        button.classList.add("context-nav-group");
        button.setAttribute("aria-expanded", String(isExpanded));
        button.innerHTML = `${depth === 0 ? iconMarkup(item.icon) : '<span class="context-node-dot"></span>'}<span class="context-label">${item.label}</span><svg class="chevron${isExpanded ? " chevron--down" : ""}" viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>`;
        button.addEventListener("click", () => {
          if (isExpanded) {
            state.expandedGroups.delete(item.id);
          } else {
            state.expandedGroups.add(item.id);
          }
          renderContextNavigation();
        });
      } else {
        button.innerHTML = `${depth === 0 ? iconMarkup(item.icon) : '<span class="context-node-dot"></span>'}<span class="context-label">${item.label}</span>`;

        if (isPathSelected(state.activePath, itemPath)) {
          button.classList.add("is-selected");
          button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
          state.activePath = itemPath;
          expandPath(itemPath);
          renderContextNavigation();
          renderPageContent();
        });
      }

      fragment.append(button);

      if (hasChildren && state.expandedGroups.has(item.id)) {
        const childGroup = document.createElement("div");
        childGroup.className = `context-nav-children depth-${depth + 1}`;
        childGroup.append(renderMenuItems(item.children, itemPath, depth + 1));
        fragment.append(childGroup);
      }
    });

    return fragment;
  }

  function renderContextNavigation() {
    const moduleConfig = MENU_CONFIG[state.activeModule];
    contextTitle.textContent = moduleConfig.label;
    contextNavigation.replaceChildren(renderMenuItems(moduleConfig.items));
  }

  function renderPlaceholder(resolution) {
    const title = resolution.leaf ? resolution.leaf.label : MENU_CONFIG[state.activeModule].label;
    const breadcrumb = resolution.breadcrumb
      .map((label, index) => `<span${index === resolution.breadcrumb.length - 1 ? ' aria-current="page"' : ""}>${label}</span>`)
      .join('<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg>');

    pageContent.innerHTML = `
      <div class="placeholder-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">${breadcrumb}</nav>
        <header class="placeholder-header">
          <div>
            <span class="prototype-badge">Prototype page</span>
            <h2>${title}</h2>
            <p>This page is included in the Wellytalk navigation prototype. Detailed product content can be added here later.</p>
          </div>
          <span class="placeholder-module-icon">${iconMarkup(MENU_CONFIG[state.activeModule].icon, "placeholder-icon")}</span>
        </header>
        <section class="placeholder-card">
          <div class="placeholder-illustration">${iconMarkup(MENU_CONFIG[state.activeModule].icon, "placeholder-large-icon")}</div>
          <h3>${title}</h3>
          <p>Navigation and hierarchy are ready for interaction testing.</p>
        </section>
      </div>
    `;
  }

  function renderPageContent() {
    const moduleConfig = MENU_CONFIG[state.activeModule];
    const resolution = resolveMenuPath(moduleConfig, state.activePath);
    const viewType = getViewType(resolution.leaf);

    if (agentsCleanup) {
      agentsCleanup();
      agentsCleanup = null;
    }

    if (viewType === "routing-rules") {
      pageContent.replaceChildren(routingTemplate.content.cloneNode(true));
      bindRoutingRuleControls(pageContent);
      return;
    }

    if (viewType === "agents" && window.WellytalkAgents) {
      agentsCleanup = window.WellytalkAgents.mountAgentsPage(pageContent);
      return;
    }

    renderPlaceholder(resolution);
  }

  function setProfileMenu(open) {
    state.profileMenuOpen = open;
    profileMenu.hidden = !open;
    profileTrigger.setAttribute("aria-expanded", String(open));
    if (!open) {
      profileFeedback.textContent = "";
    }
  }

  profileTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setProfileMenu(!state.profileMenuOpen);
  });

  profileMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    const action = event.target.closest("[data-profile-action]");
    if (action) {
      profileFeedback.textContent = `${action.dataset.profileAction} selected for prototype testing.`;
    }
  });

  document.addEventListener("click", () => setProfileMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setProfileMenu(false);
      profileTrigger.focus();
    }
  });

  function renderApplication() {
    renderGlobalNavigation();
    renderContextNavigation();
    renderPageContent();
  }

  expandPath(state.activePath);
  renderApplication();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializePrototype);
}

if (typeof module !== "undefined") {
  module.exports = {
    MENU_CONFIG,
    flattenMenuLabels,
    resolveMenuPath,
    getViewType,
    toggleRule,
    selectLoadRule,
  };
}
