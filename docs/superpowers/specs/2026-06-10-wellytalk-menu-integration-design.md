# Wellytalk Menu Integration Design

## Goal

Integrate the menu hierarchy from `Wellytalk 重构菜单结构.docx` into the existing Routing rules prototype. The result should support realistic navigation testing while keeping the project dependency-free and easy to extend.

## Navigation Model

The prototype retains three regions:

1. Global sidebar: switches between product modules.
2. Context sidebar: renders the selected module's second- and third-level menu.
3. Main content: renders the existing Routing rules page or a lightweight placeholder for unfinished pages.

The global sidebar contains:

- Inbox
- Knowledge base
- Management & Reports
- Customers
- Settings

The existing brand button remains at the top. Workspace and profile controls remain at the bottom.

## Menu Hierarchy

### Inbox

- Chat
  - My
  - Unassigned
  - All chats
  - Archived
- Tickets

`All chats` represents the manager-permission monitoring view. `Archived` represents chat records.

### Knowledge Base

- Public knowledge
  - Articles
  - FAQs
- Business categories

### Management & Reports

- Monitor
- Overview
- Dataset export
- Reports
  - Chat
    - Total chats
    - Missed chats
    - Tag usage
    - Chat satisfaction
    - Chat availability
  - Agent
    - Agent performance
    - Chat response times
    - Staffing prediction
    - Agent activity
  - Insights
    - Top customer questions

### Customers

Customers has no child items in the source document. Selecting it opens the Customers placeholder page directly while the context sidebar shows the module title and a selected Overview row.

### Settings

- General
- Subscription
- Team
  - Agents
  - Roles & permissions
- Channels
  - Widget
  - Email
  - WhatsApp
  - Telegram
  - Facebook Messenger
- Automation
  - Chatbot
  - Workflows
  - Auto replies
- Inbox
  - Labels
  - Chat settings
  - Routing rules
  - Quick answers
- Apps & integrations
- Personal
  - Details
  - Notifications
  - Account security

### Profile Menu

The profile avatar opens a compact menu containing:

- Away mode
- Theme
- Language
- Switch CID
- Log out

## Naming Rules

Correct spelling, capitalization, and pluralization while preserving the original meaning:

- `Setting` becomes `Settings`.
- `subscription` becomes `Subscription`.
- `Business catgory` becomes `Business categories`.
- `Overview(Dashbaord)` becomes `Overview`.
- `Dataset Export` becomes `Dataset export`.
- `Tags usage` becomes `Tag usage`.
- `chat satisfaction` becomes `Chat satisfaction`.
- `Chat availabilty` becomes `Chat availability`.
- `Top customer quesation` becomes `Top customer questions`.
- `Roles & permission` becomes `Roles & permissions`.
- `Facebook messenger` becomes `Facebook Messenger`.
- Parenthetical implementation notes are removed from visible labels.

## Rendering Architecture

Store navigation in a plain JavaScript configuration object. Each global module defines:

- Stable module identifier
- Visible label
- Icon identifier
- Child menu items
- Optional nested groups
- Default selected leaf

Render the context sidebar from this configuration. Menu buttons carry stable `data-*` identifiers rather than depending on visible text.

The existing Routing rules HTML should move into a reusable template block or rendering function so it can be restored after navigating to placeholder pages.

## Interaction Behavior

### Global Navigation

- Clicking a global module updates the selected icon.
- The context sidebar title and menu are replaced with that module's hierarchy.
- The module's default leaf becomes selected.
- The main content displays a placeholder for the selected default leaf unless it is Routing rules.

### Context Navigation

- Parent rows with children can expand and collapse.
- Selecting a leaf updates the selected row and breadcrumb.
- Selecting `Settings > Inbox > Routing rules` restores the full existing Routing rules page.
- Selecting any other leaf renders a placeholder page with:
  - Page title
  - Breadcrumb path
  - `Prototype page` status label
  - Short explanation that content will be added later

### Profile Menu

- Clicking the avatar toggles the profile menu.
- Clicking outside closes it.
- Profile actions update their visual selected state or show a lightweight prototype feedback message.
- No action performs account changes or navigation outside the prototype.

## State Model

Keep state in memory only:

- `activeModule`
- `activePath`
- `expandedGroups`
- `profileMenuOpen`

Refresh restores the default state:

- Active module: Settings
- Active path: Settings > Inbox > Routing rules
- Expanded group: Inbox
- Profile menu: closed

## Visual Design

Retain the existing visual system:

- Purple selected states
- White panel surfaces
- Compact desktop typography
- Rounded panels and subtle shadows
- Existing global sidebar width

The context sidebar may become slightly wider to accommodate longer labels such as `Management & Reports` and `Roles & permissions`. Deep report navigation uses compact indentation and scrolls vertically when necessary.

## Accessibility

- Use buttons for all interactive navigation rows.
- Set `aria-current="page"` on the selected leaf.
- Set `aria-expanded` on collapsible groups.
- Give icon-only global navigation buttons accessible labels.
- Support keyboard focus and native Enter/Space activation.
- Use `aria-haspopup` and `aria-expanded` for the profile menu trigger.

## Testing

Automated tests should cover:

- Menu configuration contains the expected global modules.
- Corrected labels are present and misspellings are absent.
- Selecting a module resolves its default path.
- Routing rules resolves to the full content view.
- Other leaf selections resolve to placeholder content.
- Expanded groups toggle without changing the active page.

Browser verification should cover:

- Switching through all five global modules.
- Expanding nested Settings and Reports groups.
- Returning to Routing rules.
- Opening and closing the profile menu.
- Checking long context menus for clipping and scroll behavior.
- Confirming the existing switches and load-based radio interaction still work.

## Out of Scope

- Production routing
- Persistent navigation state
- Real page content beyond Routing rules
- Authentication or account actions
- Responsive mobile navigation
- Backend APIs

